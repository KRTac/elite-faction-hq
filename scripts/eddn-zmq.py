#!/usr/bin/env python3

import zmq
import sys
import zlib
import json
import time
import signal
import humanize
import argparse
import datetime as dt
from pathlib import Path


def humanize_bytes(size):
    size = int(size)

    return f'{humanize.naturalsize(size, False, True, '%.2f')}{'' if size < 1024 else 'B'}'

def ordinal(n):
    n = int(n)

    if 10 <= n % 100 <= 20:
        suffix = 'th'
    else:
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')

    return f'{n}{suffix}'

def main():
    parser = argparse.ArgumentParser(description='Listens for and stores JSON messages on a EDDN style 0MQ socket untill you Ctrl+C or kill the process.')
    parser.add_argument(
        '--address',
        dest='address',
        type=str,
        default='tcp://eddn.edcd.io:9500',
        help='0MQ socket address. Defaults to EDDN live.'
    )
    parser.add_argument(
        '--output-root',
        dest='output_root',
        type=str,
        default='',
        help='JSON output root. Current directory is the default.'
    )
    parser.add_argument(
        '--indent',
        dest='indent',
        type=int,
        default=1,
        help='Number of spaces to indent the JSON output with. Set to 0 for the most compact output, one line per message.'
    )
    parser.add_argument(
        '--report-at',
        dest='report_at',
        type=int,
        default=500,
        help='Show a progress report every <report-at> number of messages. Also accepts 0.'
    )
    parser.add_argument(
        '--quiet',
        dest='quiet',
        action=argparse.BooleanOptionalAction,
        default=False,
        help='Suppress any CLI output. Still writes messages to the file.'
    )
    args = parser.parse_args()

    def output(*localArgs, **kwargs):
        if not args.quiet:
            print(*localArgs, **kwargs)

    filename_timestamp = time.strftime('%d-%m-%YT%H-%M-%S', time.gmtime())
    output_path = Path(args.output_root).resolve()
    output_path = output_path.joinpath(f'eddn-zmq-{filename_timestamp}.json')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_file = open(output_path, 'a', encoding='utf-8')

    total_msgs_size = 0
    total_uncompressed_size = 0
    msg_count = 0
    perf_start = time.perf_counter()

    def get_duration():
        perf_diff = int(time.perf_counter() - perf_start)
        hours, remainder = divmod(perf_diff, 60 * 60)
        minutes, seconds = divmod(remainder, 60)

        return f'{hours:02d}:{minutes:02d}:{seconds:02d}'

    def handle_termination(sig, frame):
        output(f'\nReceived {signal.Signals(sig).name} signal.')
        output(f'Closing out the output file with the following stats:')

        if output_file and not output_file.closed:
            output_file.close()

        duration = get_duration()

        file = open(output_path, 'rb+')
        file.seek(-2, 2)
        file.truncate()
        file.close()

        file = open(output_path, 'a', encoding='utf-8')
        file.write('\n]')
        file.write(f',"duration":{json.dumps(duration)}')
        file.write(f',"network_payload_bytes":{json.dumps(total_msgs_size)}')
        file.write(f',"uncompressed_json_bytes":{json.dumps(total_uncompressed_size)}')
        file.write('}')
        file.close()

        output(f'  - Total # of messages: {msg_count}')
        output(f'  - Duration: {duration}')
        output(f'  - Total network payload: {humanize_bytes(total_msgs_size)}')
        output(f'  - Total uncompressed JSON: {humanize_bytes(total_uncompressed_size)}\n')

        sys.exit(0)

    signal.signal(signal.SIGINT, handle_termination) # Ctrl+C
    signal.signal(signal.SIGTERM, handle_termination) # kill <proc>

    context = zmq.Context()

    socket = context.socket(zmq.SUB)
    socket.connect(args.address)
    socket.setsockopt_string(zmq.SUBSCRIBE, '')

    output(f'Listening to {args.address}...')
    output(f'Stop with Ctrl+C\n')

    output_file.write('{"messages":[\n')
    reassure_at = 10
    reassure_at = reassure_at if args.report_at > reassure_at else args.report_at

    with output_file as json_file:
        while True:
            message = socket.recv()
            decompressed = zlib.decompress(message)

            json.dump(
                json.loads(decompressed.decode('utf-8')),
                json_file,
                indent=None if args.indent == 0 else args.indent,
                separators=(',', ':') if args.indent == 0 else None
            )
            json_file.write(',\n')
            msg_count += 1
            total_msgs_size += len(message)
            total_uncompressed_size += len(decompressed)

            if args.report_at > 0:
                if msg_count == reassure_at and args.report_at > 1:
                    output(f'{reassure_at} messages came in so far...')
                    output(f'Will keep you posted every {ordinal(args.report_at)} message.\n')
                elif msg_count % args.report_at == 0:
                    output(f'Received {msg_count} messages so far.')
                    output(f'Duration: {get_duration()}')
                    output(f'Network payload: {humanize_bytes(total_msgs_size)}')
                    output(f'Uncompressed JSON: {humanize_bytes(total_uncompressed_size)}\n')

if __name__ == '__main__':
    main()

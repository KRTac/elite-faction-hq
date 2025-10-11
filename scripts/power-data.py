#!/usr/bin/env python3

import json
import time
from pprint import pprint
import argparse
from pathlib import Path
from datetime import datetime, timezone
from lib.string import slugify
from lib.elite import filter_state
from lib.spansh import power_search_params, request_search, get_search_systems


def generate_power_data(power_name):
    reference = request_search(power_search_params(power_name))
    results = get_search_systems(reference)
    systems = []

    for system in results:
        body_count = system['body_count'] if 'body_count' in system else 0
        population = system['population'] if 'population' in system else 0
        controlling_faction = system['controlling_minor_faction'] if 'controlling_minor_faction' in system else None
        controlling_faction_state = filter_state(system['controlling_minor_faction_state']) if 'controlling_minor_faction_state' in system else None

        government = system['government'] if 'government' in system else None
        allegiance = system['allegiance'] if 'allegiance' in system else None
        controlling_power = system['controlling_power'] if 'controlling_power' in system else None
        system_powers = system['power'] if 'power' in system else []

        power_conflicts = system['power_conflicts'] if 'power_conflicts' in system else None
        power_state = system['power_state'] if 'power_state' in system else 'Unoccupied'
        power_state_control_progress = system['power_state_control_progress'] if 'power_state_control_progress' in system else None
        power_state_reinforcement = system['power_state_reinforcement'] if 'power_state_reinforcement' in system else None
        power_state_undermining = system['power_state_undermining'] if 'power_state_undermining' in system else None
        power_conflict_power = None
        power_conflict_progress = None

        if power_conflicts and power_state == 'Unoccupied':
            power_conflict_progress = 0
            contested_count = 0

            for power in power_conflicts:
                if power['progress'] > 0.4:
                    contested_count += 1

                if power['progress'] > power_conflict_progress:
                    power_conflict_progress = power['progress']
                    power_conflict_power = power['name']
            
            if power_conflict_power == None:
                power_conflict_progress = None
            elif contested_count > 1:
                power_state = 'Contested'
            elif power_conflict_progress >= 0.02:
                power_state = 'Expansion'

        system_security = system['security'] if 'security' in system else None
        primary_economy = system['primary_economy'] if 'primary_economy' in system else None
        secondary_economy = system['secondary_economy'] if 'secondary_economy' in system else None

        updated_at = system['updated_at'] if 'updated_at' in system else None

        system_x = system['x'] if 'x' in system else None
        system_y = system['y'] if 'y' in system else None
        system_z = system['z'] if 'z' in system else None

        system_factions = []

        if 'minor_faction_presences' in system and system['minor_faction_presences']:
            system_factions = sorted(system['minor_faction_presences'], key=lambda f: f['influence'], reverse=True)
            system_factions = [ { **f, 'state': filter_state(f['state']) } for f in system_factions ]

        systems.append({
            'name': system['name'],
            'updated_at': updated_at,
            'coords': {
                'x': system_x,
                'y': system_y,
                'z': system_z
            },
            'government': government,
            'allegiance': allegiance,
            'population': population,
            'body_count': body_count,
            'security': system_security,
            'primary_economy': primary_economy,
            'secondary_economy': secondary_economy,
            'controlling_faction': controlling_faction,
            'controlling_faction_state': controlling_faction_state,
            'estimated_mapping_value': system['estimated_mapping_value'] if 'estimated_mapping_value' in system else None,
            'estimated_scan_value': system['estimated_scan_value'] if 'estimated_scan_value' in system else None,
            'landmark_value': system['landmark_value'] if 'landmark_value' in system else None,
            'is_being_colonised': system['is_being_colonised'] if 'is_being_colonised' in system else False,
            'is_colonised': system['is_colonised'] if 'is_colonised' in system else False,
            'spansh_system_id': system['id'] if 'id' in system else None,
            'factions': system_factions,
            'power_play': {
                'controlling': controlling_power,
                'state': power_state,
                'conflicts': power_conflicts,
                'conflict_power': power_conflict_power,
                'conflict_progress': power_conflict_progress,
                'control_progress': power_state_control_progress,
                'reinforcement': power_state_reinforcement,
                'undermining': power_state_undermining,
                'powers': system_powers
            }
        })

    return {
        'timestamp': datetime.now(timezone.utc).isoformat().split('.')[0] + 'Z',
        'import_duration': 0,
        'power': power_name,
        'systems': systems
    }

def main():
    parser = argparse.ArgumentParser(description='Generate ED power data JSON.')
    parser.add_argument(
        'power_name',
        nargs='?',
        type=str,
        help='One or more powers separated by a comma. Surround with quotes.'
    )
    parser.add_argument(
        '--config-json',
        dest='config_json',
        type=str,
        help='Config json with powers to lookup.'
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
        help='Number of spaces to indent the JSON output with. Set to 0 for the most compact output.'
    )
    parser.add_argument(
        '--quiet',
        dest='quiet',
        action=argparse.BooleanOptionalAction,
        default=False,
        help='Suppress any CLI output.'
    )
    args = parser.parse_args()

    def output(*localArgs, **kwargs):
        if not args.quiet:
            print(*localArgs, **kwargs)

    powers = []
    output_root = Path(args.output_root).resolve()
    config = {
        'power_data_root': ''
    }

    if args.config_json:
        config_path = Path(args.config_json).resolve()

        with open(config_path, 'r') as f:
            config = json.load(f)

    if not args.output_root and 'power_data_root' in config and config['power_data_root']:
        output_root = output_root.joinpath(config['power_data_root']).resolve()

    if args.power_name:
        if ',' in args.power_name:
            for name in args.power_name.split(','):
                name = name.strip(' ')

                if name:
                    powers.append({
                        'power': name
                    })
        else:
            powers.append({
                'power': args.power_name.strip(' ')
            })
    elif args.config_json and 'powers' in config:
        powers = config['powers']

    if not powers:
        output('No power specified.\n')
        output(parser.format_help())

        return

    if len(powers) > 1:
        output('Running imports for multiple powers.\n')

    for index, power_def in enumerate(powers):
        try:
            if index > 0:
                output('\n', end='')

            if 'power' not in power_def:
                output('Skipping definition, power not defined.')

                if not args.quiet:
                    pprint(power_def)

                continue

            perf_start = time.perf_counter()

            output(f'Power{f' #{index + 1}' if len(powers) > 1 else ''}: {power_def['power']}\n')

            output('Starting data import.\n')
            power_data = generate_power_data(power_def['power'])
            power_directory = slugify(power_def['power'])
            json_path = output_root.joinpath(f'{power_directory}/{power_data['timestamp'].replace(':', '-')}.json')
            json_path.parent.mkdir(parents=True, exist_ok=True)

            perf_diff = time.perf_counter() - perf_start
            power_data['import_duration'] = round(perf_diff, 2)

            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(
                    power_data,
                    f,
                    indent=None if args.indent <= 0 else args.indent,
                    separators=(',', ':') if args.indent <= 0 else None
                )

            output(f'{power_def['power']} import completed in {power_data['import_duration']} seconds.')
            output(f'{len(power_data['systems'])} systems proccessed.')
            output(f'Saved to {json_path}')
        except LookupError as ex:
            output(f'{power_def['power']} data lookup problem:')
            output(ex)
        except Exception as ex:
            output(ex)

if __name__ == '__main__':
    main()

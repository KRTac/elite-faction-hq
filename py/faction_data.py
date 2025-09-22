#!/usr/bin/env python3

import re
import json
import time
import requests
from pprint import pprint
import argparse
from pathlib import Path
from datetime import datetime, timezone
from urllib.parse import quote
from bs4 import BeautifulSoup


def lower_rest(s):
    if isinstance(s, str) and len(s) > 1:
        return s[0] + str(s[1:]).lower()

    return s

def filter_state(state):
    state = lower_rest(state)

    if state == 'Elections':
        state = 'Election'

    return state

def slugify(s):
    s = s.replace(' ', '_')
    s = re.sub(r'[^A-Za-z0-9_.-]', '', s)

    return s

def lookup_inara_id(faction_name):
    inara_faction_id = None

    inara_id_lookup_response = requests.get(f'https://inara.cz/elite/search/?search={quote(faction_name)}')
    inara_id_lookup_response.raise_for_status()

    inara_id_soup = BeautifulSoup(inara_id_lookup_response.text, 'html.parser')
    inara_id_anchors = inara_id_soup.find_all(
        'a',
        href=lambda x: x and x.startswith('/elite/minorfaction/'),
        class_=lambda c: c and 'listitem' in c
    )

    for anchor in inara_id_anchors:
        if anchor.get_text(strip=True).endswith(faction_name):
            inara_faction_id = anchor.get('href').strip('/').split('/')[-1]

            break

    return inara_faction_id

def generate_faction_data(faction_name, key_systems = [], inara_faction_id = None, allow_npc = False):
    origin_system = None
    is_npc = None
    system_satates_soup = None

    if inara_faction_id:
        system_states_response = requests.get(f'https://inara.cz/elite/minorfaction-states/{inara_faction_id}')
        system_states_response.raise_for_status()

        system_satates_soup = BeautifulSoup(system_states_response.text, 'html.parser')
        faction_info_wrappers = system_satates_soup.find_all('div', { 'class': 'itempaircontainer' })

        for wrapper in faction_info_wrappers:
            label = wrapper.find('div', { 'class': 'itempairlabel' }).get_text(strip=True)
            value = wrapper.find('div', { 'class': 'itempairvalue' }).get_text(strip=True)

            if not origin_system and label == 'Origin' and value:
                origin_system = value

            if is_npc is None and label == 'Player faction' and value:
                if value.lower() == 'no':
                    is_npc = True
                else:
                    is_npc = False

            if is_npc is not None and origin_system:
                break

        if not allow_npc and is_npc:
            raise Exception(f'{faction_name} in an NPC faction, skipping.')

    spansh_search_params = {
        'filters': {
            'minor_faction_presences': [{
                'comparison': '<=>',
                'name': {
                    'value': [ faction_name ]
                }
            }]
        },
        'sort': [ {
            'name': {
                'direction': 'asc'
            }
        } ],
        'size': 500,
        'page': 0
    }

    spansh_search_post_resp = requests.post('https://spansh.co.uk/api/systems/search/save', json=spansh_search_params)
    spansh_search_post_resp.raise_for_status()
    spansh_search_json = spansh_search_post_resp.json()

    if 'search_reference' not in spansh_search_json or not spansh_search_json['search_reference']:
        raise LookupError(f'No search results reference returned from Spansh for {faction_name}.')

    faction_presence_response = requests.get(f'https://spansh.co.uk/api/systems/search/recall/{spansh_search_json['search_reference']}')
    faction_presence_response.raise_for_status()
    faction_presence_json = faction_presence_response.json()

    if 'results' not in faction_presence_json or not faction_presence_json['results']:
        raise LookupError('No faction systems returned in the search.')

    systems = []

    filter_goverments = []
    filter_allegiances = []
    filter_powers = []
    filter_factions = []
    filter_active_states = []
    filter_pending_states = []
    filter_recovering_states = []

    system_states_wrapper = None

    key_systems = key_systems if type(key_systems) is list else []

    if system_satates_soup:
        system_states_wrapper = system_satates_soup.find('table', { 'class': 'tablesortercollapsed' })

    for system in faction_presence_json['results']:
        active_states = []
        pending_states = []
        recovering_states = []

        if system_states_wrapper:
            system_table_anchor = system_states_wrapper.find('a', string=system['name'], href=lambda x: x and x.startswith('/elite/starsystem/'))

            if system_table_anchor:
                system_cells = system_table_anchor.parent.parent.find_all('td')

                for span in system_cells[1].find_all('span'):
                    state = filter_state(span.get_text(strip=True))
                    recovering_states.append(state)

                    if state not in filter_recovering_states:
                        filter_recovering_states.append(state)

                for span in system_cells[2].find_all('span'):
                    state = filter_state(span.get_text(strip=True))
                    pending_states.append(state)

                    if state not in filter_pending_states:
                        filter_pending_states.append(state)

                for span in system_cells[3].find_all('span'):
                    state = filter_state(span.get_text(strip=True))
                    active_states.append(state)

                    if state not in filter_active_states:
                        filter_active_states.append(state)

        body_count = system['body_count'] if 'body_count' in system else 0
        population = system['population'] if 'population' in system else 0
        controlling_faction = system['controlling_minor_faction'] if 'controlling_minor_faction' in system else None
        controlling_faction_state = filter_state(system['controlling_minor_faction_state']) if 'controlling_minor_faction_state' in system else None

        government = system['government'] if 'government' in system else None
        if government and government not in filter_goverments:
            filter_goverments.append(government)

        allegiance = system['allegiance'] if 'allegiance' in system else None
        if allegiance and allegiance not in filter_allegiances:
            filter_allegiances.append(allegiance)

        controlling_power = system['controlling_power'] if 'controlling_power' in system else None

        system_powers = system['power'] if 'power' in system else []

        for power in system_powers:
            if power and power not in filter_powers:
                filter_powers.append(power)

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
        faction_influence = None
        faction_influence_close = False

        if 'minor_faction_presences' in system and system['minor_faction_presences']:
            other_influences = []
            system_factions = sorted(system['minor_faction_presences'], key=lambda f: f['influence'], reverse=True)
            system_factions = [ { **f, 'state': filter_state(f['state']) } for f in system_factions ]

            for faction in system_factions:
                if faction['name'] not in filter_factions:
                    filter_factions.append(faction['name'])

                if faction['name'] == faction_name:
                    faction_influence = faction['influence']
                    faction_state = faction['state']

                    if faction_state not in active_states:
                        active_states.append(faction_state)

                        if faction_state not in filter_active_states:
                            filter_active_states.append(faction_state)
                else:
                    other_influences.append(faction['influence'])
            
            if faction_influence and other_influences:
                for other_inf in other_influences:
                    if abs(faction_influence - other_inf) <= 0.05:
                        faction_influence_close = True

                        break

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
            'is_controlling_faction': controlling_faction == faction_name,
            'is_key_system': system['name'] == origin_system or system['name'] in key_systems,
            'faction_influence': faction_influence,
            'active_states': active_states,
            'pending_states': pending_states,
            'recovering_states': recovering_states,
            'is_faction_influence_close': faction_influence_close,
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
        'timestamp': datetime.now(timezone.utc).isoformat().split('.')[0].replace(':', '-') + 'Z',
        'import_duration': 0,
        'faction': faction_name,
        'inara_faction_id': inara_faction_id,
        'origin_system': origin_system,
        'systems': systems
        # 'filters': {
        #     'goverments': filter_goverments,
        #     'allegiances': filter_allegiances,
        #     'powers': filter_powers,
        #     'factions': filter_factions,
        #     'active_states': filter_active_states,
        #     'pending_states': filter_pending_states,
        #     'recovering_states': filter_recovering_states
        # }
    }

def main():
    parser = argparse.ArgumentParser(description='Generate ED faction data JSON.')
    parser.add_argument(
        'faction_name',
        nargs='?',
        type=str,
        help='One or more factions separated by a comma. Surround with quotes if any faction name contains spaces.'
    )
    parser.add_argument(
        '--config-json',
        dest='config_json',
        type=str,
        help='Config json with factions to lookup.'
    )
    parser.add_argument(
        '--inara-faction-id',
        dest='inara_faction_id',
        type=str,
        help='Inara faction id found in the URL. Optional.'
    )
    parser.add_argument(
        '--key-systems',
        dest='key_systems',
        type=str,
        default='',
        help='Comma separated list of systems that need to be designated as key systems. Optional.'
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
        '--allow-npc',
        dest='allow_npc',
        action=argparse.BooleanOptionalAction,
        default=False,
        help='Allow importing non-player factions.'
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

    factions = []
    output_root = Path(args.output_root).resolve()
    config = {
        'faction_data_path': ''
    }

    if args.config_json:
        config_path = Path(args.config_json).resolve()

        with open(config_path, 'r') as f:
            config = json.load(f)

    if not args.output_root and 'faction_data_path' in config and config['faction_data_path']:
        output_root = output_root.joinpath(config['faction_data_path']).resolve()

    if args.faction_name:
        if ',' in args.faction_name:
            for name in args.faction_name.split(','):
                name = name.strip(' ')

                if name:
                    factions.append({
                        'faction': name
                    })
        else:
            key_systems = [ x.strip(' ') for x in args.key_systems.split(',') if x.strip(' ') ]

            factions.append({
                'faction': args.faction_name.strip(' '),
                'key_systems': key_systems,
                'inara_faction_id': args.inara_faction_id.strip(' ')
            })
    elif args.config_json and 'factions' in config:
        factions = config['factions']

    if not factions:
        output('No faction specified.\n')
        output(parser.format_help())

        return

    if len(factions) > 1:
        output('Running imports for multiple factions.\n')

    for index, faction_def in enumerate(factions):
        try:
            if index > 0:
                output('\n', end='')

            if 'faction' not in faction_def:
                output('Skipping definition, faction not defined.')

                if not args.quiet:
                    pprint(faction_def)

                continue

            perf_start = time.perf_counter()

            output(f'Faction{f' #{index + 1}' if len(factions) > 1 else ''}: {faction_def['faction']}\n')

            if 'inara_faction_id' not in faction_def or not faction_def['inara_faction_id']:
                output('No Inara faction id set.')
                output('Attempting to get it trough Inara\'s search...')
                faction_def['inara_faction_id'] = lookup_inara_id(faction_def['faction'])
            
            if faction_def['inara_faction_id']:
                output(f'Inara faction page: https://inara.cz/elite/minorfaction/{faction_def['inara_faction_id']}/')
            else:
                output('Faction not found on Inara.\n')

            output('Starting data import.\n')
            faction_data = generate_faction_data(
                faction_def['faction'],
                faction_def['key_systems'] if 'key_systems' in faction_def else [],
                faction_def['inara_faction_id'],
                args.allow_npc
            )
            faction_directory = slugify(faction_def['faction'])
            json_path = output_root.joinpath(f'{faction_directory}/{faction_data['timestamp']}.json')
            json_path.parent.mkdir(parents=True, exist_ok=True)

            perf_diff = time.perf_counter() - perf_start
            faction_data['import_duration'] = round(perf_diff, 2)

            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(
                    faction_data,
                    f,
                    indent=None if args.indent <= 0 else args.indent,
                    separators=(',', ':') if args.indent <= 0 else None
                )

            output(f'{faction_def['faction']} import completed in {faction_data['import_duration']} seconds.')
            output(f'{len(faction_data['systems'])} systems proccessed.')
            output(f'Saved to {json_path}')
        except LookupError as ex:
            output(f'{faction_def['faction']} data lookup problem:')
            output(ex)
        except Exception as ex:
            output(ex)

if __name__ == '__main__':
    main()

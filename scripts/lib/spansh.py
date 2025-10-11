import requests
from math import ceil
from pprint import pprint


perPage = 500

def power_search_params(name):
    return {
        'filters': {
            'controlling_power': {
                'value': [ name ]
            }
        },
        'sort': [ {
            'name': {
                'direction': 'asc'
            }
        } ],
        'size': perPage,
        'page': 0
    }

def request_search(search_params):
    spansh_search_post_resp = requests.post('https://spansh.co.uk/api/systems/search/save', json=search_params)
    spansh_search_post_resp.raise_for_status()
    spansh_search_json = spansh_search_post_resp.json()

    if 'search_reference' not in spansh_search_json or not spansh_search_json['search_reference']:
        raise LookupError(f'No search results reference returned from Spansh.')

    return spansh_search_json['search_reference']

def get_search_systems(reference):
    page_index = 0
    page_count = None
    systems = []

    while page_count == None or page_index < page_count:
        page_part = f'/{page_index}' if page_index > 0 else ''

        presence_response = requests.get(f'https://spansh.co.uk/api/systems/search/recall/{reference}{page_part}')
        presence_response.raise_for_status()
        presence_json = presence_response.json()

        if 'results' not in presence_json or not presence_json['results']:
            raise LookupError(f'No systems returned in the search.')

        if page_count == None:
            page_count = ceil(presence_json['count'] / perPage)

        systems.extend(presence_json['results'])
        page_index += 1

    return systems
import { useEffect, useState } from 'react';
import { powers } from '../lib/elite';
import { useFactionTitle } from '../hooks/usePageTitle';
import GalaxyMap from './GalaxyMap';


function SystemsMapView({ groupBy, groups, systems }) {
  useFactionTitle('Map');
  const [ mapData, setMapData ] = useState({});

  useEffect(() => {
    const mapData = {
      categories: {},
      systems: []
    };

    if (groups.length === 1 && groups[0].name === 'Systems') {
      mapData.categories['Systems'] = {}
      let idx = 1;

      for (const system of groups[0].systems) {
        mapData.categories['Systems'][idx] = { name: system.name, color: 'cccccc' };
        mapData.systems.push({
          cat: [ idx ],
          coords: system.coords,
          name: system.name
        });

        idx += 1;
      }
    } else {
      let idx = 1;
      mapData.categories[groupBy] = {}
      let groupIds = {};

      if (groupBy === 'Faction priority') {
        mapData.categories[groupBy][1] = {
          name: 'Key systems',
          color: 'f54900'
        };
        mapData.categories[groupBy][2] = {
          name: 'Controlled',
          color: '7ccf00'
        };
        mapData.categories[groupBy][3] = {
          name: 'Uncontrolled',
          color: '74d4ff'
        };
        mapData.categories[groupBy][4] = {
          name: 'Colonies',
          color: 'cccccc'
        };
        groupIds = {
          'Key systems': 1,
          'Controlled': 2,
          'Uncontrolled': 3,
          'Colonies': 4
        };
      }

      for (const system of systems) {
        const systemGIds = [];

        for (const group of groups) {
          let groupName;
          let groupColor;

          if (groupBy === 'Controlling power') {
            if (
              group.name === system.power_play.controlling ||
              (system.power_play.controlling === null && group.name === 'None')
            ) {
              groupName = group.name;

              if (Object.keys(powers).includes(groupName)) {
                groupColor = powers[groupName].color.substr(1);
              } else if (groupName === 'None') {
                groupColor = 'cccccc';
              }
            }
          } else if (groupBy === 'Faction priority') {
            if (group.systemNames.includes(system.name)) {
              groupName = group.name;
            }
          }

          if (groupName) {
            if (!groupIds[groupName]) {
              const newId = idx++;
              groupIds[groupName] = newId;
              mapData.categories[groupBy][newId] = {
                name: groupName,
                color: groupColor
              };
            }

            systemGIds.push(groupIds[groupName]);

            if (groupBy === 'Controlling power') {
              break;
            }
          }
        }

        if (systemGIds.length) {
          mapData.systems.push({
            cat: systemGIds,
            coords: system.coords,
            name: system.name
          });
        }
      }

      const filteredGroupCategories = {};
      for (const catId of Object.keys(mapData.categories[groupBy])) {
        const catSystem = mapData.systems.find(sys => sys.cat.includes(Number(catId)));

        if (catSystem) {
          filteredGroupCategories[catId] = mapData.categories[groupBy][catId];
        }
      }

      mapData.categories[groupBy] = filteredGroupCategories;
    }

    setMapData(mapData);
  }, [ groupBy, groups, systems ]);

  return (
    <div className="relative h-full">
      <GalaxyMap data={mapData} />
    </div>
  );
}

export default SystemsMapView;

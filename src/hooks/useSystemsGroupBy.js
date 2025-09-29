import { createContext, useContext, useMemo } from 'react';
import useStorageState from 'use-storage-state';


export const SystemsGroupByContext = createContext(null);

export function useCreateSystemsGroupBy(systems) {
  const [ groupBy, setGroupBy ] = useStorageState('systems_groupBy', {
    defaultValue: 'None',
    sync: false
  });

  return useMemo(() => {
    let displayGroups = [];
    const allSystems = [];
    let coloniesGroupExists = false;

    for (const system of systems) {
      if (groupBy === 'Controlling power') {
        const power = system.power_play.controlling;
        let groupId = 'None';
        let didUpdate = false;

        if (power !== null) {
          groupId = power;
        }

        for (const i in displayGroups) {
          if (displayGroups[i].name !== groupId) {
            continue;
          }

          didUpdate = true;

          if (!displayGroups[i].systemNames.includes(system.name)) {
            displayGroups[i].systems.push(system);
            displayGroups[i].systemNames.push(system.name);
          } else {
            console.warn(`Skipping unexpected repeating system ${system.name} for group ${groupId}.`);
          }

          break;
        }

        if (!didUpdate) {
          displayGroups.push({
            name: groupId,
            systems: [ system ],
            systemNames : [ system.name ]
          });
        }
      } else if (groupBy === 'Faction priority') {
        let groupId = 'Uncontrolled';
        let didUpdate = false;

        if (system.is_key_system) {
          groupId = 'Key systems';
        } else if (system.is_controlling_faction) {
          groupId = 'Controlled';
        }

        if (
          !coloniesGroupExists &&
          (system.is_being_colonised || system.is_colonised)
        ) {
          coloniesGroupExists = true;
          displayGroups.push({
            name: 'Colonies',
            systems: [],
            systemNames : []
          });
        }

        for (const i in displayGroups) {
          if (
            (system.is_being_colonised || system.is_colonised) &&
            displayGroups[i].name === 'Colonies'
          ) {
            displayGroups[i].systems.push(system);
            displayGroups[i].systemNames.push(system.name);

            continue;
          }

          if (displayGroups[i].name !== groupId) {
            continue;
          }

          didUpdate = true;

          if (!displayGroups[i].systemNames.includes(system.name)) {
            displayGroups[i].systems.push(system);
            displayGroups[i].systemNames.push(system.name);
          } else {
            console.warn(`Skipping unexpected repeating system ${system.name} for group ${groupId}.`);
          }
        }

        if (!didUpdate) {
          displayGroups.push({
            name: groupId,
            systems: [ system ],
            systemNames : [ system.name ]
          });
        }
      } else {
        allSystems.push(system);
      }
    }

    if (displayGroups.length === 0) {
      displayGroups = [{
        name: 'Systems',
        systems: allSystems
      }];
    } else {
      if (groupBy === 'Faction priority') {
        const groupOrder = [
          'Key systems', 'Controlled', 'Uncontrolled', 'Colonies'
        ];
        const orderedGroups = [];

        for (const order of groupOrder) {
          for (const group of displayGroups) {
            if (group.name === order) {
              orderedGroups.push(group);

              break;
            }
          }
        }

        displayGroups = orderedGroups;
      } else {
        displayGroups.sort((a, b) => b.systems.length - a.systems.length);
      }
    }

    return {
      groupBy,
      setGroupBy,
      groups: displayGroups
    };
  }, [ groupBy, systems ]);
}

function useSystemsGroupBy() {
  return useContext(SystemsGroupByContext);
}

export default useSystemsGroupBy;

import { powers } from './elite';


export function combineMapData(datasets) {
  const existing = [];
  const systems = [];
  const categories = {};
  let groupIdx = 0;
  const groups = {}

  for (const dataset of datasets) {
    if (!categories[dataset.faction]) {
      categories[dataset.faction] = {};
      groups[dataset.faction] = groupIdx++;
    }

    const idx = groups[dataset.faction];

    const keySystemsId = 1 + idx * 10;
    const controlledId = 2 + idx * 10;
    const uncontrolledId = 3 + idx * 10;
    const coloniesId = 4 + idx * 10;
    let hasKey = false;
    let hasControlled = false;
    let hasUncontrolled = false;
    let hasColonies = false;

    for (const system of dataset.systems) {
      if (!existing.includes(system.name)) {
        systems.push({
          name: system.name,
          coords: system.coords,
          cat: []
        });
        existing.push(system.name);
      }

      const target = systems.find(s => s.name === system.name);

      if (system.is_key_system && !target.cat.includes(keySystemsId)) {
        target.cat.push(keySystemsId);
        hasKey = true;
      } else if (system.is_controlling_faction && !target.cat.includes(controlledId)) {
        target.cat.push(controlledId);
        hasControlled = true;
      } else if (!target.cat.includes(uncontrolledId)) {
        target.cat.push(uncontrolledId);
        hasUncontrolled = true;
      }

      if (
        (system.is_colonised || system.is_being_colonised) &&
        !target.cat.includes(coloniesId)
      ) {
        target.cat.push(coloniesId);
        hasColonies = true;
      }
    }

    if (hasKey) {
      categories[dataset.faction][keySystemsId] = {
        name: 'Key systems',
        color: 'f54900'
      };
    }

    if (hasControlled) {
      categories[dataset.faction][controlledId] = {
        name: 'Controlled',
        color: '7ccf00'
      };
    }

    if (hasUncontrolled) {
      categories[dataset.faction][uncontrolledId] = {
        name: 'Uncontrolled',
        color: '74d4ff'
      };
    }

    if (hasColonies) {
      categories[dataset.faction][coloniesId] = {
        name: 'Colonies',
        color: 'cccccc'
      };
    }
  }

  return { categories, systems };
}

export function generateMapData(groupBy, groups, systems) {
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

  return mapData;
}

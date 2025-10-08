import { engineerSystems, notableSystems, powerColor, powerHqSystems } from './elite';


export function generateMapData(categories) {
  const _categories = {};
  const systems = [];
  const addedSystems = {};
  let idx = 1;

  for (const groupBy of Object.keys(categories)) {
    _categories[groupBy] = {};

    for (const group of categories[groupBy]) {
      const groupName = group.name;
      let groupColor;

      switch (groupBy) {
        case 'Controlling power':
          groupColor = powerColor(groupName);
          break;

        case 'Faction priority':
          switch (groupName) {
            case 'Key systems':
              groupColor = '#f54900';
              break;

            case 'Controlled':
              groupColor = '#7ccf00';
              break;

            case 'Uncontrolled':
              groupColor = '#74d4ff';
              break;

            case 'Colonies':
              groupColor = '#cccccc';
              break;

            default:
          }
          break;

        case 'Comparison':
          switch (groupName) {
            case 'Added systems':
              groupColor = '#7ccf00';
              break;

            case 'Removed systems':
              groupColor = '#e7000b';
              break;

            case 'Controlling faction changed':
              groupColor = '#c800de';
              break;

            case 'Colonisation finished':
              groupColor = '#fdc700';
              break;

            case 'Influence changed':
              groupColor = '#a2f4fd';
              break;

            default:
          }
          break;

        case 'References':
          groupColor = '#bbbbbb';
          break;

        default:
          groupColor = '#cccccc';
      }

      _categories[groupBy][idx++] = {
        name: groupName,
        color: toMapColor(groupColor)
      };

      for (const system of group.systems) {
        let systemIdx = addedSystems[system.name];

        if (systemIdx === undefined) {
          systemIdx = systems.length;
          addedSystems[system.name] = systemIdx;

          systems.push({
            cat: [],
            coords: system.coords,
            name: system.name
          });
        }

        systems[systemIdx].cat.push(idx - 1);
      }
    }
  }

  return {
    categories: _categories,
    systems
  };
}

export function toMapColor(c) {
  return c.substr(1);
}

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

const availableReferenceSystems = {
  'Notable': notableSystems,
  'Power HQs': powerHqSystems,
  'Ship engineers': engineerSystems
};

function referenceSystemOptions(category) {
  return availableReferenceSystems[category].map(s => {
    let label;

    if (category === 'Notable') {
      label = s._meta.notable.short;
    } else if (category === 'Power HQs') {
      label = s._meta.power.short;
    } else if (category === 'Ship engineers') {
      label = s._meta.engineer.short;
    }

    return {
      label,
      value: s.name
    };
  });
}

export const availableReferenceCategories = Object.keys(availableReferenceSystems);
export const availableReferenceOptions = {};

for (const cat of availableReferenceCategories) {
  availableReferenceOptions[cat] = referenceSystemOptions(cat);
}

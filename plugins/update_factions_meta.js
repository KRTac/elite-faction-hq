import fs from 'fs';
import path from 'path';


function filenameToDate(name) {
  const nameTimestamp = name.split('.json')[0];
  const parts = nameTimestamp.split('T');

  return new Date(`${parts[0]}T${parts[1].replaceAll('-', ':')}`);
}

export function generatePowersMeta(dataRoot, allPowers) {
  const powers = [];

  if (!fs.existsSync(dataRoot)) {
    console.log('Power data directory doesn\'t exist.');
    console.log(dataRoot);

    return powers;
  }

  if (!fs.statSync(dataRoot).isDirectory()) {
    console.log('Power data directory invalid.');
    console.log(dataRoot);

    return powers;
  }

  const powerDirs = fs.readdirSync(dataRoot);

  if (!powerDirs.length) {
    console.log('No powers found in the data directory.');
    console.log(dataRoot);

    return powers;
  }

  for (const powerDir of powerDirs) {
    const powerPath = path.join(dataRoot, powerDir);

    if (!fs.statSync(powerPath).isDirectory()) {
      continue;
    }

    const powerFiles = fs.readdirSync(powerPath)
      .filter(filename => filename.endsWith('.json'))
      .sort((a, b) => {
        let aDate = filenameToDate(a);
        let bDate = filenameToDate(b);

        return bDate - aDate;
      });

    if (!powerFiles.length) {
      console.log(`No power JSON data found in ${powerPath}`);

      continue;
    }

    const power = {
      name: null,
      directory: null,
      system_count: 0,
      datasets: []
    };

    for (let file of powerFiles) {
      file = path.join(powerPath, file);

      if (!fs.statSync(file).isFile()) {
        continue;
      }

      if (!power.name) {
        const json = fs.readFileSync(file, { encoding: 'utf-8' });
        const dataset = JSON.parse(json);

        const powerConfig = allPowers.find(f => f.power === dataset.power);

        if (!powerConfig) {
          console.log(`No power config found for ${dataset.power}, skipping it...`)

          break;
        }

        power.name = dataset.power;
        power.system_count = dataset.systems.length;
        power.directory = powerDir;
      }

      power.datasets.push(file.split('/').pop().split('.')[0]);
    }

    if (power.name) {
      powers.push(power);
    }
  }

  return powers;
}

export function generateFactionsMeta(dataRoot, allFactions) {
  const factions = [];

  if (!fs.existsSync(dataRoot)) {
    console.log('Faction data directory doesn\'t exist.');
    console.log(dataRoot);

    return factions;
  }

  if (!fs.statSync(dataRoot).isDirectory()) {
    console.log('Faction data directory invalid.');
    console.log(dataRoot);

    return factions;
  }

  const factionDirs = fs.readdirSync(dataRoot);

  if (!factionDirs.length) {
    console.log('No factions found in the data directory.');
    console.log(dataRoot);

    return factions;
  }

  for (const factionDir of factionDirs) {
    const factionPath = path.join(dataRoot, factionDir);

    if (!fs.statSync(factionPath).isDirectory()) {
      continue;
    }

    const factionFiles = fs.readdirSync(factionPath)
      .filter(filename => filename.endsWith('.json'))
      .sort((a, b) => {
        let aDate = filenameToDate(a);
        let bDate = filenameToDate(b);

        return bDate - aDate;
      });

    if (!factionFiles.length) {
      console.log(`No faction JSON data found in ${factionPath}`);

      continue;
    }

    const faction = {
      name: null,
      directory: null,
      origin_system: null,
      inara_faction_id: null,
      system_count: 0,
      key_systems: [],
      datasets: []
    };

    for (let file of factionFiles) {
      file = path.join(factionPath, file);

      if (!fs.statSync(file).isFile()) {
        continue;
      }

      if (!faction.name) {
        const json = fs.readFileSync(file, { encoding: 'utf-8' });
        const dataset = JSON.parse(json);

        const factionConfig = allFactions.find(f => f.faction === dataset.faction);

        if (!factionConfig) {
          console.log(`No faction config found for ${dataset.faction}, skipping it...`)

          break;
        }

        faction.name = dataset.faction;
        faction.origin_system = dataset.origin_system;
        faction.system_count = dataset.systems.length;
        faction.inara_faction_id = dataset.inara_faction_id;
        faction.directory = factionDir;
        faction.key_systems = factionConfig.key_systems ?? [];
      }

      faction.datasets.push(file.split('/').pop().split('.')[0]);
    }

    if (faction.name) {
      factions.push(faction);
    }
  }

  return factions;
}

export default function updateFactionsMeta() {
  return {
    name: 'update_factions_meta',
    buildStart() {
      const config = JSON.parse(fs.readFileSync('hq-config.json', 'utf8'));
      // eslint-disable-next-line no-undef
      const data_root = path.join(process.cwd(), config.faction_data_root);

      const meta = generateFactionsMeta(data_root, config.factions);

      const timestamp = (new Date()).toISOString().split('.')[0] + 'Z';

      let metaJson = 'window.factions_meta = {';
      metaJson += `"generated_at":${JSON.stringify(timestamp)},`;
      metaJson += '"factions":[\n';

      for (const i in meta) {
        metaJson += JSON.stringify(meta[i]);

        if (i < meta.length - 1) {
          metaJson += ',\n';
        }
      }

      if (meta.length) {
        metaJson += '\n';
      }

      metaJson += ']};\n';

      const metaPath = path.join(data_root, 'meta.js');
      fs.writeFileSync(metaPath, metaJson);
    }
  };
}

export function updatePowersMeta() {
  return {
    name: 'update_powers_meta',
    buildStart() {
      const config = JSON.parse(fs.readFileSync('hq-config.json', 'utf8'));
      // eslint-disable-next-line no-undef
      const data_root = path.join(process.cwd(), config.power_data_root);

      const meta = generatePowersMeta(data_root, config.powers);

      const timestamp = (new Date()).toISOString().split('.')[0] + 'Z';

      let metaJson = 'window.powers_meta = {';
      metaJson += `"generated_at":${JSON.stringify(timestamp)},`;
      metaJson += '"powers":[\n';

      for (const i in meta) {
        metaJson += JSON.stringify(meta[i]);

        if (i < meta.length - 1) {
          metaJson += ',\n';
        }
      }

      if (meta.length) {
        metaJson += '\n';
      }

      metaJson += ']};\n';

      const metaPath = path.join(data_root, 'meta.js');
      fs.writeFileSync(metaPath, metaJson);
    }
  };
}
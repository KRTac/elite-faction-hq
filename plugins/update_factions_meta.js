import fs from 'fs';
import path from 'path';


function filenameToDate(name) {
  const nameTimestamp = name.split('.json')[0];
  const parts = nameTimestamp.split('T');

  return new Date(`${parts[0]}T${parts[1].replaceAll('-', ':')}`);
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
      console.log(`No Faction JSON data found in ${factionPath}`);

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

      metaJson += ']}\n';

      const metaPath = path.join(data_root, 'meta.js');
      fs.writeFileSync(metaPath, metaJson);
    }
  };
}
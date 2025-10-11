import fs from 'fs';
import path from 'path';


function filenameToDate(name) {
  const nameTimestamp = name.split('.json')[0];
  const parts = nameTimestamp.split('T');

  return new Date(`${parts[0]}T${parts[1].replaceAll('-', ':')}`);
}

export function generateDatasetsMeta(dataRoot, allSubjects) {
  const subjects = [];

  if (!fs.existsSync(dataRoot)) {
    console.log('Root data directory doesn\'t exist.');
    console.log(dataRoot);

    return subjects;
  }

  if (!fs.statSync(dataRoot).isDirectory()) {
    console.log('Root data directory invalid.');
    console.log(dataRoot);

    return subjects;
  }

  const subjectDirs = fs.readdirSync(dataRoot);

  if (!subjectDirs.length) {
    console.log('No subjects found in the data directory.');
    console.log(dataRoot);

    return subjects;
  }

  for (const subjectDir of subjectDirs) {
    const subjectPath = path.join(dataRoot, subjectDir);

    if (!fs.statSync(subjectPath).isDirectory()) {
      continue;
    }

    const subjectFiles = fs.readdirSync(subjectPath)
      .filter(filename => filename.endsWith('.json'))
      .sort((a, b) => {
        let aDate = filenameToDate(a);
        let bDate = filenameToDate(b);

        return bDate - aDate;
      });

    if (!subjectFiles.length) {
      console.log(`No JSON data found in ${subjectPath}`);

      continue;
    }

    const subject = {
      name: null,
      directory: null,
      origin_system: null,
      system_count: 0,
      datasets: []
    };

    for (let file of subjectFiles) {
      file = path.join(subjectPath, file);

      if (!fs.statSync(file).isFile()) {
        continue;
      }

      if (!subject.name) {
        const json = fs.readFileSync(file, { encoding: 'utf-8' });
        const dataset = JSON.parse(json);
        const isPower = !!dataset.power;
        subject.name = isPower ? dataset.power : dataset.faction;

        const factionConfig = allSubjects.find(isPower
          ? f => f.power === dataset.power
          : f => f.faction === dataset.faction
        );

        if (!factionConfig) {
          console.log(`No config found for ${subject.name}, skipping it...`);

          break;
        }

        subject.directory = subjectDir;
        subject.origin_system = isPower ? factionConfig.origin_system : dataset.origin_system;
        subject.system_count = dataset.systems.length;

        if (!isPower) {
          subject['inara_faction_id'] = dataset.inara_faction_id;
          subject['key_systems'] = factionConfig.key_systems ?? [];
        }
      }

      subject.datasets.push(file.split('/').pop().split('.')[0]);
    }

    if (subject.name) {
      subjects.push(subject);
    }
  }

  return subjects;
}

export default function updateDatasetsMeta() {
  return {
    name: 'update_datasets_meta',
    buildStart() {
      const config = JSON.parse(fs.readFileSync('hq-config.json', 'utf8'));
      // eslint-disable-next-line no-undef
      const data_root = path.join(process.cwd(), config.data_root);

      const factionsMeta = generateDatasetsMeta(path.join(data_root, 'factions'), config.factions);
      const powersMeta = generateDatasetsMeta(path.join(data_root, 'powers'), config.powers);

      const timestamp = (new Date()).toISOString().split('.')[0] + 'Z';

      let metaJson = 'window.datasets_meta = {';
      metaJson += `"generated_at":${JSON.stringify(timestamp)},`;
      metaJson += '"powers":[\n';

      for (const i in powersMeta) {
        metaJson += JSON.stringify(powersMeta[i]);

        if (i < powersMeta.length - 1) {
          metaJson += ',\n';
        }
      }

      if (powersMeta.length) {
        metaJson += '\n';
      }

      metaJson += '],"factions":[\n';

      for (const i in factionsMeta) {
        metaJson += JSON.stringify(factionsMeta[i]);

        if (i < factionsMeta.length - 1) {
          metaJson += ',\n';
        }
      }

      if (factionsMeta.length) {
        metaJson += '\n';
      }

      metaJson += ']};\n';

      const metaPath = path.join(data_root, 'meta.js');
      fs.writeFileSync(metaPath, metaJson);
    }
  };
}

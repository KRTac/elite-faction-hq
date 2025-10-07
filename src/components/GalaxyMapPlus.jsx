import { useMemo } from 'react';
import useStorageState from 'use-storage-state';
import { generateMapData } from '../lib/ed3d';
import GalaxyMap from './GalaxyMap';


function GalaxyMapPlus({ groupBy, groups }) {
  const [ showReferences, setShowReferences ] = useStorageState('systemsMap_showReferences', {
    defaultValue: true,
    sync: false
  });

  const mapData = useMemo(
    () => {
      const categories = {};
      categories[groupBy] = groups;

      if (showReferences) {
        categories['References'] = [
          {
            name: 'Ship engineers',
            systems: [
              {
                name: 'Eurybia',
                coords: { x: 51.41, y: -54.41 , z: -30.5 }
              },
              {
                name: 'Laksak',
                coords: { x: -21.53, y: -6.31, z: 116.03 }
              },
              {
                name: 'Giryak',
                coords: { x: 14.69, y: 27.66, z: 108.66 }
              },
              {
                name: 'Kuwemaki',
                coords: { x: 134.66, y: -226.91, z: -7.81 }
              },
              {
                name: 'Alioth',
                coords: { x: -33.66, y: 72.47, z: -20.66 }
              },
              {
                name: 'Muang',
                coords: { x: 17.03, y: -172.78, z: -3.47 }
              },
              {
                name: 'Shenve',
                coords: { x: 351.97, y: -373.47, z: -711.09 }
              },
              {
                name: 'Leesti',
                coords: { x: 72.75, y: 48.75, z: 68.25 }
              },
              {
                name: 'Khun',
                coords: { x: -171.59, y: 19.97, z: -56.97 }
              },
              {
                name: 'Deciat',
                coords: { x: 122.63, y: -0.81, z: -47.28 }
              },
              {
                name: 'Yoru',
                coords: { x: 97.88, y: -86.91 , z: 64.13 }
              },
              {
                name: 'Wolf 397',
                coords: { x: 40, y: 79.22, z: -10.41 }
              },
              {
                name: 'Achenar',
                coords: { x: 67.5, y: -119.47, z: 24.84 }
              },
              {
                name: 'Beta-3 Tucani',
                coords: { x: 32.25, y: -55.19, z: 23.88 }
              },
              {
                name: 'Wyrd',
                coords: { x: -11.63, y: 31.53, z: -3.94 }
              },
              {
                name: 'Kuk',
                coords: { x: -21.28, y: 69.09, z: -16.31 }
              },
              {
                name: 'Meene',
                coords: { x: 118.78, y: -56.44, z: -97.19 }
              },
              {
                name: 'Arque',
                coords: { x: 66.5, y: 38.06, z: 61.13 }
              },
              {
                name: 'Sirius',
                coords: { x: 6.25, y: -1.28, z: -5.75 }
              },
              {
                name: 'Sol',
                coords: { x: 0, y: 0, z: 0 }
              },
              {
                name: 'Shinrarta Dezhra',
                coords: { x: 55.72, y: 17.59, z: 27.16 }
              }
            ]
          }
        ];
      }

      return generateMapData(categories);
    },
    [ groupBy, groups, showReferences ]
  );

  return (
    <div className="relative h-full">
      <GalaxyMap data={mapData} />
    </div>
  );
}

export default GalaxyMapPlus;

import { useCallback, useEffect, useRef } from 'react';
import Button from './inputs/Button';
import { powers } from '../lib/elite';


const postTargetOrigin = import.meta.env.VITE_PROTOCOL_HOSTNAME;

function SystemsMapView({ groupBy, groups, systems, debug = false }) {
  const iframeRef = useRef(null);
  const iframeLoaded = useRef(false);

  const sendDebug = useCallback(() => {
    iframeRef.current.contentWindow.postMessage({ type: 'debug' }, postTargetOrigin);
  }, []);

  const sendMapData = useCallback((_groupBy, _groups, _systems) => {
    const mapData = {
      categories: {},
      systems: []
    };

    if (_groups.length === 1 && _groups[0].name === 'Systems') {
      mapData.categories['Systems'] = {}
      let idx = 1;

      for (const system of _groups[0].systems) {
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
      mapData.categories[_groupBy] = {}
      let groupIds = {};

      if (_groupBy === 'Faction priority') {
        mapData.categories[_groupBy][1] = {
          name: 'Key systems',
          color: 'f54900'
        };
        mapData.categories[_groupBy][2] = {
          name: 'Controlled',
          color: '7ccf00'
        };
        mapData.categories[_groupBy][3] = {
          name: 'Uncontrolled',
          color: '74d4ff'
        };
        mapData.categories[_groupBy][4] = {
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

      for (const system of _systems) {
        const systemGIds = [];

        for (const group of _groups) {
          let groupName;
          let groupColor;

          if (_groupBy === 'Controlling power') {
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
          } else if (_groupBy === 'Faction priority') {
            if (group.systemNames.includes(system.name)) {
              groupName = group.name;
            }
          }

          if (groupName) {
            if (!groupIds[groupName]) {
              const newId = idx++;
              groupIds[groupName] = newId;
              mapData.categories[_groupBy][newId] = {
                name: groupName,
                color: groupColor
              };
            }

            systemGIds.push(groupIds[groupName]);

            if (_groupBy === 'Controlling power') {
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
      for (const catId of Object.keys(mapData.categories[_groupBy])) {
        const catSystem = mapData.systems.find(sys => sys.cat.includes(Number(catId)));

        if (catSystem) {
          filteredGroupCategories[catId] = mapData.categories[_groupBy][catId];
        }
      }

      mapData.categories[_groupBy] = filteredGroupCategories;
    }

    iframeRef.current.contentWindow.postMessage({
      type: 'update',
      mapData
    }, postTargetOrigin);
  }, []);

  useEffect(() => {
    if (!iframeLoaded.current) {
      return;
    }

    sendMapData(groupBy, groups, systems);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ groupBy, groups, systems ]);

  const handleLoad = iframeLoaded.current
    ? undefined
    : () => {
      sendMapData(groupBy, groups, systems);

      iframeLoaded.current = true;
    };

  return (
    <>
      <iframe
        ref={iframeRef}
        src={`${import.meta.env.BASE_URL}edmap.html`}
        title="Galaxy map"
        className="border-0 absolute top-0 left-0 w-full h-full"
        onLoad={handleLoad}
      />
      {import.meta.env.DEV && debug && (
        <div className="border-0 absolute bottom-0 right-0 mb-3 mr-3">
          <Button onClick={sendDebug}>Debug</Button>
        </div>
      )}
    </>
  );
}

export default SystemsMapView;

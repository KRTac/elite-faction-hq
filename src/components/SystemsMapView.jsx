import { useCallback, useEffect, useRef } from 'react';
import Button from './inputs/Button';


function SystemsMapView({ systems, debug = false }) {
  const iframeRef = useRef(null);
  const iframeLoaded = useRef(false);

  const sendDebug = useCallback(() => {
    iframeRef.current.contentWindow.postMessage({ type: 'debug' }, '/');
  }, []);

  const sendSystemUpdate = useCallback(systems => {
    const systemsCategory = {};
    const mapSystems = [];

    let systemCatCounter = 1;
    for (const system of systems) {
      let catId = systemCatCounter++;

      mapSystems.push({
        name: system.name,
        coords: { ...system.coords },
        cat: [ catId ]
      });

      systemsCategory[catId + ''] = {
        name: system.name
      }
    }

    iframeRef.current.contentWindow.postMessage({
      type: 'update',
      mapData: {
        categories: {
          Systems: systemsCategory
        },
        systems: mapSystems
      }
    }, '/');
  }, []);

  useEffect(() => {
    if (!iframeLoaded.current) {
      return;
    }

    sendSystemUpdate(systems);
  }, [ systems ]);

  const handleLoad = iframeLoaded.current
    ? undefined
    : () => {
      sendSystemUpdate(systems);

      iframeLoaded.current = true;
    };

  return (
    <>
    <iframe
      ref={iframeRef}
      src={`${import.meta.env.BASE_URL}edmap.html`}
      title="Map frame"
      className="border-0 absolute top-0 left-0 w-full h-full"
      onLoad={handleLoad}
    />
    {import.meta.env.DEV && debug && (
      <div className="border-0 absolute bottom-0 right-0 mb-3 mr-3">
        <Button
          onClick={sendDebug}
        >
          Debug
        </Button>
      </div>
    )}
    </>
  );
}

export default SystemsMapView;

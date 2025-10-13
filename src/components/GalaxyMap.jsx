import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Button from './inputs/Button';


const postTargetOrigin = import.meta.env.VITE_PROTOCOL_HOSTNAME;

function GalaxyMap({ data, debug = false }) {
  const [ url, setUrl ] = useState('');
  const iframeRef = useRef(null);
  const iframeLoaded = useRef(false);

  const sendDebug = useCallback(() => {
    iframeRef.current.contentWindow.postMessage(
      { type: 'debug' },
      postTargetOrigin
    );
  }, []);

  const sendData = useCallback(mapData => {
    iframeRef.current.contentWindow.postMessage(
      { type: 'update', mapData },
      postTargetOrigin
    );
  }, []);

  useLayoutEffect(() => {
    setUrl(`${import.meta.env.BASE_URL}edmap.html`);

    return () => {
      setUrl('');
      iframeLoaded.current = false;
    };
  }, []);

  useEffect(() => {
    if (!iframeLoaded.current) {
      return;
    }

    sendData(data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data ]);

  const handleLoad = iframeLoaded.current
    ? undefined
    : () => {
      sendData(data);

      iframeLoaded.current = true;
    };

  return (
    <>
      {url && (
        <iframe
          ref={iframeRef}
          src={url}
          title="Galaxy map"
          className="border-0 absolute top-0 left-0 w-full h-full"
          onLoad={handleLoad}
        />
      )}
      {import.meta.env.DEV && debug && (
        <div className="absolute bottom-0 right-0 mb-3 mr-3">
          <Button onClick={sendDebug} smaller>Debug</Button>
        </div>
      )}
    </>
  );
}

export default GalaxyMap;

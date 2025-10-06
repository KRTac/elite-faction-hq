import { useMemo } from 'react';
import { useFactionTitle } from '../hooks/usePageTitle';
import GalaxyMap from './GalaxyMap';
import { generateMapData } from '../lib/ed3d';


function SystemsMapView({ groupBy, groups, systems }) {
  useFactionTitle('Map');
  const mapData = useMemo(
    () => generateMapData(groupBy, groups, systems),
    [ groupBy, groups, systems ]
  );

  return (
    <div className="relative h-full">
      <GalaxyMap data={mapData} />
    </div>
  );
}

export default SystemsMapView;

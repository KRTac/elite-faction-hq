import { useFactionTitle } from '../hooks/usePageTitle';
import GalaxyMapPlus from './GalaxyMapPlus';


function SystemsMapView({ groupBy, groups }) {
  useFactionTitle('Map');

  return (
    <GalaxyMapPlus groupBy={groupBy} groups={groups} />
  );
}

export default SystemsMapView;

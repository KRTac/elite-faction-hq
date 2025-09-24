import { createLazyFileRoute } from '@tanstack/react-router';
import FactionDetails from '../../components/FactionDetails';
import FactionStats from '../../components/FactionStats';


function Details() {
  return (
    <div className="flex-1 relative overflow-y-scroll">
      <div className="m-auto max-w-7xl">
        <FactionDetails />
        <FactionStats />
      </div>
    </div>
  );
}

export const Route = createLazyFileRoute('/$factionDir/details')({
  component: Details
});

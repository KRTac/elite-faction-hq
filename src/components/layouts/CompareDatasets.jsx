import { useCreateFactionDataset } from "../../hooks/useFactionDataset";
import { combineMapData } from "../../lib/ed3d";
import GalaxyMap from "../GalaxyMap";


function CompareDatasets({ datasetA, datasetB }) {
  const factionA = useCreateFactionDataset(datasetA);
  const factionB = useCreateFactionDataset(datasetB);
  const mapData = combineMapData([ factionA, factionB ]);
  const sameFaction = factionA.faction === factionB.faction;

  if (sameFaction && new Date(factionA.timestamp) - new Date(factionB.timestamp <= 0)) {
    throw new Error('B dataset must be older.');
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 h-full">
      <div className="basis-1/3 grow max-w-lg">
        Text
      </div>
      <div className="basis-2/3 grow h-full relative">
        <GalaxyMap data={mapData} />
      </div>
    </div>
  );
}

export default CompareDatasets;

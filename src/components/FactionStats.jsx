import useFaction from '../hooks/useFaction';
import useFactionDataset from '../hooks/useFactionDataset';


function StatsItem({ stat, ...rest }) {
  const { systems } = useFactionDataset();

  return (
    <li className="relative px-2 py-0.5 my-1 hover:bg-neutral-800 rounded-md" { ...rest }>
      <span
        className="absolute top-0 left-0 bg-emerald-800 h-full rounded-md"
        style={{ width: `${(stat.occurrence / systems.length) * 100}%`}}
      />
      <span className="flex justify-between relative">
        <span className="font-bold text-amber-100">{stat.value}</span>
        <span className="font-bold text-amber-50">{stat.occurrence}</span>
      </span>
    </li>
  );
}

function StatsBox({ label, items, ...rest }) {
  return (
    <div className="rounded bg-neutral-900 py-1 px-1.5" { ...rest }>
      <p className="text-center text-lg mb-2">{label}</p>
      <ol className="overflow-y-scroll relative max-h-72">
        {items.map(item => <StatsItem key={item.value} stat={item} />)}
      </ol>
    </div>
  );
}

function FactionStats() {
  const { isPower } = useFaction();
  const { stats } = useFactionDataset();

  return (
    <div
      className={[
        'grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,300px))] justify-center',
        'py-2 px-4'
      ].join(' ')}
    >
      <div>
        <StatsBox label="Controlling factions" items={stats.controllingFactions} />
      </div>
      {!isPower && (
        <div>
          <StatsBox label="Controlling powers" items={stats.controllingPowers} />
        </div>
      )}
      <div>
        <StatsBox label="All powers present" items={stats.powers} />
      </div>
      <div>
        <StatsBox label="Power states" items={stats.powerStates} />
      </div>
      {!isPower && (
        <>
          <div>
            <StatsBox label="Active system faction states" items={stats.activeStates} />
          </div>
          <div>
            <StatsBox label="Pending system faction states" items={stats.pendingStates} />
          </div>
          <div>
            <StatsBox label="Recovering system faction states" items={stats.recoveringStates} />
          </div>
        </>
      )}
      <div>
        <StatsBox label="Governments" items={stats.governments} />
      </div>
      <div>
        <StatsBox label="Allegiances" items={stats.allegiances} />
      </div>
      <div>
        <StatsBox label="Primary economies" items={stats.primaryEconomies} />
      </div>
      <div>
        <StatsBox label="Secondary economies" items={stats.secondaryEconomies} />
      </div>
      <div>
        <StatsBox label="System security states" items={stats.securityStates} />
      </div>
    </div>
  );
}

export default FactionStats;

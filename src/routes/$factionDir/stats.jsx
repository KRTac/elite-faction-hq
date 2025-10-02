import { createFileRoute } from '@tanstack/react-router';
import CompareDatasets from '../../components/layouts/CompareDatasets';
import { fetchDataset, urlByTimeQuery } from '../../lib/factionDataset';


function Layout({ children, title = '' }) {
  return (
    <div className="flex-1 relative overflow-y-scroll">
      {title && (
        <h2 className={[
          'text-center px-3 py-3 text-2xl font-semibold',
          'dark:text-slate-400'
        ].join(' ')}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function Stats() {
  const { datasetA, datasetB } = Route.useLoaderData();

  return (
    <Layout>
      <CompareDatasets datasetA={datasetA} datasetB={datasetB} />
    </Layout>
  );
}

export const Route = createFileRoute('/$factionDir/stats')({
  loaderDeps: ({ search }) => ({
    queryA: search.a,
    queryB: search.b
  }),
  loader: async ({
    params: { factionDir },
    deps: { queryA, queryB },
    context: { factionsMeta: { factions }}
  }) => {
    const urlA = urlByTimeQuery(queryA, factions, factionDir);
    const urlB = urlByTimeQuery(queryB, factions, factionDir);

    const datasetA = await fetchDataset(urlA);
    const datasetB = await fetchDataset(urlB);

    return { datasetA, datasetB };
  },
  component: Stats,
  errorComponent: ({ error }) => (
    <Layout title="Compare view">
      <p className="text-center px-3 mt-10 text-xl">{error.message}</p>
    </Layout>
  )
});

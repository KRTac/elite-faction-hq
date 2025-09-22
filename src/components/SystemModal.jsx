import { useRouterState, useNavigate } from '@tanstack/react-router';
import { ObjectInspector, chromeDark } from "react-inspector";
import Modal from './Modal';
import { useSystemByName } from '../hooks/useFactionDataset';


function SystemDetails({ system }) {
  return (
    <>
      <p className="text-base dark:text-neutral-500 text-center">
        Still work in progress. For now here's the complete faction dataset for this system.
      </p>
      <p className="text-lg px-3 pb-0.5">Raw data</p>
      <div className="bg-neutral-800 p-4 rounded-xl">
        <ObjectInspector
          data={system}
          expandLevel={1}
          theme={{
            ...chromeDark,
            OBJECT_VALUE_BOOLEAN_COLOR: 'var(--color-cyan-500)',
            TREENODE_PADDING_LEFT: 'calc(var(--spacing) * 3)',
            TREENODE_FONT_SIZE: 'var(--text-sm)',
            TREENODE_LINE_HEIGHT: 'calc(var(--spacing) * 5)',
            BASE_BACKGROUND_COLOR: 'transparent'
          }}
        />
      </div>
    </>
  );
}

function SystemModal(props) {
  const { location: { search }, status } = useRouterState();
  const navigate = useNavigate();

  const systemName = status === 'idle' && search['system']
    ? search['system']
    : '';
  const system = useSystemByName(systemName);

  return (
    <Modal
      isOpen={!!systemName}
      title={system
        ? systemName
        : 'System not found'
      }
      onClose={() => navigate({ search: { system: undefined }})}
      {...props}
    >
      {!system && (
        <p className="text-center my-7 text-lg dark:text-neutral-300">
          No system by the name <span className="italic font-bold">{systemName}</span> found in the dataset.
        </p>
      )}
      {system && (
        <SystemDetails system={system} />
      )}
    </Modal>
  );
}

export default SystemModal;

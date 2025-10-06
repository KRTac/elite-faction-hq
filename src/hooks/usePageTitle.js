import { useEffect } from 'react';
import { joinTitle } from '../lib/string';
import useFactionDataset from './useFactionDataset';


export function useFactionTitle(title) {
  const { faction } = useFactionDataset();

  usePageTitle(title ? [ title, faction ] : faction);
}

function usePageTitle(title) {
  if (!title) {
    title = [];
  } else if (!Array.isArray(title)) {
    title = [ title ];
  }

  title = joinTitle([ ...title, import.meta.env.VITE_SITE_TITLE ]);

  useEffect(() => {
    document.title = title;
  }, [ title ]);
}

export default usePageTitle;

export const powers = {
  'Aisling Duval': {
    color: '#1b8fbb',
    shortened: 'ADU'
  },
  'Archon Delaine': {
    color: '#cb3e3e',
    shortened: 'ADE'
  },
  'A. Lavigny-Duval': {
    color: '#8b50a4',
    shortened: 'ALD'
  },
  'Denton Patreus': {
    color: '#31bdbd',
    shortened: 'DP'
  },
  'Edmund Mahon': {
    color: '#35a432',
    shortened: 'EM'
  },
  'Felicia Winters': {
    color: '#d79f32',
    shortened: 'FW'
  },
  'Jerome Archer': {
    color: '#c740d7',
    shortened: 'JA'
  },
  'Li Yong-Rui': {
    color: '#32e2a1',
    shortened: 'LYR'
  },
  'Nakato Kaine': {
    color: '#8fcf33',
    shortened: 'NK'
  },
  'Pranav Antal': {
    color: '#f3f539',
    shortened: 'PA'
  },
  'Yuri Grom': {
    color: '#e06530',
    shortened: 'YG'
  },
  'Zemina Torval': {
    color: '#2e69cb',
    shortened: 'ZT'
  }
};

const allPowers = Object.keys(powers);

export function isPower(s) {
  return allPowers.includes(s);
}

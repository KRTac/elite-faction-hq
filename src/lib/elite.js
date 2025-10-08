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

export function powerColor(power, fallbackName = 'None', fallbackColor = '#cccccc') {
  if (!power || power === fallbackName || !isPower(power)) {
    return fallbackColor;
  }

  return powers[power].color;
}

export const mapReferenceSystems = [
  {
    name: 'Achenar',
    coords: { x: 67.5, y: -119.47, z: 24.84 },
    _meta: {
      notable: {
        short: 'Empire HQ'
      },
      engineer: {
        short: 'Tiana Fortune'
      }
    }
  },
  {
    name: 'Alioth',
    coords: { x: -33.66, y: 72.47, z: -20.66 },
    _meta: {
      notable: {
        short: 'Alliance HQ'
      },
      engineer: {
        short: 'Bill Turner'
      }
    }
  },
  {
    name: 'Arque',
    coords: { x: 66.5, y: 38.06, z: 61.13 },
    _meta: {
      engineer: {
        short: 'Professor Palin'
      }
    }
  },
  {
    name: 'Beta-3 Tucani',
    coords: { x: 32.25, y: -55.19, z: 23.88 },
    _meta: {
      engineer: {
        short: 'The Sarge'
      }
    }
  },
  {
    name: 'Clayakarma',
    coords: { x: -20.5, y: -4.97, z: 60.69 },
    _meta: {
      power: {
        short: 'Yuri Grom'
      }
    }
  },
  {
    name: 'Cubeo',
    coords: { x: 128.28, y: -155.63, z: 84.22 },
    _meta: {
      power: {
        short: 'Aisling Duval'
      }
    }
  },
  {
    name: 'Deciat',
    coords: { x: 122.63, y: -0.81, z: -47.28 },
    _meta: {
      engineer: {
        short: 'Felicity Farseer'
      }
    }
  },
  {
    name: 'Eotienses',
    coords: { x: 49.5, y: -104.03, z: 6.31 },
    _meta: {
      power: {
        short: 'Denton Patreus'
      }
    }
  },
  {
    name: 'Eurybia',
    coords: { x: 51.41, y: -54.41 , z: -30.5 },
    _meta: {
      engineer: {
        short: 'Liz Ryder'
      }
    }
  },
  {
    name: 'Gateway',
    coords: { x: -11, y: 77.84 , z: -0.88 },
    _meta: {
      power: {
        short: 'Edmund Mahon'
      }
    }
  },
  {
    name: 'Giryak',
    coords: { x: 14.69, y: 27.66, z: 108.66 },
    _meta: {
      engineer: {
        short: 'Juri Ishmaak'
      }
    }
  },
  {
    name: 'Harma',
    coords: { x: -99.25, y: -100.97, z: 20.41 },
    _meta: {
      power: {
        short: 'Archon Delaine'
      }
    }
  },
  {
    name: 'Kamadhenu',
    coords: { x: 110, y: -99.97, z: -13.38 },
    _meta: {
      power: {
        short: 'A. Lavigny-Duval'
      }
    }
  },
  {
    name: 'Khun',
    coords: { x: -171.59, y: 19.97, z: -56.97 },
    _meta: {
      engineer: {
        short: 'Elvira Martuuk'
      }
    }
  },
  {
    name: 'Kuk',
    coords: { x: -21.28, y: 69.09, z: -16.31 },
    _meta: {
      engineer: {
        short: 'Selene Jean'
      }
    }
  },
  {
    name: 'Kuwemaki',
    coords: { x: 134.66, y: -226.91, z: -7.81 },
    _meta: {
      engineer: {
        short: 'Hera Tani'
      }
    }
  },
  {
    name: 'Laksak',
    coords: { x: -21.53, y: -6.31, z: 116.03 },
    _meta: {
      engineer: {
        short: 'Lei Cheung'
      }
    }
  },
  {
    name: 'Lave',
    coords: { x: 75.75, y: 48.75, z: 70.75 },
    _meta: {
      notable: {
        short: 'Lave Radio'
      }
    }
  },
  {
    name: 'Leesti',
    coords: { x: 72.75, y: 48.75, z: 68.25 },
    _meta: {
      engineer: {
        short: 'Didi Vatermann'
      }
    }
  },
  {
    name: 'Lembava',
    coords: { x: -43.25, y: -64.34, z: -77.69 },
    _meta: {
      power: {
        short: 'Li Yong-Rui'
      }
    }
  },
  {
    name: 'Meene',
    coords: { x: 118.78, y: -56.44, z: -97.19 },
    _meta: {
      engineer: {
        short: 'Ram Tah'
      }
    }
  },
  {
    name: 'Muang',
    coords: { x: 17.03, y: -172.78, z: -3.47 },
    _meta: {
      engineer: {
        short: 'Broo Tarquin'
      }
    }
  },
  {
    name: 'Nanomam',
    coords: { x: -14.78, y: 19.66, z: -15.25 },
    _meta: {
      power: {
        short: 'Jerome Archer'
      }
    }
  },
  {
    name: 'Polaris',
    coords: { x: -322.69, y: 194.59, z: -212.44 },
    _meta: {
      notable: {
        short: 'Canonn Research'
      }
    }
  },
  {
    name: 'Polevnic',
    coords: { x: -79.91, y: -87.47, z: -33.53 },
    _meta: {
      power: {
        short: 'Pranav Antal'
      }
    }
  },
  {
    name: 'Rhea',
    coords: { x: 58.13, y: 22.59, z: -28.59 },
    _meta: {
      power: {
        short: 'Felicia Winters'
      }
    }
  },
  {
    name: 'Shenve',
    coords: { x: 351.97, y: -373.47, z: -711.09 },
    _meta: {
      engineer: {
        short: 'Chloe Sedesi'
      }
    }
  },
  {
    name: 'Shinrarta Dezhra',
    coords: { x: 55.72, y: 17.59, z: 27.16 },
    _meta: {
      notable: {
        short: 'Pilots Federation HQ'
      },
      engineer: {
        short: 'Lori Jameson'
      }
    }
  },
  {
    name: 'Sirius',
    coords: { x: 6.25, y: -1.28, z: -5.75 },
    _meta: {
      engineer: {
        short: 'Marco Qwent'
      }
    }
  },
  {
    name: 'Sol',
    coords: { x: 0, y: 0, z: 0 },
    _meta: {
      notable: {
        short: 'Federation HQ'
      },
      engineer: {
        short: 'Colonel Bris Dekker'
      }
    }
  },
  {
    name: 'Synteini',
    coords: { x: 51.78, y: -76.41, z: 28.72 },
    _meta: {
      power: {
        short: 'Zemina Torval'
      }
    }
  },
  {
    name: 'Tionisla',
    coords: { x: 82.25, y: 48.75, z: 68.16 },
    _meta: {
      power: {
        short: 'Nakato Kaine'
      }
    }
  },
  {
    name: 'Wolf 397',
    coords: { x: 40, y: 79.22, z: -10.41 },
    _meta: {
      engineer: {
        short: 'Tod "The Blaster" McQuinn'
      }
    }
  },
  {
    name: 'Wyrd',
    coords: { x: -11.63, y: 31.53, z: -3.94 },
    _meta: {
      engineer: {
        short: 'The Dweller'
      }
    }
  },
  {
    name: 'Yoru',
    coords: { x: 97.88, y: -86.91 , z: 64.13 },
    _meta: {
      engineer: {
        short: 'Zacariah Nemo'
      }
    }
  }
];

export const powerHqSystems = mapReferenceSystems.filter(s => !!s._meta?.power?.short);
export const notableSystems = mapReferenceSystems.filter(s => !!s._meta?.notable?.short);
export const engineerSystems = mapReferenceSystems.filter(s => !!s._meta?.engineer?.short);

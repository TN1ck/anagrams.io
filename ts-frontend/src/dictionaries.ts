import english90kDict from '../../dictionaries-new/english-90k.txt'
import german600kDict from '../../dictionaries-new/german-600k.txt'
import french300kDict from '../../dictionaries-new/french-300k.txt'
import spanish70kDict from '../../dictionaries-new/spanish-70k.txt'

export interface LetterMapping {
  letter: string
  mapping: string
  active: boolean
}

export interface Dictionary {
  id: string;
  name: string;
  file: string;
  mapping: LetterMapping[];
}

const ACCENTS = [
  {
    letter: 'é',
    mapping: 'e',
    active: true,
  },
  {
    letter: 'è',
    mapping: 'e',
    active: true,
  },
  {
    letter: 'ê',
    mapping: 'e',
    active: true,
  },
  {
    letter: 'ë',
    mapping: 'e',
    active: true,
  },
  {
    letter: 'à',
    mapping: 'a',
    active: true,
  },
  {
    letter: 'â',
    mapping: 'a',
    active: true,
  },
  {
    letter: 'ô',
    mapping: 'o',
    active: true,
  },
  {
    letter: 'û',
    mapping: 'u',
    active: true,
  },
  {
    letter: 'ù',
    mapping: 'u',
    active: true,
  },
];

export const DICTIONARIES = [
  {
    id: 'en-90k',
    name: 'English',
    file: english90kDict,
    mapping: [],
  },
  {
    id: 'de-600k',
    name: 'German',
    file: german600kDict,
    mapping: [
      {
        letter: 'ä',
        mapping: 'a',
        active: false,
      },
      {
        letter: 'ö',
        mapping: 'o',
        active: false,
      },
      {
        letter: 'ü',
        mapping: 'u',
        active: false,
      },
      {
        letter: 'ß',
        mapping: 'ss',
        active: true,
      }
    ]
  },
  {
    id: 'fr-300k',
    name: 'French',
    file: french300kDict,
    mapping: [
      ...ACCENTS,
      {
        letter: 'ç',
        mapping: 'c',
        active: true,
      },
      {
        letter: 'î',
        mapping: 'i',
        active: true,
      },
      {
        letter: 'ï',
        mapping: 'i',
        active: true,
      },
      {
        letter: 'œ',
        mapping: 'oe',
        active: true,
      },
      {
        letter: 'æ',
        mapping: 'ae',
        active: true,
      },
    ]
  },
  {
    id: 'es-70k',
    name: 'Spanish',
    file: spanish70kDict,
    mapping: [
      ...ACCENTS,
      {
        letter: 'ñ',
        mapping: 'n',
        active: false,
      },
    ]
  },
];

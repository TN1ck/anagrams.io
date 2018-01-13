const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const BACKEND_URL = IS_PRODUCTION ? 'https://api.anagramania.io' : 'http://localhost:3000';

export const YELLOW = '#FFFF55';
export const LIGHTER_COLOR = '#474ebd';
export const LIGHT_COLOR = '#371c84';
export const DARK_COLOR = '#271b68';
export const GREY = '#95a5a6';
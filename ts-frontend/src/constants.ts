const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const BACKEND_URL = IS_PRODUCTION ? 'https://api.anagramania.io' : 'http://localhost:3000';
export const FRONTEND_URL = IS_PRODUCTION ? 'https://anagramania.io' : 'http://localhost:3001';
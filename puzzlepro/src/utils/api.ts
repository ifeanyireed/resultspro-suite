export const GAME_ENGINE_API_URL = (
  process.env.NEXT_PUBLIC_GAME_ENGINE_URL ||
  process.env.NEXT_PUBLIC_PUZZLEPRO_API ||
  'https://resultspro-service-puzzlepro.onrender.com'
).replace(/\/+$/, '');

export const PLAYER_SERVICE_API_URL = (
  process.env.NEXT_PUBLIC_PLAYER_SERVICE_URL ||
  process.env.NEXT_PUBLIC_USERS_API ||
  'https://resultspro-service-users.onrender.com'
).replace(/\/+$/, '');

export const API_BASE_URL = GAME_ENGINE_API_URL;

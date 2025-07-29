import { Screen } from './types';

export const PASSWORDS: Record<Screen, string> = {
  [Screen.HOME]: '', // Home doesn't need a password
  [Screen.REQUEST]: '',
  [Screen.DELIVERY]: '', // Password check is now dynamic
  [Screen.CONSULTA_DE_DOTACION]: '',
  [Screen.INVENTORY]: '' // Password check is now dynamic
};
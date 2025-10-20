export const TOKEN_KEY = 'coffee_token';
export const ROLE_KEY = 'coffee_role';

export const saveAuth = (token: string, role: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY) ?? '';
export const getRole = () => localStorage.getItem(ROLE_KEY);

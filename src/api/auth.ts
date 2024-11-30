import { AxiosError, isAxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import axios from './axiosConfig';

interface DecodedToken {
  user_id: string;
  exp: number;
}

export const register = async (username: string, password: string, email: string, firstName: string, lastName: string) => {
  try {
    const response = await axios.post('/api/register/', { username, password, email, first_name: firstName, last_name: lastName });
    return response.data;
  } catch (error) {
    throw new Error('Registration failed');
  }
};

export const login = async (username: string, password: string): Promise<DecodedToken> => {
  try {
    const response = await axios.post('/api/token/', { username, password });
    const { access, refresh, first_name, last_name, groups } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('username', `${first_name} ${last_name}`);
    localStorage.setItem('groups', groups);
    return jwtDecode<DecodedToken>(access);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const errorDetail = (axiosError.response?.data as { detail?: string })?.detail;
      throw new Error('Erro ao Logar: ' + (errorDetail || axiosError.message));
    } else {
      throw new Error('Login failed');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
  localStorage.removeItem('groups');
};
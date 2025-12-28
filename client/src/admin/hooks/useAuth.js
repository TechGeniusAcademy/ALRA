import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const useAuth = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Загрузка информации о текущем администраторе
  const loadCurrentAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (authService.isAuthenticated()) {
        const admin = await authService.getCurrentAdmin();
        setCurrentAdmin(admin);
      } else {
        setCurrentAdmin(null);
      }
    } catch (err) {
      setError(err.message);
      setCurrentAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Вход администратора
  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.login(username, password);
      await loadCurrentAdmin();
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadCurrentAdmin]);

  // Выход администратора
  const logout = useCallback(() => {
    authService.logout();
    setCurrentAdmin(null);
    navigate('/admin/login');
  }, [navigate]);

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    loadCurrentAdmin();
  }, [loadCurrentAdmin]);

  return {
    currentAdmin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated,
  };
};

export default useAuth; 
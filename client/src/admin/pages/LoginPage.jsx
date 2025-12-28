import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-logo">
          <h1>ALRA Admin</h1>
          <p>Панель управления сайтом</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <div className="admin-login-error">{error}</div>}
          
          <div className="admin-form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              disabled={loading}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={loading}
            />
          </div>

          <button type="submit" className="admin-login-button" disabled={loading}>
            {loading ? 'Выполняется вход...' : 'Войти'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>© {new Date().getFullYear()} ALRA Eco Village. Все права защищены.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 
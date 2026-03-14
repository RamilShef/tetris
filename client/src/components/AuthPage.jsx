import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import './AuthPage.css';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  const switchToLogin = () => navigate('/auth?mode=login');
  const switchToRegister = () => navigate('/auth?mode=register');

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`} 
            onClick={switchToLogin}
          >
            Вход
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`} 
            onClick={switchToRegister}
          >
            Регистрация
          </button>
        </div>
        <div className="auth-form-container">
          {isLogin ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
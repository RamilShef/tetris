import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      navigate('/game');
    } catch (err) {
      alert('Ошибка регистрации: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <input type="text" placeholder="Имя пользователя" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Register;
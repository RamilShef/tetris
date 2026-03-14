import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [myScores, setMyScores] = useState([]);

  useEffect(() => {
    const fetchMyScores = async () => {
      const res = await api.get('/scores/my');
      setMyScores(res.data);
    };
    if (user) fetchMyScores();
  }, [user]);

  return (
    <div className="page-container">
      <h2>Личный кабинет</h2>
      <p>Пользователь: <strong>{user?.username}</strong></p>
      <h3>Мои последние результаты</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {myScores.map((s) => (
          <li key={s.id} style={{ margin: '10px 0', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            {s.score} очков, линии: {s.lines}, уровень: {s.level} — {new Date(s.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
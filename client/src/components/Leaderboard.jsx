import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/socket';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchTop = async () => {
      const res = await api.get('/scores/top');
      setScores(res.data);
    };
    fetchTop();

    socket.on('top_scores_updated', (updatedScores) => {
      setScores(updatedScores);
    });

    return () => {
      socket.off('top_scores_updated');
    };
  }, []);

  return (
    <div className="page-container">
      <h2>Топ-10 игроков</h2>
      <ol style={{ fontSize: '1.2rem', lineHeight: '2' }}>
        {scores.map((score) => (
          <li key={score.id}>
            {score.User.username}: {score.score} очков (уровень {score.level})
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
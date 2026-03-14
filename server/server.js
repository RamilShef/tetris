require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const socketInit = require('./sockets');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);


const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД успешно');
    await sequelize.sync({ alter: true }); 

    const server = app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });

    
    const io = socketInit.init(server);
    app.set('io', io);

  } catch (err) {
    console.error('Ошибка запуска:', err);
  }
};

start();
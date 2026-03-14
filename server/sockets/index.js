const socketIo = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: {
        origin: 'http://localhost:3000',//фронт
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Новый клиент подключился:', socket.id);

      socket.on('disconnect', () => {
        console.log('Клиент отключился:', socket.id);
      });
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io не инициализирован');
    }
    return io;
  },
};
import { io } from 'socket.io-client';

const socket = io(); // подключается к текущему хосту благодаря прокси

export default socket;
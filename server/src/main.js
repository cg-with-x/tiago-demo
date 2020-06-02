// NOTE: 获取全局 room 变量
const room = global.cloud.pvp.room;

const Sender = require('./sender');
const Game = require('./game');

const sender = new Sender({ room });
const game = new Game({ sender });

// NOTE: 房间服务是完全由 room 的事件驱动的
room.on('config', (config) => {
  console.log('[server-room] config:', config);

  game.onConfig(config);
});

room.on('message', ({ client, message }) => {
  console.log('[server-room] message:', client, message);
  
  try {
    const { event, data } = JSON.parse(message);

    switch(event) {
      case 'ready':
        game.onReady(client);
        break;
      case 'talk':
        game.onTalk(client, data);
        break;
      case 'bye':
        game.over();
      default:
        break;
    }
  } catch (err) {
    console.log('[server-room] message error:', err);

    sender.add({
      event: 'message-error',
      data: message,
    });
  }
});

room.on('leave', ({ client }) => {
  console.log('[server-room] leave:', client);

  game.onLeave(client);
});

room.on('reconnect', ({ client, hasLeft }) => {
  console.log('[server-room] reconnect:', client, hasLeft);
});

room.on('join', ({ client }) => {
  console.log('[server-room] join:', client);

  game.onJoin(client);
});
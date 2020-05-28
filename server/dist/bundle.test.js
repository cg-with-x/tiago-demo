(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	class Sender {
	  constructor({
	    room,
	    interval = 100,
	  }) {
	    this.room = room;
	    this.remaining = [];
	    this.interval = interval;
	    
	    this._init();
	  }

	  _init() {
	    setInterval(() => {
	      this._doSend();
	    }, this.interval);
	  }

	  _doSend() {
	    if (this.remaining.length) {
	      const str = JSON.stringify(this.remaining);
	      room.broadcast(str);
	      this.remaining = [];
	    }
	  }

	  add(message) {
	    this.remaining.push(message);
	  }
	}

	var sender = Sender;

	var utils = {
	  getOpenId(client) {
	    if (client.extra) {
	      if (client.extra.openId) {
	        return client.extra.openId;
	      }
	    }
	  }
	};

	class Game {
	  constructor({ sender }) {
	    this.state = 'waiting';
	    this.players = {};
	    this.playerCount = 0;
	    this.sender = sender;
	    this.logicId = null;
	  }

	  onJoin(client) {
	    const openId = utils.getOpenId(client);
	    if (openId && !this.players[openId]) {
	      this.players[openId] = {
	        client,
	        info: client.extra,
	        isReady: false,
	      };
	      this.playerCount++;
	    }
	  }

	  onLeave(client) {
	    // NOTE: 某个用户退出时处理
	    const openId = utils.getOpenId(client);
	    if (openId && this.players[openId]) {
	      this.players[openId] = null;
	      this.playerCount--;

	      // NOTE: 判断暂停，或终止游戏
	    }
	  }

	  onReady(client) {
	    const openId = utils.getOpenId(client);
	    if (openId && this.players[openId]) {
	      this.players[openId].isReady = true;
	    }

	    let readyPlayer = 0;
	    for (const key in this.players) {
	      if (this.players.hasOwnProperty(key)) {
	        const player = this.players[key];
	        if (player.isReady) readyPlayer++;
	      }
	    }

	    // NOTE: 简单处理，当有 2 个用户准备好后开始游戏
	    if (readyPlayer === this.playerCount && readyPlayer >= 2) {
	      this.start();
	    }
	  }

	  onTalk(client, data) {
	    const openId = utils.getOpenId(client);
	    if (this.state === 'playing') {
	      this.sender.add({
	        event: 'talk',
	        data: {
	          openId,
	          data,
	        },
	      });
	    }
	  }

	  start() {
	    this.state = 'playing';

	    const data = [];
	    for (const key in this.players) {
	      if (this.players.hasOwnProperty(key)) {
	        const player = this.players[key];
	        data.push(player.info);
	      }
	    }

	    this.sender.add({
	      event: 'info',
	      data,
	    });

	    this.sender.add({
	      event: 'game-start',
	    });

	    this.sender.add({
	      event: 'environment',
	      data: 'test',
	    });

	    this.doSomeLogic();
	  }

	  over() {
	    this.state = 'over';

	    clearInterval(this.logicId);

	    this.sender.add({
	      event: 'game-over',
	    });
	  }

	  doSomeLogic() {
	    this.logicId = setInterval(() => {
	      this.sender.add({
	        event: 'server-time',
	        data: Date.now(),
	      });
	    }, 1000);
	  }
	}

	var game = Game;

	// NOTE: 获取全局 room 变量
	const room$1 = commonjsGlobal.cloud.pvp.room;




	const sender$1 = new sender({ room: room$1 });
	const game$1 = new game({ sender: sender$1 });

	// NOTE: 房间服务是完全由 room 的事件驱动的
	room$1.on('config', (config) => {
	  console.log('[server-room] config:', config);

	  sender$1.add({
	    event: 'config',
	    data: config,
	  });
	});

	room$1.on('message', ({ client, message }) => {
	  console.log('[server-room] message:', client, message);
	  
	  try {
	    const { event, data } = JSON.parse(message);

	    switch(event) {
	      case 'ready':
	        game$1.onReady(client);
	        break;
	      case 'talk':
	        game$1.onTalk(client, data);
	        break;
	      case 'bye':
	        game$1.over();
	      default:
	        break;
	    }
	  } catch (err) {
	    console.log('[server-room] message error:', err);

	    sender$1.add({
	      event: 'message-error',
	      data: message,
	    });
	  }
	});

	room$1.on('leave', ({ client }) => {
	  console.log('[server-room] leave:', client);

	  game$1.onLeave(client);
	});

	room$1.on('reconnect', ({ client, hasLeft }) => {
	  console.log('[server-room] reconnect:', client, hasLeft);
	});

	room$1.on('join', ({ client }) => {
	  console.log('[server-room] join:', client);

	  game$1.onJoin(client);
	});

}());

const utils = require('./utils');

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
    } else {
      // NOTE: 再次加入
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
      data: '__BUILD_ENV__',
    })

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

module.exports = Game;
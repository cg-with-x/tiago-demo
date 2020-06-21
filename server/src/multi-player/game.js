const utils = require('../utils');
const AI = require('../ai');

class Game {
  constructor({ sender }) {
    this.state = 'waiting';
    this.players = {};
    this.playerCount = 0;
    this.needPlayers = 0;
    this.sender = sender;
    this.logicId = null;
    this.config = null;
  }

  onConfig(config) {
    this.config = config;

    // NOTE: 房间信息，仅做人数校验
    // 严格来讲，应该做 openId 校验
    if (config.playerInfoList) {
      // NOTE: 所有人，对应 Single Match
      let allPlayers = 0;
      const playerInfoList = config.playerInfoList;
      for (let i = 0; i < playerInfoList.length; i++) {
        const camp = playerInfoList[i];
        allPlayers += camp.length;
      }
      this.needPlayers = allPlayers;
    }

    // NOTE: 房间由匹配服务创建
    if (config.fromMatch) {
      const aiInfos = config.AIInfos;
      if (aiInfos && aiInfos.length) {
        for (let i = 0; i < aiInfos.length; i++) {
          const aiInfo = aiInfos[i];
          this.onJoinAI(aiInfo);
        }
      }
    }
  }

  onJoinAI(aiInfo) {
    const openId = utils.getAIOpenId(aiInfo);
    const aiController = new AI({
      id: openId,
      game: this,
      sender: this.sender,
    });

    this.players[openId] = {
      info: aiInfo,
      isReady: true,
      isAI: true,
      aiController,
    };
    this.playerCount++;
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

      this.sender.add({
        event: 'game-info',
        data: {
          config: this.config,
          client: client,
        },
      });
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

    // NOTE: 所有人进入游戏后，游戏开始
    if (readyPlayer === this.playerCount && readyPlayer === this.needPlayers) {
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
    this.startAILogic();
  }

  over() {
    this.stopAILogic();

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

  startAILogic() {
    for (const key in this.players) {
      if (this.players.hasOwnProperty(key)) {
        const player = this.players[key];
        if (player.isAI) {
          player.aiController.start();
        }
      }
    }
  }

  stopAILogic() {
    for (const key in this.players) {
      if (this.players.hasOwnProperty(key)) {
        const player = this.players[key];
        if (player.isAI) {
          player.aiController.stop();
        }
      }
    }
  }
}

module.exports = Game;
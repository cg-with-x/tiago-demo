class AI {
  constructor({
    id,
    game,
    sender,
  }) {
    this.id = id;
    this.game = game;
    this.sender = sender;
    this.logicId = null;
  }

  start() {
    // 模拟 AI 的逻辑
    const interval = Math.random() * 1000 + 500;

    this.logicId = setTimeout(() => {
      this.doTalk();
      this.start();
    }, interval);
  }

  doTalk() {
    // AI 的攻击力额外增加 10 点
    const value = parseInt(Math.random() * 100 + 10);
    
    // NOTE: 服务端模拟真实用户逻辑
    this.sender.add({
      event: 'talk',
      data: {
        openId: this.id,
        data: value,
      },
    });
  }

  stop() {
    // 结束模拟
    clearTimeout(this.logicId);
  }
}

module.exports = AI;
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

module.exports = Sender;
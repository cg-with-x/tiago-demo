module.exports = {
  getOpenId(client) {
    if (client.extra) {
      if (client.extra.openId) {
        return client.extra.openId;
      }
    }
  }
};
module.exports = {
  getOpenId(client) {
    if (client.extra) {
      if (client.extra.openId) {
        return client.extra.openId;
      }
    }
  },

  getAIOpenId(info) {
    info.openId = info.openId || 'fake-ai-openid';
    return info.openId;
  }
};
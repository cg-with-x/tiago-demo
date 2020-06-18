// NOTE: 用于存储一些数据
const dataManager = {
    selfUserInfo: null,
    twoPlayersInfo: null,
    environment: '',
    tiagoInited: false,
    tiago: null, // 保留一个 tiago 的引用
    currentTeam: null, // 用于存放当前所在的组队队伍，用户在游戏后返回
};

module.exports = dataManager;
"use strict";
cc._RF.push(module, 'b3196BS1dpFt7N9xcK6Wa6O', 'data_manager');
// scripts/data_manager.js

'use strict';

// NOTE: 用于存储一些数据
var dataManager = {
    selfUserInfo: null,
    twoPlayersInfo: null,
    environment: '',
    tiagoInited: false,
    tiago: null, // 保留一个 tiago 的引用
    currentTeam: null // 用于存放当前所在的组队队伍，用户在游戏后返回
};

module.exports = dataManager;

cc._RF.pop();
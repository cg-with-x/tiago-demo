"use strict";
cc._RF.push(module, '9ff5cO3AohAA5GRz1BIw6FL', 'start');
// scripts/start.js

'use strict';

var _tiago = require('@byted-creative/tiago');

var _tiago2 = _interopRequireDefault(_tiago);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_tiago2.default.utils.isTT()) {
    _tiago2.default.init({
        appId: 'tt5e982825c1b2d9a3',
        debug: true
    }).then(function () {
        console.log('tiago init success.');
    }).catch(function (err) {
        console.log(err);
        // NOTE: 一般情况不会出错，我们会对错误情况做监控，游戏可以处理一些异常情况下的表现
    });
}

cc.Class({
    extends: cc.Component,

    properties: {},

    start: function start() {},
    onClickGetConfig: function onClickGetConfig() {
        var BUSINESS_SCENE = _tiago2.default.BUSINESS_SCENE;


        var config = _tiago2.default.getConfig();
        console.log(config);

        var currentScene = config.currentScene,
            scene = config.scene;


        if (currentScene === BUSINESS_SCENE.LiveRoom) {
            // 当前是直播场景
            var params = scene[currentScene];

            if (params.isAIRequired) {}
            // NOTE: 补充 AI 逻辑


            // NOTE: 针对直播场景，调整使用直播专用的 UI，或处理其他特殊逻辑
        } else if (currentScene === BUSINESS_SCENE.Wonderland) {
            // 当前是 W 场景
        }
    },
    onClickGetUserInfo: function onClickGetUserInfo() {
        var userinfo = _tiago2.default.getUserInfo();
        console.log(userinfo);
    },
    onClickStartSingleMatch: function onClickStartSingleMatch() {
        var match = _tiago2.default.startSingleMatch();

        match.on('match-success', function (result) {
            // 获得匹配成功后的用户信息
            console.log(result);
        });

        match.on('create-game-room-success', function (result) {
            console.log(result);

            // NOTE: 随后可以加入游戏房间
            var room = _tiago2.default.joinGameRoom({
                roomNum: result.roomNum
            });

            // NOTE: 加入房间连麦
            _tiago2.default.joinRTCForGameRoom(room);
        });

        match.on('error', function (error) {
            console.log(error);
        });
    }
});

cc._RF.pop();
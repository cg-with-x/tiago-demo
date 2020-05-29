(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/start.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '9ff5cO3AohAA5GRz1BIw6FL', 'start', __filename);
// scripts/start.js

'use strict';

var _tiago = require('@byted-creative/tiago');

var _tiago2 = _interopRequireDefault(_tiago);

var _room_manager = require('./room_manager');

var _room_manager2 = _interopRequireDefault(_room_manager);

var _data_manager = require('./data_manager');

var _data_manager2 = _interopRequireDefault(_data_manager);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,

    properties: {
        labelNickName: cc.Label,
        spriteAvatar: cc.Sprite,
        nodeFeature: cc.Node,
        nodeLoading: cc.Node
    },

    onLoad: function onLoad() {
        var _this = this;

        if (!_data_manager2.default.tiagoInited) {
            this.nodeFeature.active = false;
            this.nodeLoading.active = true;

            _tiago2.default.init({
                appId: 'tt5e982825c1b2d9a3',
                debug: true
            }).then(function () {
                console.log('tiago init success.');
                _data_manager2.default.tiagoInited = true;

                _this.nodeFeature.active = true;
                _this.nodeLoading.active = false;
            }).catch(function (err) {
                console.log(err);
                // NOTE: 一般情况不会出错，我们会对错误情况做监控，游戏可以处理一些异常情况下的表现
            });
        } else {
            this.nodeFeature.active = true;
            this.nodeLoading.active = false;
        }

        console.log('loaded');
    },
    start: function start() {
        if (_data_manager2.default.selfUserInfo) {
            this.renderSelf(_data_manager2.default.selfUserInfo);
        }
    },
    renderSelf: function renderSelf(info) {
        this.labelNickName.string = info.nickName;
        _utils2.default.renderAvatar(this.spriteAvatar, info.avatarUrl);
    },
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
        var info = _tiago2.default.getUserInfo();
        console.log(info);

        // NOTE: 这里只是简单的保存下来
        _data_manager2.default.selfUserInfo = info;
        this.renderSelf(_data_manager2.default.selfUserInfo);
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

            // 交由 room_manager 进行管理
            _room_manager2.default.loadRoom(room);
        });

        match.on('error', function (error) {
            console.log(error);
        });
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=start.js.map
        
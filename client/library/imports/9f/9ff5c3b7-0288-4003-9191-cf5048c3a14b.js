"use strict";
cc._RF.push(module, '9ff5cO3AohAA5GRz1BIw6FL', 'start');
// scripts/start.js

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
                debug: true,
                onJoinTeam: function onJoinTeam(team) {
                    _this.onJoinTeam(team);
                } // 2.0 的主要功能，组队，会在受邀加入队伍、或自己创建队伍后触发！
            }).then(function () {
                console.log('tiago init success.');
                _data_manager2.default.tiagoInited = true;
                _data_manager2.default.tiago = _tiago2.default;

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

            if (params.isNewcomer) {
                // NOTE: 补充新手逻辑
                console.log('新手首次加入游戏');
            }

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
    },
    onClickStartSingleMatchAI: function onClickStartSingleMatchAI() {
        var match = _tiago2.default.startSingleMatch({
            isAutoAppendAI: true // 支持 AI 逻辑
        });

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

            // 交由 room_manager 进行管理
            _room_manager2.default.loadRoom(room);
        });

        match.on('error', function (error) {
            console.log(error);
        });
    },
    onClickMakeTeam: function onClickMakeTeam(event, userData) {
        // userData: '2', '2-ai', 符合这类格式
        var _userData$split = userData.split('-'),
            _userData$split2 = _slicedToArray(_userData$split, 2),
            size = _userData$split2[0],
            ai = _userData$split2[1];

        size = parseInt(size);
        ai = !!ai;

        console.log(size);
        console.log(ai);

        // NOTE: 创建新队伍前，先清理一下
        _data_manager2.default.currentTeam = null;

        // NOTE: 创建一个队伍，匹配时进行 Single 类型匹配
        _tiago2.default.makeTeam({
            teamSize: size, // 2-9 人
            isAutoJoinRTC: true, // 默认组队时进行连麦
            match: {
                type: _tiago2.default.MATCH_TYPE.Single, // SINGLE, NVN,
                minPlayerCount: 1, // 1 个人就能玩
                isAutoAppendAI: ai, // 配合 SINGLE，字段，默认不补充 AI，NVN 匹配时不支持 AI
                gameRoomScriptId: 'room-283' // 房间服务适用、指定不同的游戏房间脚本 ID（注意不是脚本名称）、配合 IDE 上传房间脚本时使用
                // disableAutoCreateGameRoom: true, // 默认自动创建游戏房间，可以关闭（生肖派对），关闭后，gameRoomScriptId 字段失效
            }
        });

        // NOTE: 后续的逻辑，都会由 tiago init 时传入的 `onJoinTeam` 回调触发
    },
    onClickRoom: function onClickRoom() {
        cc.director.loadScene('room');
    },
    onJoinTeam: function onJoinTeam(team) {
        // NOTE: 可以在适当的时机进行清理，例如：在每次 makeTeam 之前。
        _data_manager2.default.currentTeam = team;

        team.on('match-success', function (result) {
            // 获得匹配成功后的用户信息
            console.log(result);
        });

        team.on('create-game-room-success', function (result) {
            console.log(result);

            // NOTE: 随后可以加入游戏房间
            var room = _tiago2.default.joinGameRoom({
                roomNum: result.roomNum
            });

            // 交由 room_manager 进行管理
            _room_manager2.default.loadRoom(room, true);

            // NOTE: 加入房间连麦
            _tiago2.default.joinRTCForGameRoom(room);
        });

        team.on('error', function (error) {
            console.log(error);
        });
    }
});

cc._RF.pop();
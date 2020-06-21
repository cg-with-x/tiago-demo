"use strict";
cc._RF.push(module, '31b05Mr3elGb7QPkp2aPsZC', 'multi_game');
// scripts/multi_game.js

'use strict';

var _room_manager = require('./room_manager');

var _room_manager2 = _interopRequireDefault(_room_manager);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _data_manager = require('./data_manager');

var _data_manager2 = _interopRequireDefault(_data_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,

    properties: {
        chatRoot: cc.Node,
        labelServerTime: cc.Label,
        players: {
            default: {}
        }
    },

    start: function start() {},
    onClickStopGame: function onClickStopGame() {
        _room_manager2.default.room.send(JSON.stringify({
            event: 'bye'
        }));
        _room_manager2.default.leave();
        cc.director.loadScene('start');

        // NOTE: 如果之前在一个组队中，则回到队伍
        if (_data_manager2.default.currentTeam) _data_manager2.default.currentTeam.return();
    },
    onClickTalk: function onClickTalk() {
        if (_room_manager2.default.room) {
            _room_manager2.default.room.send(JSON.stringify({
                event: 'talk',
                data: parseInt(Math.random() * 100)
            }));
        }
    },
    onClickReconnect: function onClickReconnect() {
        if (_room_manager2.default.room) {
            _room_manager2.default.room.reconnect();
        }
    },
    onRoomMessage: function onRoomMessage(messageStr) {
        var _this = this;

        // NOTE: 消息体的内容是开发者自己定义的，这里的代码只是一种示例
        // NOTE: 开发者可以根据自己的房间脚本和协议，实现自身游戏的逻辑
        var message = JSON.parse(messageStr);

        if (message.length) {
            message.forEach(function (_ref) {
                var event = _ref.event,
                    data = _ref.data;

                switch (event) {
                    case 'game-start':
                        break;
                    case 'environment':
                        _data_manager2.default.environment = data;
                        break;
                    case 'info':
                        _data_manager2.default.multiPlayersInfo = data;
                        _this.renderPlayers();
                        break;
                    case 'server-time':
                        _this.labelServerTime.string = _data_manager2.default.environment + ': ' + data;
                        break;
                    case 'talk':
                        _this.renderTalk(data);
                        break;
                    case 'game-over':
                        _room_manager2.default.leave();
                        cc.director.loadScene('start');
                        // NOTE: 如果之前在一个组队中，则回到队伍
                        if (_data_manager2.default.currentTeam) _data_manager2.default.currentTeam.return();
                        break;
                    default:
                        break;
                }
            });
        }
    },
    renderPlayers: function renderPlayers() {
        if (_data_manager2.default.multiPlayersInfo) {
            var players = _data_manager2.default.multiPlayersInfo;

            this.chatRoot.removeAllChildren();
            this.players = [];

            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var openId = player.openId;
                var label = new cc.Node().addComponent(cc.Label);
                this.chatRoot.addChild(label.node);
                label.node.y = -i * 70;

                this.players[openId] = {
                    openId: openId,
                    info: player,
                    label: label
                };

                this.renderTalk({ openId: openId, data: '' });
            }
        }
    },
    renderTalk: function renderTalk(_ref2) {
        var openId = _ref2.openId,
            data = _ref2.data;

        var tip = '\u6218\u6597\u529B +' + data;
        var player = this.players[openId];
        var self = _data_manager2.default.tiago.getUserInfo();

        if (player && self) {
            var isMe = player.openId === self.openId;
            var name = player.info.isAI ? 'AI: ' + player.info.nickName : player.info.nickName;
            if (isMe) name = name + '(\u6211)';
            player.label.string = name + ': ' + tip;
        }
    }

    // update (dt) {},

});

cc._RF.pop();
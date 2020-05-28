"use strict";
cc._RF.push(module, '7398acPTu1Gd6QvL0Y6RzII', 'game');
// scripts/game.js

'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
        labelPlayerATip: cc.Label,
        labelPlayerANickName: cc.Label,
        spritePlayerAAvatar: cc.Sprite,

        labelPlayerBTip: cc.Label,
        labelPlayerBNickName: cc.Label,
        spritePlayerBAvatar: cc.Sprite
    },

    start: function start() {},
    onClickStopGame: function onClickStopGame() {
        _room_manager2.default.leave();
        cc.director.loadScene('start');
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
                    case 'environment':
                        _data_manager2.default.environment = data;
                        break;
                    case 'info':
                        _data_manager2.default.twoPlayersInfo = data;
                        _this.renderPlayers();
                        break;
                    case 'server-time':
                        break;
                    case 'talk':
                        break;
                    case 'end':
                        break;
                    default:
                        break;
                }
            });
        }
    },
    renderPlayers: function renderPlayers() {
        if (_data_manager2.default.twoPlayersInfo) {
            var _dataManager$twoPlaye = _slicedToArray(_data_manager2.default.twoPlayersInfo, 2),
                playerA = _dataManager$twoPlaye[0],
                playerB = _dataManager$twoPlaye[1];

            if (playerA) {
                this.labelPlayerANickName.string = playerA.nickName;
                _utils2.default.renderAvatar(this.spritePlayerAAvatar, playerA.avatarUrl);
            }

            if (playerB) {
                this.labelPlayerBNickName.string = playerB.nickName;
                _utils2.default.renderAvatar(this.spritePlayerBAvatar, playerB.avatarUrl);
            }
        }
    }

    // update (dt) {},

});

cc._RF.pop();
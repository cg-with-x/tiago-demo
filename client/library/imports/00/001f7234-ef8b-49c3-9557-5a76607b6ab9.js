"use strict";
cc._RF.push(module, '001f7I074tJw5VXWnZge2q5', 'room_manager');
// scripts/room_manager.js

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tiago = require('@byted-creative/tiago');

var _tiago2 = _interopRequireDefault(_tiago);

var _data_manager = require('./data_manager');

var _data_manager2 = _interopRequireDefault(_data_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// NOTE: 房间服务的事件抽出单独处理
var RoomManager = function () {
    function RoomManager() {
        _classCallCheck(this, RoomManager);

        this.room = null;
    }

    _createClass(RoomManager, [{
        key: 'loadRoom',
        value: function loadRoom(room) {
            var _this = this;

            var isMulti = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.room = room;

            room.on('open', function () {
                console.log('[room] 进入游戏成功!');

                if (isMulti) {
                    // NOTE: 如果游戏场景比较复杂，可以预加载一下
                    cc.director.loadScene('multi-game', function () {
                        if (_this.room) {
                            _this.room.send(JSON.stringify({
                                event: 'ready'
                            }));
                        }
                    });
                } else {
                    // NOTE: 如果游戏场景比较复杂，可以预加载一下
                    cc.director.loadScene('game', function () {
                        if (_this.room) {
                            _this.room.send(JSON.stringify({
                                event: 'ready'
                            }));
                        }
                    });
                }
            });

            room.on('message', function (_ref) {
                var message = _ref.message;

                console.log('[room] 接受到消息: ', message);

                var scene = cc.director.getScene();
                if (scene.name === 'game') {

                    // NOTE: 也可以使用 Event 方式传递
                    var canvas = scene.getChildByName('Canvas');
                    if (canvas) {
                        canvas.getComponent('game').onRoomMessage(message);
                    }
                } else if (scene.name === 'multi-game') {
                    // NOTE: 也可以使用 Event 方式传递
                    var _canvas = scene.getChildByName('Canvas');
                    if (_canvas) {
                        _canvas.getComponent('multi_game').onRoomMessage(message);
                    }
                }
            });

            room.on('close', function () {
                console.log('[room] 房间关闭!');

                // NOTE: 根据需要进行重新连接
                // setTimeout(() => {
                //     room.reconnect();
                // }, 1000)
            });

            room.on('error', function (param) {
                console.log('[room] 房间出错:', param);
            });

            room.on('reconnecting', function (param) {
                console.log('[room] 重连中...', param);
            });
        }
    }, {
        key: 'leave',
        value: function leave() {
            if (this.room) {
                this.room.close();
                this.room = null;
            }
        }
    }]);

    return RoomManager;
}();

module.exports = new RoomManager();

cc._RF.pop();
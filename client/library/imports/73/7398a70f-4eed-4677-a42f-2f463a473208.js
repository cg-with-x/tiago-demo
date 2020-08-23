"use strict";
cc._RF.push(module, '7398acPTu1Gd6QvL0Y6RzII', 'game');
// scripts/game.js

"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _room_manager = require("./room_manager");

var _room_manager2 = _interopRequireDefault(_room_manager);

var _utils = require("./utils");

var _utils2 = _interopRequireDefault(_utils);

var _data_manager = require("./data_manager");

var _data_manager2 = _interopRequireDefault(_data_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
  extends: cc.Component,

  playerAOpenId: "",
  playerBOpenId: "",

  properties: {
    labelPlayerATip: cc.Label,
    labelPlayerANickName: cc.Label,
    spritePlayerAAvatar: cc.Sprite,

    labelPlayerBTip: cc.Label,
    labelPlayerBNickName: cc.Label,
    spritePlayerBAvatar: cc.Sprite,

    labelServerTime: cc.Label
  },

  start: function start() {},
  onClickStopGame: function onClickStopGame() {
    _room_manager2.default.room.send(JSON.stringify({
      event: "bye"
    }));
    // NOTE: 推出连麦
    if (_data_manager2.default.tiago) _data_manager2.default.tiago.leaveRTCFromGameRoom(_room_manager2.default.room);
    console.warn('游戏结束');
    _data_manager2.default.isGameEnd = true;
    if (_data_manager2.default.gameRecorderManager) {
      _data_manager2.default.gameRecorderManager.stop();
    }
    if (_data_manager2.default.tiago && _data_manager2.default.videoTempPath && _data_manager2.default.isGameEnd) {
      _data_manager2.default.tiago.uploadVideo(_data_manager2.default.videoTempPath, "Hello Wonderland").then(function () {
        tt.hideLoading();
        tt.showToast({
          title: "\u5F55\u5C4F\u4E0A\u4F20\u6210\u529F",
          icon: "none",
          duration: 3000
        });
      }).catch(function (e) {
        tt.hideLoading();
        tt.showToast({
          title: "\u5F55\u5C4F\u4E0A\u4F20\u5931\u8D25",
          icon: "none",
          duration: 3000
        });
      });
    }
    _room_manager2.default.leave();
    cc.director.loadScene("start");

    // NOTE: 如果之前在一个组队中，则回到队伍
    if (_data_manager2.default.currentTeam) _data_manager2.default.currentTeam.return();
  },
  onClickTalk: function onClickTalk() {
    if (_room_manager2.default.room) {
      _room_manager2.default.room.send(JSON.stringify({
        event: "talk",
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
          case "game-start":
            break;
          case "environment":
            _data_manager2.default.environment = data;
            break;
          case "info":
            _data_manager2.default.twoPlayersInfo = data;
            _this.renderPlayers();
            break;
          case "server-time":
            _this.labelServerTime.string = _data_manager2.default.environment + ": " + data;
            break;
          case "talk":
            _this.renderTalk(data);
            break;
          case "game-over":
            // NOTE: 推出连麦
            if (_data_manager2.default.tiago) _data_manager2.default.tiago.leaveRTCFromGameRoom(_room_manager2.default.room);
            _room_manager2.default.leave();
            cc.director.loadScene("start");
            // NOTE: 如果之前在一个组队中，则回到队伍
            if (_data_manager2.default.currentTeam) _data_manager2.default.currentTeam.return();
            console.warn("游戏结束");
            _data_manager2.default.isGameEnd = true;
            if (_data_manager2.default.gameRecorderManager) {

              _data_manager2.default.gameRecorderManager.stop();
            }

            if (_data_manager2.default.tiago && _data_manager2.default.videoTempPath && _data_manager2.default.isGameEnd) {
              _data_manager2.default.tiago.uploadVideo(_data_manager2.default.videoTempPath, "Hello Wonderland").then(function () {
                tt.hideLoading();
                tt.showToast({
                  title: "\u5F55\u5C4F\u4E0A\u4F20\u6210\u529F",
                  icon: "none",
                  duration: 3000
                });
              }).catch(function (e) {
                tt.hideLoading();
                tt.showToast({
                  title: "\u5F55\u5C4F\u4E0A\u4F20\u5931\u8D25",
                  icon: "none",
                  duration: 3000
                });
              });
            }

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
        this.playerAOpenId = playerA.openId;
        var name = playerA.isAI ? "AI: " + playerA.nickName : playerA.nickName;
        this.labelPlayerANickName.string = name;
        _utils2.default.renderAvatar(this.spritePlayerAAvatar, playerA.avatarUrl);
      }

      if (playerB) {
        this.playerBOpenId = playerB.openId;
        var _name = playerB.isAI ? "AI: " + playerB.nickName : playerB.nickName;
        this.labelPlayerBNickName.string = _name;
        _utils2.default.renderAvatar(this.spritePlayerBAvatar, playerB.avatarUrl);
      }
    }
  },
  renderTalk: function renderTalk(_ref2) {
    var openId = _ref2.openId,
        data = _ref2.data;

    var tip = "\u6218\u6597\u529B +" + data;
    if (openId === this.playerAOpenId) {
      this.labelPlayerATip.string = tip;
    } else if (openId === this.playerBOpenId) {
      this.labelPlayerBTip.string = tip;
    }
  }
}

// update (dt) {},
);

cc._RF.pop();
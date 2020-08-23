import roomManager from "./room_manager";

import utils from "./utils";
import dataManager from "./data_manager";

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

    labelServerTime: cc.Label,
  },

  start() {},

  onClickStopGame() {
    roomManager.room.send(
      JSON.stringify({
        event: "bye",
      })
    );
    // NOTE: 推出连麦
    if (dataManager.tiago)
      dataManager.tiago.leaveRTCFromGameRoom(roomManager.room);
    console.warn('游戏结束')
    dataManager.isGameEnd = true;
    if (dataManager.gameRecorderManager) {
      dataManager.gameRecorderManager.stop();
    }
    if (
      dataManager.tiago &&
      dataManager.videoTempPath &&
      dataManager.isGameEnd
    ) {
      dataManager.tiago
        .uploadVideo(dataManager.videoTempPath, "Hello Wonderland")
        .then(() => {
          tt.hideLoading();
          tt.showToast({
            title: `录屏上传成功`,
            icon: "none",
            duration: 3000,
          });
        })
        .catch((e) => {
          tt.hideLoading();
          tt.showToast({
            title: `录屏上传失败`,
            icon: "none",
            duration: 3000,
          });
        });
    }
    roomManager.leave();
    cc.director.loadScene("start");

    // NOTE: 如果之前在一个组队中，则回到队伍
    if (dataManager.currentTeam) dataManager.currentTeam.return();
  },

  onClickTalk() {
    if (roomManager.room) {
      roomManager.room.send(
        JSON.stringify({
          event: "talk",
          data: parseInt(Math.random() * 100),
        })
      );
    }
  },

  onClickReconnect() {
    if (roomManager.room) {
      roomManager.room.reconnect();
    }
  },

  onRoomMessage(messageStr) {
    // NOTE: 消息体的内容是开发者自己定义的，这里的代码只是一种示例
    // NOTE: 开发者可以根据自己的房间脚本和协议，实现自身游戏的逻辑
    const message = JSON.parse(messageStr);

    if (message.length) {
      message.forEach(({ event, data }) => {
        switch (event) {
          case "game-start":
            break;
          case "environment":
            dataManager.environment = data;
            break;
          case "info":
            dataManager.twoPlayersInfo = data;
            this.renderPlayers();
            break;
          case "server-time":
            this.labelServerTime.string = `${dataManager.environment}: ${data}`;
            break;
          case "talk":
            this.renderTalk(data);
            break;
          case "game-over":
            // NOTE: 推出连麦
            if (dataManager.tiago)
              dataManager.tiago.leaveRTCFromGameRoom(roomManager.room);
              roomManager.leave();
              cc.director.loadScene("start");
            // NOTE: 如果之前在一个组队中，则回到队伍
            if (dataManager.currentTeam) dataManager.currentTeam.return();
          console.warn("游戏结束");
            dataManager.isGameEnd = true;
            if (dataManager.gameRecorderManager) {
              
              dataManager.gameRecorderManager.stop();
            }

            if (
              dataManager.tiago &&
              dataManager.videoTempPath &&
              dataManager.isGameEnd
            ) {
              dataManager.tiago
                .uploadVideo(dataManager.videoTempPath, "Hello Wonderland")
                .then(() => {
                  tt.hideLoading();
                  tt.showToast({
                    title: `录屏上传成功`,
                    icon: "none",
                    duration: 3000,
                  });
                })
                .catch((e) => {
                  tt.hideLoading();
                  tt.showToast({
                    title: `录屏上传失败`,
                    icon: "none",
                    duration: 3000,
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

  renderPlayers() {
    if (dataManager.twoPlayersInfo) {
      const [playerA, playerB] = dataManager.twoPlayersInfo;

      if (playerA) {
        this.playerAOpenId = playerA.openId;
        const name = playerA.isAI
          ? `AI: ${playerA.nickName}`
          : playerA.nickName;
        this.labelPlayerANickName.string = name;
        utils.renderAvatar(this.spritePlayerAAvatar, playerA.avatarUrl);
      }

      if (playerB) {
        this.playerBOpenId = playerB.openId;
        const name = playerB.isAI
          ? `AI: ${playerB.nickName}`
          : playerB.nickName;
        this.labelPlayerBNickName.string = name;
        utils.renderAvatar(this.spritePlayerBAvatar, playerB.avatarUrl);
      }
    }
  },

  renderTalk({ openId, data }) {
    const tip = `战斗力 +${data}`;
    if (openId === this.playerAOpenId) {
      this.labelPlayerATip.string = tip;
    } else if (openId === this.playerBOpenId) {
      this.labelPlayerBTip.string = tip;
    }
  },

  // update (dt) {},
});

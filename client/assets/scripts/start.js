import tiago from "@byted-creative/tiago";
import roomManager from "./room_manager";
import dataManager from "./data_manager";
import utils from "./utils";

cc.Class({
  extends: cc.Component,

  properties: {
    labelNickName: cc.Label,
    spriteAvatar: cc.Sprite,
    nodeFeature: cc.Node,
    nodeLoading: cc.Node,
  },

  onLoad() {
    if (!dataManager.tiagoInited) {
      this.nodeFeature.active = false;
      this.nodeLoading.active = true;

      tiago
        .init({
          appId: "ttbad4cc6925eea862",
          debug: true,
        })
        .then(() => {
          console.log("tiago init success.");
          dataManager.tiagoInited = true;

          this.nodeFeature.active = true;
          this.nodeLoading.active = false;
        })
        .catch((err) => {
          console.log(err);
          // NOTE: 一般情况不会出错，我们会对错误情况做监控，游戏可以处理一些异常情况下的表现
        });
    } else {
      this.nodeFeature.active = true;
      this.nodeLoading.active = false;
    }

    console.log("loaded");
  },

  start() {
    if (dataManager.selfUserInfo) {
      this.renderSelf(dataManager.selfUserInfo);
    }
  },

  renderSelf(info) {
    this.labelNickName.string = info.nickName;
    utils.renderAvatar(this.spriteAvatar, info.avatarUrl);
  },

  onClickGetConfig() {
    const { BUSINESS_SCENE } = tiago;

    const config = tiago.getConfig();
    console.log(config);

    const { currentScene, scene } = config;

    if (currentScene === BUSINESS_SCENE.LiveRoom) {
      // 当前是直播场景
      const params = scene[currentScene];

      if (params.isNewcomer) {
        // NOTE: 补充新手逻辑
        console.log("新手首次加入游戏");
      }

      // NOTE: 针对直播场景，调整使用直播专用的 UI，或处理其他特殊逻辑
    } else if (currentScene === BUSINESS_SCENE.Wonderland) {
      // 当前是 W 场景
    }
  },

  onClickGetUserInfo() {
    const info = tiago.getUserInfo();
    console.log(info);

    // NOTE: 这里只是简单的保存下来
    dataManager.selfUserInfo = info;
    this.renderSelf(dataManager.selfUserInfo);
  },

  onClickStartSingleMatch() {
    const match = tiago.startSingleMatch();

    match.on("match-success", (result) => {
      // 获得匹配成功后的用户信息
      console.log(result);
    });

    match.on("create-game-room-success", (result) => {
      console.log(result);

      // NOTE: 随后可以加入游戏房间
      const room = tiago.joinGameRoom({
        roomNum: result.roomNum,
      });

      // NOTE: 加入房间连麦
      tiago.joinRTCForGameRoom(room);

      // 交由 room_manager 进行管理
      roomManager.loadRoom(room);
    });

    match.on("error", (error) => {
      console.log(error);
    });
  },

  onClickStartSingleMatchAI() {
    const match = tiago.startSingleMatch({
      isAutoAppendAI: true, // 支持 AI 逻辑
    });

    match.on("match-success", (result) => {
      // 获得匹配成功后的用户信息
      console.log(result);
    });

    match.on("create-game-room-success", (result) => {
      console.log(result);

      // NOTE: 随后可以加入游戏房间
      const room = tiago.joinGameRoom({
        roomNum: result.roomNum,
      });
      // NOTE: 加入房间连麦
      tiago.joinRTCForGameRoom(room);

      // 交由 room_manager 进行管理
      roomManager.loadRoom(room);
    });

    match.on("error", (error) => {
      console.log(error);
    });
  },
});

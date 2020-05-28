import roomManager from './room_manager';

import utils from './utils';
import dataManager from './data_manager';

cc.Class({
    extends: cc.Component,

    properties: {
        labelPlayerATip: cc.Label,
        labelPlayerANickName: cc.Label,
        spritePlayerAAvatar: cc.Sprite,

        labelPlayerBTip: cc.Label,
        labelPlayerBNickName: cc.Label,
        spritePlayerBAvatar: cc.Sprite,
    },

    start () {

    },

    onClickStopGame() { 
        roomManager.leave();
        cc.director.loadScene('start');
    },

    onRoomMessage(message) {
        // NOTE: 消息体的内容是开发者自己定义的，这里的代码只是一种示例
        // NOTE: 开发者可以根据自己的房间脚本和协议，实现自身游戏的逻辑
        const { event, data } = JSON.parse(message);

        switch (event) {
            case 'environment':
                dataManager.environment = data;
                break;
            case 'info':
                dataManager.twoPlayersInfo = data;
                this.renderPlayers();
                break;
            case 'server-time':
                break;
            case 'end':
                break;
            default:
                break;
        }
    },

    renderPlayers() {
        if (dataManager.twoPlayersInfo) {
            const [ playerA, playerB ] = dataManager.twoPlayersInfo;

            if (playerA) {
                this.labelPlayerANickName.string = playerA.nickName;
                utils.renderAvatar(this.spritePlayerAAvatar, playerA.avatarUrl);
            }

            if (playerB) {
                this.labelPlayerBNickName.string = playerB.nickName;
                utils.renderAvatar(this.spritePlayerBAvatar, playerB.avatarUrl);
            }
        }
    }

    // update (dt) {},
});

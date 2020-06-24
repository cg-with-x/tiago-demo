import roomManager from './room_manager';

import utils from './utils';
import dataManager from './data_manager';        

cc.Class({
    extends: cc.Component,      

    properties: {
        chatRoot: cc.Node,
        labelServerTime: cc.Label,
        players: {
            default: {},
        },
    },

    start () {

    },

    onClickStopGame() {
        roomManager.room.send(JSON.stringify({
            event: 'bye',
        }));
        // NOTE: 推出连麦
        if (dataManager.tiago) dataManager.tiago.leaveRtcFromGameRoom(roomManager.room);

        roomManager.leave();
        cc.director.loadScene('start');

        // NOTE: 如果之前在一个组队中，则回到队伍
        if (dataManager.currentTeam) dataManager.currentTeam.return();
    },

    onClickTalk() {
        if (roomManager.room) {
            roomManager.room.send(JSON.stringify({
                event: 'talk',
                data: parseInt(Math.random() * 100),
            }));
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
                    case 'game-start':
                        break;
                    case 'environment':
                        dataManager.environment = data;
                        break;
                    case 'info':
                        dataManager.multiPlayersInfo = data;
                        this.renderPlayers();
                        break;
                    case 'server-time':
                        this.labelServerTime.string = `${dataManager.environment}: ${data}`;
                        break;
                    case 'talk':
                        this.renderTalk(data);
                        break;
                    case 'game-over':
                        // NOTE: 推出连麦
                        if (dataManager.tiago) dataManager.tiago.leaveRtcFromGameRoom(roomManager.room);
                        roomManager.leave();
                        cc.director.loadScene('start');
                        // NOTE: 如果之前在一个组队中，则回到队伍
                        if (dataManager.currentTeam) dataManager.currentTeam.return();
                        break;
                    default:
                        break;
                }
            })
        }
    },

    renderPlayers() {
        if (dataManager.multiPlayersInfo) {
            const players = dataManager.multiPlayersInfo;

            this.chatRoot.removeAllChildren();
            this.players = [];

            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                const openId = player.openId;
                const label = new cc.Node().addComponent(cc.Label);
                this.chatRoot.addChild(label.node);
                label.node.y = -i * 70;

                this.players[openId] = {
                    openId,
                    info: player,
                    label,
                };

                this.renderTalk({ openId, data: '' });
            }
        }
    },

    renderTalk({ openId, data }) {
        const tip = `战斗力 +${data}`;
        const player = this.players[openId];
        const self = dataManager.tiago.getUserInfo();

        if (player && self) {
            const isMe = player.openId === self.openId;
            let name = player.info.isAI ? `AI: ${player.info.nickName}` : player.info.nickName;
            if (isMe) name = `${name}(我)`;
            player.label.string = `${name}: ${tip}`;
        }
    }

    // update (dt) {},
});
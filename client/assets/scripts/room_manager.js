import tiago from '@byted-creative/tiago';
import dataManager from './data_manager';

// NOTE: 房间服务的事件抽出单独处理
class RoomManager {
    constructor() {
        this.room = null;
    }

    loadRoom(room) {
        this.room = room;

        room.on('open', () => {
            console.log('[room] 进入游戏成功!');

            this.room.send(JSON.stringify({
                event: 'ready',
            }));
        });

        room.on('message', ({ message }) => {
            console.log('[room] 接受到消息: ', message);

            const scene = cc.director.getScene();
            if (scene.name === 'game') {

                // NOTE: 也可以使用 Event 方式传递
                const canvas = scene.getChildByName('Canvas');
                if (canvas) {
                    canvas.getComponent('game').onRoomMessage(message);
                }
            } else if (scene.name === 'multi-game') {
                // NOTE: 也可以使用 Event 方式传递
                const canvas = scene.getChildByName('Canvas');
                if (canvas) {
                    canvas.getComponent('multi_game').onRoomMessage(message);
                }
            }
        });

        room.on('close', () => {
            console.log('[room] 房间关闭!');

            // NOTE: 根据需要进行重新连接
            // setTimeout(() => {
            //     room.reconnect();
            // }, 1000)
        });

        room.on('error', (param) => {
            console.log('[room] 房间出错:', param);
        });

        room.on('reconnecting', (param) => {
            console.log('[room] 重连中...', param);
        });
    }

    leave() {
        if (this.room) {
            this.room.close();
            this.room = null;
        }
    }
}

module.exports = new RoomManager();
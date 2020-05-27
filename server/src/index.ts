import { RoomGlobal } from "@byted-game/GameRoom";

declare const global: RoomGlobal;

export default class MyRoom {
    public constructor() {
        global.room.on("join", (param) => {
            //todo 玩家加入
            global.room.debug(`玩家加入: ${JSON.stringify(param)}`)
        });
        global.room.on("message", (param) => {
            // 收到消息
            global.room.debug(`收到消息： ${JSON.stringify(param)}`)
        });
        global.room.on("leave", (param) => {
            // 玩家离开
            global.room.debug(`玩家离开： ${JSON.stringify(param)}`)
        });

        global.room.on("config", (param) => {
            // 收到config
            global.room.debug(`收到config: config ${JSON.stringify(param)}`)
        });

    }
}

new MyRoom();
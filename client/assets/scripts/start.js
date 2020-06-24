import tiago from '@byted-creative/tiago';
import roomManager from './room_manager';
import dataManager from './data_manager';
import utils from './utils';

cc.Class({
    extends: cc.Component,        

    properties: {
        labelNickName: cc.Label,
        spriteAvatar: cc.Sprite,
        nodeFeature: cc.Node,
        nodeLoading: cc.Node,
    },

    onLoad () {
        if (!dataManager.tiagoInited) {
            this.nodeFeature.active = false;
            this.nodeLoading.active = true;

            tiago.init({
                appId: 'tt5e982825c1b2d9a3',
                debug: true,
                onJoinTeam: (team) => { this.onJoinTeam(team) }, // 2.0 的主要功能，组队，会在受邀加入队伍、或自己创建队伍后触发！
            }).then(() => {
                console.log('tiago init success.');
                dataManager.tiagoInited = true;
                dataManager.tiago = tiago;

                this.nodeFeature.active = true;
                this.nodeLoading.active = false;
            }).catch(err => {
                console.log(err);
                // NOTE: 一般情况不会出错，我们会对错误情况做监控，游戏可以处理一些异常情况下的表现
            });
        } else {
            this.nodeFeature.active = true;
            this.nodeLoading.active = false;
        }

        console.log('loaded')
    },

    start () {
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
                console.log('新手首次加入游戏');
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

        match.on('match-success', result => {
            // 获得匹配成功后的用户信息
            console.log(result);
        });
        
        match.on('create-game-room-success', result => {
            console.log(result);

            // NOTE: 如果游戏场景比较复杂，可以预加载一下
            // 可以先切换场景，然后连入游戏房间
            cc.director.loadScene('game', () => {
                // NOTE: 随后可以加入游戏房间
                const room = tiago.joinGameRoom({
                    roomNum: result.roomNum,
                });
                
                // NOTE: 加入房间连麦
                tiago.joinRTCForGameRoom(room);

                // 交由 room_manager 进行管理
                roomManager.loadRoom(room);
            });
        });
        
        match.on('error', error => {
            console.log(error);
        });
    },

    onClickStartSingleMatchAI() {
        const match = tiago.startSingleMatch({
            isAutoAppendAI: true, // 支持 AI 逻辑
        });

        match.on('match-success', result => {
            // 获得匹配成功后的用户信息
            console.log(result);
        });
        
        match.on('create-game-room-success', result => {
            console.log(result);

            // NOTE: 如果游戏场景比较复杂，可以预加载一下
            // 可以先切换场景，然后连入游戏房间
            cc.director.loadScene('game', () => {
                // NOTE: 随后可以加入游戏房间
                const room = tiago.joinGameRoom({
                    roomNum: result.roomNum,
                });
                
                // NOTE: 加入房间连麦
                tiago.joinRTCForGameRoom(room);

                // 交由 room_manager 进行管理
                roomManager.loadRoom(room);
            });
        });
        
        match.on('error', error => {
            console.log(error);
        });
    },

    onClickMakeTeam(event, userData) {
        // userData: '2', '2-ai', 符合这类格式
        let [ size, ai ] = userData.split('-');
        size = parseInt(size);
        ai = !!ai;

        console.log(size);
        console.log(ai);

        // NOTE: 创建新队伍前，先清理一下
        dataManager.currentTeam = null;

        // NOTE: 创建一个队伍，匹配时进行 Single 类型匹配
        tiago.makeTeam({
            teamSize: size,  // 2-9 人
            isAutoJoinRTC: true, // 默认组队时进行连麦
            match: {
                type: tiago.MATCH_TYPE.Single, // SINGLE, NVN,
                minPlayerCount: 1, // 1 个人就能玩
                isAutoAppendAI: ai, // 配合 SINGLE，字段，默认不补充 AI，NVN 匹配时不支持 AI
                gameRoomScriptId: 'room-283', // 房间服务适用、指定不同的游戏房间脚本 ID（注意不是脚本名称）、配合 IDE 上传房间脚本时使用
                // disableAutoCreateGameRoom: true, // 默认自动创建游戏房间，可以关闭（生肖派对），关闭后，gameRoomScriptId 字段失效
            },
        });

        // NOTE: 后续的逻辑，都会由 tiago init 时传入的 `onJoinTeam` 回调触发
    },

    onClickRoom() {
        cc.director.loadScene('room');
    },

    onJoinTeam(team) {
        // NOTE: 可以在适当的时机进行清理，例如：在每次 makeTeam 之前。
        dataManager.currentTeam = team;

        team.on('match-success', result => {
            // 获得匹配成功后的用户信息
            console.log(result);
        });
        
        team.on('create-game-room-success', result => {
            console.log(result);

            // NOTE: 如果游戏场景比较复杂，可以预加载一下
            // 可以先切换场景，然后连入游戏房间
            cc.director.loadScene('multi-game', () => {
                // NOTE: 随后可以加入游戏房间
                const room = tiago.joinGameRoom({
                    roomNum: result.roomNum,
                });
                
                // NOTE: 加入房间连麦
                tiago.joinRTCForGameRoom(room);

                // 交由 room_manager 进行管理
                roomManager.loadRoom(room);
            });
        });
        
        team.on('error', error => {
            console.log(error);
        });
    }
});
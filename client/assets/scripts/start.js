import tiago from '@byted-creative/tiago';

if (tiago.utils.isTT()) {
    tiago.init({
        appId: 'tt5e982825c1b2d9a3',
        debug: true,
    }).then(() => {
        console.log('tiago init success.');
    }).catch(err => {
        console.log(err);
        // NOTE: 一般情况不会出错，我们会对错误情况做监控，游戏可以处理一些异常情况下的表现
    });
}

cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        
    },

    onClickGetConfig() {
        const { BUSINESS_SCENE } = tiago;

        const config = tiago.getConfig();
        console.log(config);

        const { currentScene, scene } = config;

        if (currentScene === BUSINESS_SCENE.LiveRoom) {
            // 当前是直播场景
            const params = scene[currentScene];

            if (params.isAIRequired) {  
                // NOTE: 补充 AI 逻辑
            }
            
            // NOTE: 针对直播场景，调整使用直播专用的 UI，或处理其他特殊逻辑
        } else if (currentScene === BUSINESS_SCENE.Wonderland) {
            // 当前是 W 场景
        }
    },

    onClickGetUserInfo() {
        const userinfo = tiago.getUserInfo();
        console.log(userinfo);
    },

    onClickStartSingleMatch() {
        const match = tiago.startSingleMatch();

        match.on('match-success', result => {
            // 获得匹配成功后的用户信息
            console.log(result);
        });
        
        match.on('create-game-room-success', result => {
            console.log(result);

            // NOTE: 随后可以加入游戏房间
            const room = tiago.joinGameRoom({
                roomNum: result.roomNum,
            });
            
            // NOTE: 加入房间连麦
            tiago.joinRTCForGameRoom(room);
        });
        
        match.on('error', error => {
            console.log(error);
        });
    },
});
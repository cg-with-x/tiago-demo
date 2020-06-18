import dataManager from './data_manager';

cc.Class({
    extends: cc.Component,
    
    properties: {
        numLabel: cc.Label,
        num: '',
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onClickNumber(event, number) {
        this.num = `${this.num ? this.num : ''}${number}`;
        this.numLabel.string = `房间号：${this.num}`;
    },

    onClickJoin() {
        const { tiago, tiagoInited } = dataManager;
        if (tiagoInited) {
            const { BUSINESS_SCENE, GAME_ENV } = tiago; 
            const config = tiago.getConfig();
            tiago.utils.joinTeamRoom({
                roomNum: this.num,
                currentScene: BUSINESS_SCENE.Wonderland,
                gameEnv: GAME_ENV.Test,
            });
        } else {
            this.numLabel.string = 'tiago 未初始化！';
        }
    },

    onClickClean() {
        this.num = '';
        this.numLabel.string = `房间号：${this.num ? this.num : 'N/A'}`;
    },

    onClickBack() {
        cc.director.loadScene('start');
    }

    // update (dt) {},
});

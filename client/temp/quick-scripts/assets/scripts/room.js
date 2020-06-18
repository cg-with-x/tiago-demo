(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/room.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '30cfeljnxpITIVPUTt2+yI7', 'room', __filename);
// scripts/room.js

'use strict';

var _data_manager = require('./data_manager');

var _data_manager2 = _interopRequireDefault(_data_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,

    properties: {
        numLabel: cc.Label,
        num: ''
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},
    onClickNumber: function onClickNumber(event, number) {
        this.num = '' + (this.num ? this.num : '') + number;
        this.numLabel.string = '\u623F\u95F4\u53F7\uFF1A' + this.num;
    },
    onClickJoin: function onClickJoin() {
        var tiago = _data_manager2.default.tiago,
            tiagoInited = _data_manager2.default.tiagoInited;

        if (tiagoInited) {
            var BUSINESS_SCENE = tiago.BUSINESS_SCENE,
                GAME_ENV = tiago.GAME_ENV;

            var config = tiago.getConfig();
            tiago.utils.joinTeamRoom({
                roomNum: this.num,
                currentScene: BUSINESS_SCENE.Wonderland,
                gameEnv: GAME_ENV.Test
            });
        } else {
            this.numLabel.string = 'tiago 未初始化！';
        }
    },
    onClickClean: function onClickClean() {
        this.num = '';
        this.numLabel.string = '\u623F\u95F4\u53F7\uFF1A' + (this.num ? this.num : 'N/A');
    },
    onClickBack: function onClickBack() {
        cc.director.loadScene('start');
    }

    // update (dt) {},

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=room.js.map
        
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/starts.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8c3989vaYpPj4yWNECdK7SR', 'starts', __filename);
// scripts/starts.js

// import tiago from '@byted-creative/tiago';

// function start() {
//     cc.Class({
//         extends: cc.Component,

//         properties: {
//         },

//         start () {

//         },

//         onClickGetConfig() {
//             const { BUSINESS_SCENE } = tiago;

//             const config = tiago.getConfig();
//             console.log(config);

//             const { currentScene, scene } = config;

//             if (currentScene === BUSINESS_SCENE.LiveRoom) {
//                 // 当前是直播场景
//                 const params = scene[currentScene];

//                 if (params.isAIRequired) {  
//                     // NOTE: 补充 AI 逻辑
//                 }

//                 // NOTE: 针对直播场景，调整使用直播专用的 UI，或处理其他特殊逻辑
//             } else if (currentScene === BUSINESS_SCENE.Wonderland) {
//                 // 当前是 W 场景
//             }
//         },

//         onClickGetUserInfo() {
//             const userinfo = tiago.getUserInfo();
//             console.log(userinfo);
//         },

//         onClickStartSingleMatch() {
//             tiago.startSingleMatch();
//             console.log(userinfo);
//         },
//     });
// }

// if (tiago.utils.isTT()) {
//     tiago.init({
//         appId: '',

//     })
// } else {
//     start();
// }
"use strict";

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
        //# sourceMappingURL=starts.js.map
        
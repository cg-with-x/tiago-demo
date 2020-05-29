(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/data_manager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b3196BS1dpFt7N9xcK6Wa6O', 'data_manager', __filename);
// scripts/data_manager.js

'use strict';

// NOTE: 用于存储一些数据
var dataManager = {
    tiagoInited: false,
    selfUserInfo: null,
    twoPlayersInfo: null,
    environment: ''
};

module.exports = dataManager;

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
        //# sourceMappingURL=data_manager.js.map
        
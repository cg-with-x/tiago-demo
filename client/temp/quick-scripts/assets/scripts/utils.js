(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/utils.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '50e3bbDxkpCHbSfXdjneirM', 'utils', __filename);
// scripts/utils.js

"use strict";

var utils = {
    renderAvatar: function renderAvatar(target, url) {
        // NOTE: 加载远程头像资源（通过 Image.src 加载，无需额外配置域名白名单）
        cc.loader.load({
            type: "image",
            url: url
        }, function (err, texture) {
            if (err) {
                console.log('渲染头像错误: ', err);
                console.log("\u5934\u50CF\u5730\u5740: " + url);
            } else {
                target.spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    }
};

module.exports = utils;

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
        //# sourceMappingURL=utils.js.map
        
"use strict";
cc._RF.push(module, '50e3bbDxkpCHbSfXdjneirM', 'utils');
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
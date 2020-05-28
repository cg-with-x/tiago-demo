const utils = {
    renderAvatar(target, url) {
        // NOTE: 加载远程头像资源（通过 Image.src 加载，无需额外配置域名白名单）
        cc.loader.load({
            type: "image",
            url,
        }, (err, texture) => {
            if (err) {
                console.log('渲染头像错误: ', err);
                console.log(`头像地址: ${url}`);
            } else {
                target.spriteFrame = new cc.SpriteFrame(texture);
            }
        });
    }
}

module.exports = utils;
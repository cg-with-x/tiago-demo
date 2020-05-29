## tiago-demo

互动游戏 SDK 接入 DEMO

## 目录说明

```
tiago-demo
├─README.md
├─server // 房间服务脚本根目录
|   ├─package.json
|   ├─rollup.config.js
|   ├─yarn.lock
|   ├─src // 房间脚本源码
|   |  ├─game.js
|   |  ├─main.js
|   |  ├─sender.js
|   |  └─utils.js
|   ├─dist // 房间脚本导出两个环境
|   |  ├─bundle.release.js
|   |  └─bundle.test.js  
├─client // cocos-creator 项目根目录
...
```

## 安装运行

1. 运行小游戏客户端
- 在 client 目录下，执行 `yarn install` 安装依赖
- 使用 cocos creator 打开 client 目录即可

2. 房间服务脚本开发
- 在 server 目录下，执行 `yarn install` 安装依赖
- 在 server 目录下，执行 `npm run dev` 即可构建


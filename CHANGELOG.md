# Changelog

## 3.0.0-rc.1

- 配套 CoCoFaith 3.0.0-rc.1 发布，无功能变更。

## 3.0.0-alpha.5

- 整理消息筛选、业务分发和发送流程，卸载后丢弃仍在执行的回复。
- 包名改为 `koishi-plugin-cocofaith-adapter-onebot`，支持多 Adapter 同时启用。
- 修复 ESM 入口加载失败。

## 3.0.0-alpha.4

- 事件、响应和接入契约统一使用 SDK 公共协议。

## 3.0.0-alpha.3

- 通过 SDK 契约接入业务，支持第三方 Core、Business 实现。
- 绑定模式仅处理申请绑定和确认绑定；正常模式支持按配置开放新 UID 注册。

## 3.0.0-alpha.2

- 接入 CoCoFaith v3 统一命令路由，支持 OneBot 与 QQ 官方机器人 UID 的双向令牌绑定。
- 支持普通回复、图片降级与全服广播。

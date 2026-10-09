# Changelog

## 3.0.0-alpha.4

- Business 事件、分发响应和 Adapter 契约统一引用 SDK 的 `protocol` 入口，移除适配器内重复协议定义。
- test 命令加入类型检查，提供统一源码排版命令。
- 显式声明 Koishi 开发依赖；CI 构建对应版本的 SDK 测试实现，分支/PR 检查与发布流程共用依赖准备步骤。

## 3.0.0-alpha.3

- 移除对 Core 与 Business 插件包的构建依赖，公共身份和消息协议统一引用 `@mueo/cocofaith-sdk`。
- 绑定模式仅放行申请绑定与确认绑定，不再处理其他“椰子水”命令。
- 正常模式增加 OneBot 注册开关，默认禁止创建新 UID。

## 3.0.0-alpha.2

- 接入 CoCoFaith v3 的统一命令路由与消息协议。
- 支持 OneBot QQ 与既有 QQ 官方机器人 UID 的双向令牌绑定。
- 支持普通回复、图片降级与全服广播。

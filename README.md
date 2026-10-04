# CoCoFaith Adapter OneBot

CoCoFaith v3 的 OneBot 平台接入。

插件负责解析 OneBot 消息与 QQ 号、调用 Business 命令路由，并将统一业务结果发送到 OneBot。

## 依赖

- `@mueo/koishi-plugin-cocofaith-core`
- `@mueo/koishi-plugin-cocofaith-business`
- Koishi 数据库服务
- 可提供 OneBot Session 的适配器

请先加载 Core 和 Business，再加载本插件。

## 身份规则

默认配置下，OneBot QQ 号只用于关联已有 UID。

用户需要先在 QQ 官方机器人完成注册，再使用双向令牌完成绑定。

只有同时启用正常模式和 `allowRegistration` 时，OneBot 用户才能通过 `信仰 注册` 创建新 UID。

1. OneBot 私聊发送 `椰子水 申请绑定`，取得 Token A。
2. 已注册用户在 QQ 官方机器人群聊发送 `椰子水 申请绑定 TokenA`。
3. Token B 会发送到第一步的 OneBot 私聊。
4. 回到第一步的 OneBot 私聊，发送 `椰子水 确认绑定 TokenB`。

绑定完成后，OneBot QQ 与 QQ 官方机器人身份会解析到同一 UID。若 QQ 官方身份尚未注册，申请会被拒绝；若 QQ 号已属于其他 UID，也不会自动合并。

可在任一平台使用 `椰子水 用户信息` 查看当前 UID、平台身份和已绑定 QQ。

## 配置

- `mode`：运行模式，默认 `binding`。
  - `binding`：仅在 OneBot 私聊处理 `椰子水 申请绑定` 和 `椰子水 确认绑定`，不处理其他命令。
  - `normal`：接收 OneBot 私聊和群聊中的全部 CoCoFaith 命令。
- `allowRegistration`：正常模式下是否允许 OneBot 用户直接注册新 UID，默认关闭；绑定模式始终禁止注册。
- `enableBroadcast`：是否发送 Business 提供的全服广播，默认开启。

同时运行 QQ 官方 Adapter 时，建议只将其中一个 Adapter 设为 `normal`，另一个保留 `binding`，避免同一玩法命令被两个机器人重复处理。

## 开发

```bash
npm run build
npm test
```

## License

GPL-3.0-or-later

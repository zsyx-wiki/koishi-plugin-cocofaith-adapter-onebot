<div align="center">
  <h1>CoCoFaith Adapter OneBot</h1>

  <p><strong>CoCoFaith v3 的 OneBot 平台接入</strong></p>

  <p>
    <img alt="Koishi" src="https://img.shields.io/badge/Koishi-4.16%2B-60a5fa?style=flat-square">
    <img alt="Version" src="https://img.shields.io/badge/version-3.0.0--alpha.4-a78bfa?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/License-GPL--3.0-52b788?style=flat-square">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white">
  </p>
</div>

---

把 OneBot 消息交给 CoCoFaith Business，并发送玩法回复。

## 安装

```sh
npm install @mueo/koishi-plugin-cocofaith-core@alpha @mueo/koishi-plugin-cocofaith-business@alpha @mueo/koishi-plugin-cocofaith-adapter-onebot@alpha
```

启用 Koishi 数据库和 OneBot 机器人连接后，添加 Core、Business，
再添加 `@mueo/cocofaith-adapter-onebot`。

## 配置

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `mode` | `binding` | `binding` 仅处理私聊绑定；`normal` 处理群聊和私聊玩法 |
| `allowRegistration` | `false` | 正常模式下允许 OneBot 创建新 UID |
| `enableBroadcast` | `true` | 发送 Business 提供的全服广播 |

使用完整玩法时设为 `normal`。需要直接注册用户时再开启 `allowRegistration`。
同一群中同时接入两个机器人时，按实际需要配置接收范围，避免重复回复。

## 跨平台绑定

默认通过 QQ 官方机器人注册，再把 OneBot QQ 绑定到同一 UID：

1. OneBot 私聊发送 `椰子水 申请绑定`，取得 Token A。
2. 已注册用户在 QQ 官方机器人群聊发送 `椰子水 申请绑定 [TokenA]`。
3. Token B 会发往第一步的 OneBot 私聊。
4. 同一 OneBot QQ 私聊发送 `椰子水 确认绑定 [TokenB]`。

令牌默认有效 300 秒。已属于其他 UID 的 QQ 号不能合并绑定。
使用 `椰子水 用户信息` 查看当前身份。

版本记录见 [CHANGELOG.md](./CHANGELOG.md)。许可证：GPL-3.0-or-later。

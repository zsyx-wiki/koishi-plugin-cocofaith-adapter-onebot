<div align="center">
  <h1>CoCoFaith Adapter OneBot</h1>

  <p><strong>CoCoFaith v3 的 OneBot 平台接入</strong></p>

  <p>
    <img alt="Koishi" src="https://img.shields.io/badge/Koishi-4.16%2B-60a5fa?style=flat-square">
    <img alt="Version" src="https://img.shields.io/badge/version-3.0.0--rc.1-a78bfa?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/License-GPL--3.0-52b788?style=flat-square">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white">
  </p>
</div>

---

将 CoCoFaith 消息转换为 OneBot 平台适配器可用的格式，并把收到的命令交给 CoCoFaith。

需要先启用 `koishi-plugin-adapter-onebot`，由它负责机器人连接。插件配置界面会显示此依赖。

## 安装

```sh
npm install koishi-plugin-cocofaith@rc koishi-plugin-cocofaith-adapter-onebot@rc
```

启用 Koishi 数据库和 OneBot 机器人连接后，添加 `cocofaith`，
再添加 `cocofaith-adapter-onebot`。

启用时提供 `faithAdapter` 服务，CoCoFaith 据此检查是否已配置接入。QQ 与 OneBot 可以同时启用。
消息处理在 `faithCore`、`faithBusiness` 就绪后启动；兼容服务实现也可使用本 Adapter。

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

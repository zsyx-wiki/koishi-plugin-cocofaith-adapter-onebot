import { Schema } from "koishi";

export interface Config {
  mode: "binding" | "normal";
  allowRegistration: boolean;
  enableBroadcast: boolean;
}

export const Config: Schema<Config> = Schema.object({
  mode: Schema.union([
    Schema.const("binding").description("绑定模式（推荐）"),
    Schema.const("normal").description("正常模式"),
  ]).default("binding").description("绑定模式只在私聊处理“椰子水”命令，避免与 QQ 官方机器人重复回复；正常模式处理全部 Business 命令。"),
  allowRegistration: Schema.boolean().default(false).description("是否允许 OneBot 用户直接注册新 UID。仅正常模式生效；默认关闭，关闭时应通过 QQ 官方机器人注册后绑定。"),
  enableBroadcast: Schema.boolean().default(true).description("允许发送 Business 提供的全服广播。OneBot 不受 QQ 官方机器人的主动消息限制。"),
});

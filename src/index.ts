import { Context, Session } from "koishi";
import { Config as ConfigSchema, type Config as OneBotConfig } from "../config";
import { OneBotBroadcaster } from "./broadcast";
import { isBindingCommand, normalizeOneBotContent } from "./content";
import { onebotIdentity } from "./identity";
import { renderAndSendOneBot } from "./render";
import { COCOFAITH_ONEBOT_ADAPTER_VERSION } from "./version";
import type { BusinessResult, OneBotAdapterContext } from "./contracts";

export const name = "cocofaith-adapter-onebot";
export const inject = ["faithCore", "faithBusiness", "database"] as const;
export const Config = ConfigSchema;
export type Config = OneBotConfig;

export function apply(ctx: Context, config: Config) {
  const services = ctx as OneBotAdapterContext;
  assertDependencies(services);
  const logger = ctx.logger("cocofaith-adapter-onebot");
  const broadcaster = new OneBotBroadcaster(ctx);
  const mode = config.mode ?? "binding";
  let active = true;

  const send = (session: Session, result: BusinessResult) => renderAndSendOneBot(
    session,
    result,
    config.enableBroadcast ? (notice) => broadcaster.send(session, notice) : undefined,
  );

  ctx.on("dispose", () => {
    active = false;
    broadcaster.dispose();
  });

  ctx.middleware(async (session, next) => {
    if (session.platform !== "onebot") return next();
    if (mode === "binding" && !session.isDirect) return next();
    const content = normalizeOneBotContent(session);
    if (mode === "binding" && !isBindingCommand(content)) return next();
    if (!services.faithBusiness.acceptsCommand(content)) return next();

    const identity = onebotIdentity(session);
    if (!identity) return next();

    try {
      const response = await services.faithBusiness.dispatch({
        uid: await services.faithCore.adapter.resolve(identity),
        identity,
        scene: session.isDirect ? "private" : "group",
        content,
        channelId: session.channelId,
        roomKey: JSON.stringify(["onebot", session.selfId, session.channelId]),
        eventId: session.messageId,
        displayName: session.username,
        adapter: {
          name: "CoCoFaith Adapter OneBot",
          version: COCOFAITH_ONEBOT_ADAPTER_VERSION,
          allowRegistration: mode === "normal" && config.allowRegistration === true,
        },
        reply: (result) => active ? send(session, result) : Promise.resolve(),
      });
      if (!response.matched) return next();
      if ("error" in response) await session.send(response.error.message);
      else await send(session, response.result);
    } catch (error) {
      logger.error(`命令处理失败 scene=${session.isDirect ? "private" : "group"} message=${session.messageId || "unknown"}`, error);
      await session.send("命令处理失败，请稍后重试。");
    }
  });

  logger.info(`OneBot Adapter 已加载（${mode === "binding" ? "绑定模式：仅私聊绑定命令" : "正常模式：完整命令"}；OneBot 注册 ${mode === "normal" && config.allowRegistration ? "开启" : "关闭"}；全服广播 ${config.enableBroadcast ? "开启" : "关闭"}）`);
}

function assertDependencies(ctx: OneBotAdapterContext) {
  if (typeof ctx.faithCore?.adapter?.resolve !== "function") {
    throw new Error("CoCoFaith Adapter OneBot 需要已就绪的 faithCore 身份服务");
  }
  if (typeof ctx.faithBusiness?.dispatch !== "function") {
    throw new Error("CoCoFaith Adapter OneBot 需要已就绪的 faithBusiness 路由服务");
  }
  if (typeof ctx.faithBusiness?.acceptsCommand !== "function") {
    throw new Error("请同步更新 CoCoFaith Business，以提供命令快速筛选接口");
  }
}

export * from "./broadcast";
export type * from "./contracts";
export * from "./content";
export * from "./identity";
export * from "./render";
export * from "./version";

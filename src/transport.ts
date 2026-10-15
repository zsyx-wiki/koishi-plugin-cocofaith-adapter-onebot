import { assertFaithAdapterServices } from "cocofaith-sdk/adapter";
import type { Context, Middleware, Session } from "koishi";
import type { Config } from "../config";
import { isBindingCommand, normalizeOneBotContent } from "./content";
import type { OneBotAdapterContext } from "./contracts";
import { OneBotMessageSender } from "./messaging";
import { dispatchOneBotSession } from "./session";

export function applyOneBotTransport(ctx: Context, config: Config) {
  assertFaithAdapterServices(ctx, "CoCoFaith Adapter OneBot");
  const sender = new OneBotMessageSender(ctx, config);
  ctx.on("dispose", () => sender.dispose());
  ctx.middleware(createOneBotMiddleware(ctx as OneBotAdapterContext, config, sender));
  const mode = config.mode === "normal" ? "正常模式" : "绑定模式";
  const allowRegistration = config.mode === "normal" && config.allowRegistration;
  ctx
    .logger("cocofaith-adapter-onebot")
    .info(
      "OneBot Adapter 已加载（%s；注册 %s；全服广播 %s）",
      mode,
      allowRegistration ? "开启" : "关闭",
      config.enableBroadcast ? "开启" : "关闭",
    );
}

function commandContent(session: Session, config: Config): string | undefined {
  if (session.platform !== "onebot") return;
  if (config.mode !== "normal" && !session.isDirect) return;
  const content = normalizeOneBotContent(session);
  if (config.mode !== "normal" && !isBindingCommand(content)) return;
  return content;
}

function createOneBotMiddleware(
  ctx: OneBotAdapterContext,
  config: Config,
  sender: OneBotMessageSender,
): Middleware {
  const logger = ctx.logger("cocofaith-adapter-onebot");
  return async (session, next) => {
    const content = commandContent(session, config);
    if (content === undefined || !ctx.faithBusiness.acceptsCommand(content)) return next();

    try {
      const handled = await dispatchOneBotSession(ctx, session, content, config, sender);
      if (!handled) return next();
    } catch (error) {
      logger.error(
        `命令处理失败 scene=${session.isDirect ? "private" : "group"} message=${session.messageId || "unknown"}`,
        error,
      );
      await sender.sendText(session, "命令处理失败，请稍后重试。");
    }
  };
}

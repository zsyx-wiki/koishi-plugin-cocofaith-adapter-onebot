import type { Session } from "koishi";
import type { Config } from "../config";
import type { OneBotAdapterContext } from "./contracts";
import { onebotIdentity } from "./identity";
import type { OneBotMessageSender } from "./messaging";
import { COCOFAITH_ONEBOT_ADAPTER_VERSION } from "./version";

export async function dispatchOneBotSession(
  ctx: OneBotAdapterContext,
  session: Session,
  content: string,
  config: Config,
  sender: OneBotMessageSender,
): Promise<boolean> {
  const identity = onebotIdentity(session);
  if (!identity) return false;

  const response = await ctx.faithBusiness.dispatch({
    uid: await ctx.faithCore.adapter.resolve(identity),
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
      allowRegistration: config.mode === "normal" && config.allowRegistration === true,
    },
    reply: (result) => sender.sendResult(session, result),
  });

  if (!response.matched) return false;
  if ("error" in response) await sender.sendText(session, response.error.message);
  else await sender.sendResult(session, response.result);
  return true;
}

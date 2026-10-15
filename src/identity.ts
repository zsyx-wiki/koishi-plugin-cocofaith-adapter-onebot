import type { Context, Session } from "koishi";
import type { OneBotAdapterContext } from "./contracts";

export function onebotIdentity(session: Session) {
  if (session.platform !== "onebot" || !session.userId) return null;
  return {
    adapter: "onebot" as const,
    type: "qq_account" as const,
    value: session.userId,
    scope: "global" as const,
  };
}

export async function resolveOneBotUid(ctx: Context, session: Session) {
  const identity = onebotIdentity(session);
  return identity ? (ctx as OneBotAdapterContext).faithCore.adapter.resolve(identity) : null;
}

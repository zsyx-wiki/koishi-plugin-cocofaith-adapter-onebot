import type { Context, Session } from "koishi";
import type { Config } from "../config";
import { OneBotBroadcaster } from "./broadcast";
import type { BusinessResult } from "./contracts";
import { renderAndSendOneBot } from "./render";

export class OneBotMessageSender {
  private readonly broadcaster: OneBotBroadcaster;
  private active = true;

  constructor(
    ctx: Context,
    private readonly config: Config,
  ) {
    this.broadcaster = new OneBotBroadcaster(ctx);
  }

  sendResult(session: Session, result: BusinessResult): Promise<unknown> {
    if (!this.active) return Promise.resolve();
    const broadcast = this.config.enableBroadcast
      ? (notice: NonNullable<BusinessResult["broadcast"]>) => this.broadcaster.send(session, notice)
      : undefined;
    return renderAndSendOneBot(session, result, broadcast, () => this.active);
  }

  sendText(session: Session, content: string): Promise<unknown> {
    if (!this.active) return Promise.resolve();
    return session.send(content);
  }

  dispose() {
    this.active = false;
    this.broadcaster.dispose();
  }
}

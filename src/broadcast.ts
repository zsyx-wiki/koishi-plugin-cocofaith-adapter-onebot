import { h, type Context, type Session } from "koishi";
import type { BusinessResult } from "./contracts";

type BroadcastNotice = NonNullable<BusinessResult["broadcast"]>;

export class OneBotBroadcaster {
  private readonly seen = new Set<string>();
  private queue: Promise<void> = Promise.resolve();
  private active = true;

  constructor(private readonly ctx: Context) {}

  dispose() {
    this.active = false;
    this.seen.clear();
  }

  send(session: Session, notice: BroadcastNotice) {
    if (!this.active || this.seen.has(notice.id)) return;
    this.seen.add(notice.id);
    if (this.seen.size > 1000) this.seen.delete(this.seen.values().next().value!);

    this.queue = this.queue.then(async () => {
      if (!this.active) return;
      const botIds = this.ctx.bots
        .filter((bot) => bot.platform === "onebot")
        .map((bot) => bot.selfId);
      if (!botIds.length) return;

      const channels = await this.ctx.database.getAssignedChannels(
        ["id", "flag", "platform"],
        { onebot: botIds },
      );
      const targets = [...new Set(channels
        .filter((channel) => channel.platform === "onebot"
          && !(channel.flag & 4)
          && (session.isDirect || channel.id !== session.channelId))
        .map((channel) => `onebot:${channel.id}`))];
      if (targets.length && this.active) await this.ctx.broadcast(targets, h.text(notice.content));
    }).catch((error: unknown) => {
      this.ctx.logger("cocofaith-adapter-onebot").warn("全服公告发送失败", error);
    });
  }
}

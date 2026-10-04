import { h, type Session } from "koishi";
import type { BusinessResult, MessageNode } from "./contracts";

export async function renderAndSendOneBot(
  session: Session,
  result: BusinessResult,
  broadcast?: (notice: NonNullable<BusinessResult["broadcast"]>) => void,
) {
  if (result.broadcast) broadcast?.(result.broadcast);
  if (result.type === "silent") return;
  if (result.type === "text") return session.send(result.content);
  if (result.type === "image") return sendImage(session, result.url, result.fallback);
  return session.send(result.content.map(renderNode));
}

function renderNode(node: MessageNode) {
  return node.type === "text" ? h.text(node.content) : h.image(node.url);
}

async function sendImage(session: Session, url: string, fallback?: string) {
  try {
    return await session.send(h.image(url));
  } catch (error) {
    if (fallback) return session.send(fallback);
    throw error;
  }
}

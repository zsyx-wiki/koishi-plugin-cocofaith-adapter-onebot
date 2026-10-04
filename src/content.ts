import type { Session } from "koishi";

export function normalizeOneBotContent(session: Session) {
  return (session.stripped?.content || session.content || "")
    .trim()
    .replace(/^[/／]+\s*/, "");
}

export function isBindingCommand(content: string) {
  return /^椰子水\s+(?:申请绑定|确认绑定)(?:\s|$)/.test(content.trimStart().replace(/^[/／]+\s*/, ""));
}

export function isCoconutWaterCommand(content: string) {
  return /^椰子水(?:\s|$)/.test(content.trimStart().replace(/^[/／]+\s*/, ""));
}

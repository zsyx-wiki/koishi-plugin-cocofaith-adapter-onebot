import { provideFaithAdapter } from "cocofaith-sdk/adapter";
import { Context } from "koishi";
import { Config as ConfigSchema, type Config as OneBotConfig } from "../config";
import { applyOneBotTransport } from "./transport";
import { COCOFAITH_ONEBOT_ADAPTER_VERSION } from "./version";

export const name = "cocofaith-adapter-onebot";
export const inject = [] as const;
export const Config = ConfigSchema;
export type Config = OneBotConfig;

export function apply(ctx: Context, config: Config) {
  provideFaithAdapter(ctx, {
    id: name,
    name: "CoCoFaith Adapter OneBot",
    platform: "onebot",
    version: COCOFAITH_ONEBOT_ADAPTER_VERSION,
    mode: config.mode ?? "binding",
  });
  ctx.inject(["faithCore", "faithBusiness", "database"], (ctx) =>
    applyOneBotTransport(ctx, config),
  );
}

export * from "./broadcast";
export * from "./content";
export type * from "./contracts";
export * from "./identity";
export * from "./render";
export * from "./version";
export * from "./messaging";
export * from "./session";

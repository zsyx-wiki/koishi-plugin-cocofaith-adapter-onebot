import type { FaithCoreServiceContract } from "cocofaith-sdk/core";
import type { GameplayImageNode,GameplayResult,GameplayTextNode } from "cocofaith-sdk/gameplay";
import type { FaithBusinessAdapterContract } from "cocofaith-sdk/protocol";
import type { Context } from "koishi";

export type { IdentityInput } from "cocofaith-sdk/core";
export type MessageTextNode = GameplayTextNode;
export type MessageImageNode = GameplayImageNode;
export type MessageNode = GameplayTextNode | GameplayImageNode;
export type BusinessResult = GameplayResult;

export type { BusinessDispatchResult } from "cocofaith-sdk/protocol";

export type OneBotAdapterContext = Context & {
  faithCore: Pick<FaithCoreServiceContract, "adapter">;
  faithBusiness: FaithBusinessAdapterContract;
};

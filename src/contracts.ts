import type { FaithCoreServiceContract } from "@mueo/cocofaith-sdk/core";
import type { GameplayImageNode,GameplayResult,GameplayTextNode } from "@mueo/cocofaith-sdk/gameplay";
import type { FaithBusinessAdapterContract } from "@mueo/cocofaith-sdk/protocol";
import type { Context } from "koishi";

export type { IdentityInput } from "@mueo/cocofaith-sdk/core";
export type MessageTextNode = GameplayTextNode;
export type MessageImageNode = GameplayImageNode;
export type MessageNode = GameplayTextNode | GameplayImageNode;
export type BusinessResult = GameplayResult;

export type { BusinessDispatchResult } from "@mueo/cocofaith-sdk/protocol";

export type OneBotAdapterContext = Context & {
  faithCore: Pick<FaithCoreServiceContract, "adapter">;
  faithBusiness: FaithBusinessAdapterContract;
};

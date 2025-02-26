import { ResourceType, ResourceModificationOptions } from "@app/types";

export interface IResourceManager {
  modifyResource(
    resource: ResourceType,
    value: number | string,
    options?: ResourceModificationOptions
  ): void;
}

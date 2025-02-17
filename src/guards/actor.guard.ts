import { StatSchema } from "@app/interfaces/schema/template/actor/partial/stat.schema";
import { ResourceSchema } from "@app/interfaces/schema/template/actor/partial/resource.schema";

export const isValidStat = (stat: unknown): stat is StatSchema => {
  return (
    typeof stat === "object" &&
    stat !== null &&
    "value" in stat &&
    "mod" in stat &&
    typeof stat.value === "number" &&
    typeof stat.mod === "number"
  );
};

export const isValidResource = (resource: unknown): resource is ResourceSchema => {
  return (
    typeof resource === "object" &&
    resource !== null &&
    "value" in resource &&
    "temp" in resource &&
    "max" in resource &&
    "min" in resource &&
    typeof resource.value === "number" &&
    typeof resource.temp === "number" &&
    typeof resource.max === "number" &&
    typeof resource.min === "number"
  );
};

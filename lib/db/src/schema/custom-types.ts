import { customType } from "drizzle-orm/pg-core";

export const vector = customType<{ data: number[]; driverData: string; config: { dimensions: number } }>({
  dataType(config) {
    return `vector(${config?.dimensions || 384})`;
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string | number[]): number[] {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    }
    return value;
  },
});

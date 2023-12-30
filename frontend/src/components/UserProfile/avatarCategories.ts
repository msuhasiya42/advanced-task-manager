import { adventurer, avataaars, lorelei, micah, miniavs, personas } from "@dicebear/collection";
import { Style, createAvatar } from "@dicebear/core";
import { Options } from "redaxios";
import { v4 } from "uuid";

export const avatarStyles = [
    "lorelei",
    "adventurer",
    "avataaars",
    //   "icons", // icons can be used for task
    "micah",
    "miniavs",
    "personas",
];


export function getCategory(category: string): Style<Options> {
    switch (category) {
      case "adventurer":
        return adventurer as Style<Options>; // Explicit cast
      case "avataaars":
        return avataaars as Style<Options>;
      case "lorelei":
        return lorelei as Style<Options>;
      case "micah":
        return micah as Style<Options>;
      case "miniavs":
        return miniavs as Style<Options>;
      case "personas":
        return personas as Style<Options>;
      default:
        return lorelei as Style<Options>;
    }
  }

  export const getAvatar = (category: Style<Options>): string => {
    const avatar = createAvatar(category, {
      seed: v4(),
      // ... other options
    });
    const svg = avatar.toString();
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };
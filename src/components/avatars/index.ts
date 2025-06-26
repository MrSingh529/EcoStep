import { ForestAvatar } from "./forest-avatar";
import { MountainAvatar } from "./mountain-avatar";
import { RiverAvatar } from "./river-avatar";
import { SproutAvatar } from "./sprout-avatar";
import { SunAvatar } from "./sun-avatar";

export const avatars: { [key: string]: { component: React.FC<any>; label: string } } = {
  sprout: { component: SproutAvatar, label: "The Sprout" },
  mountain: { component: MountainAvatar, label: "The Mountain" },
  river: { component: RiverAvatar, label: "The River" },
  sun: { component: SunAvatar, label: "The Sun" },
  forest: { component: ForestAvatar, label: "The Forest" },
};
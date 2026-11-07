import type { NPC } from "@/types";

export const NPCS: Record<string, NPC> = {
  elder_maren: {
    id: "elder_maren",
    name: "Elder Maren",
    description: "An old woman leaning on a staff, watching the square like it might change.",
    dialogue: [
      {
        id: "greeting",
        topic: "greeting",
        synonyms: ["hello", "hi", "greetings"],
        text:
          '"You\'re new." She studies you a moment too long. "Or new here, at least. ' +
          "Ask me about the well, if you're curious. Everyone eventually is.\"",
      },
      {
        id: "well",
        topic: "well",
        text:
          '"Older than the village. Older than the forest, some say. My grandmother ' +
          "wouldn't let us draw water after dark. I never asked why. I'm starting to " +
          'wish I had."',
        startsQuestId: "quest_the_old_well",
      },
      {
        id: "map",
        topic: "map",
        synonyms: ["paper", "cartography"],
        text:
          '"A blank paper won\'t draw itself. Old Tomas in the tavern used to be a ' +
          'surveyor, before. He might still have his tools, if the drink hasn\'t taken ' +
          'them from him."',
      },
    ],
    questGiverFor: ["quest_the_old_well"],
  },
  smith_orla: {
    id: "smith_orla",
    name: "Orla the Smith",
    description: "Broad-shouldered, soot-streaked, entirely unbothered by the heat.",
    dialogue: [
      {
        id: "greeting",
        topic: "greeting",
        synonyms: ["hello", "hi"],
        text: '"Need something sharpened, or something new? Either way, it\'ll cost you."',
      },
    ],
    shopInventory: [
      { itemId: "iron_sword", price: 25 },
      { itemId: "chainmail", price: 60 },
      { itemId: "wooden_shield", price: 12 },
    ],
  },
  old_tomas: {
    id: "old_tomas",
    name: "Old Tomas",
    description: "Slumped in the corner booth, nursing a drink he's had for an hour.",
    dialogue: [
      {
        id: "greeting",
        topic: "greeting",
        synonyms: ["hello", "hi"],
        text: '"Another one heading south, eh? They all do, eventually."',
      },
      {
        id: "map",
        topic: "map",
        synonyms: ["paper", "cartography", "surveying"],
        text:
          '"I used to draw the county lines, before the roads went bad. You find some ' +
          "old paper and something to write with, and the knowledge comes back to " +
          'you fast enough. Funny how that works."',
        setsFlag: "learned_map_lore",
      },
    ],
  },
  market_agnes: {
    id: "market_agnes",
    name: "Agnes",
    description: "An old woman selling rope, rations, and gear from a cart with a missing wheel.",
    dialogue: [
      {
        id: "greeting",
        topic: "greeting",
        synonyms: ["hello", "hi"],
        text: '"Rope, rations, a decent torch. Everything a person needs to not die out there. Buying, or just looking?"',
      },
      {
        id: "castle",
        topic: "castle",
        synonyms: ["towers", "ruins"],
        text:
          '"My grandmother\'s grandmother used to say there was a kingdom out past ' +
          "the forest, before it wasn't. Nobody's gone looking in my lifetime. " +
          'Can\'t imagine why you would either."',
      },
    ],
    shopInventory: [
      { itemId: "torch", price: 3 },
      { itemId: "ration", price: 2 },
      { itemId: "minor_healing_potion", price: 10 },
      { itemId: "lantern", price: 40 },
    ],
  },
};

export function getNpc(id: string): NPC | undefined {
  return NPCS[id];
}

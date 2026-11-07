import type { Quest } from "@/types";

export const QUESTS: Record<string, Quest> = {
  quest_the_old_well: {
    id: "quest_the_old_well",
    title: "What Sleeps in the Well",
    description:
      "Elder Maren fears something old lives beneath the village well. Find out what.",
    isMain: true,
    giverNpcId: "elder_maren",
    stages: [
      {
        id: "descend",
        description: "Climb down the well shaft.",
        completeWhenFlag: "entered_well_shaft",
      },
      {
        id: "find_sewers",
        description: "Follow the water to wherever it leads.",
        completeWhenFlag: "entered_sewers_entrance",
      },
      {
        id: "reach_gate",
        description: "Find the source: something ancient beneath the sewers.",
        completeWhenFlag: "entered_underground_city_gate",
      },
    ],
    rewardXp: 150,
    rewardGold: 50,
    rewardItemIds: ["lantern"],
  },
  quest_crypt_seal: {
    id: "quest_crypt_seal",
    title: "The Crest of a Forgotten House",
    description:
      "A sealed letter in a long-undisturbed crypt bears a crest no one living recognizes.",
    isMain: false,
    autoStart: true,
    stages: [
      {
        id: "find_seal",
        description: "Open the sarcophagus in the Forgotten Crypt.",
        completeWhenFlag: "opened_forgotten_sarcophagus",
      },
    ],
    rewardXp: 80,
    rewardItemIds: ["rune_of_warding"],
  },
  quest_bandit_menace: {
    id: "quest_bandit_menace",
    title: "The Bandits at the Crossing",
    description:
      "A bandit camp has set up past the river crossing, close enough to the village to worry about.",
    isMain: false,
    autoStart: true,
    stages: [
      {
        id: "clear_camp",
        description: "Deal with the bandit leader at the camp south of the river crossing.",
        completeWhenFlag: "defeated_goblin_warband_leader_at_bandit_camp",
      },
    ],
    rewardXp: 60,
    rewardGold: 30,
  },
  quest_frost_giant: {
    id: "quest_frost_giant",
    title: "Thaw of the Frost Giant",
    description: "Something enormous has made a lair in the ice caves beyond the waystones.",
    isMain: false,
    autoStart: true,
    stages: [
      {
        id: "defeat_giant",
        description: "Defeat the frost giant in its lair.",
        completeWhenFlag: "defeated_frost_giant_at_frost_giant_lair",
      },
    ],
    rewardXp: 250,
    rewardGold: 60,
    rewardItemIds: ["rune_of_warding"],
  },
  quest_dragon_hoard: {
    id: "quest_dragon_hoard",
    title: "The Dragon's Hoard",
    description:
      "Old stories always mention a dragon eventually. Yours is asleep on a hoard in the volcano.",
    isMain: false,
    autoStart: true,
    stages: [
      {
        id: "defeat_dragon",
        description: "Defeat the young red dragon in its lair, if you dare.",
        completeWhenFlag: "defeated_young_red_dragon_at_dragons_lair",
      },
    ],
    rewardXp: 500,
    rewardGold: 150,
  },
  quest_sandworm_hunt: {
    id: "quest_sandworm_hunt",
    title: "What Moves the Dunes",
    description: "Something enormous lives beneath the shifting dunes of the desert.",
    isMain: false,
    autoStart: true,
    stages: [
      {
        id: "defeat_worm",
        description: "Defeat the sandworm in its den.",
        completeWhenFlag: "defeated_sandworm_at_sandworm_den",
      },
    ],
    rewardXp: 300,
    rewardGold: 80,
  },
  quest_castle_intruder: {
    id: "quest_castle_intruder",
    title: "The Thing on the Throne",
    description:
      "Whatever sits on the old castle's throne now, it isn't the royal family the chapel remembers.",
    isMain: false,
    autoStart: true,
    stages: [
      {
        id: "clear_throne_room",
        description: "Deal with whatever has claimed the castle throne room.",
        completeWhenFlag: "defeated_young_werewolf_at_castle_throne_room",
      },
    ],
    rewardXp: 180,
    rewardItemIds: ["chainmail"],
  },
  quest_waystone_network: {
    id: "quest_waystone_network",
    title: "The Old Kingdom's Roads",
    description:
      "The Hall of Waystones holds five runed stones. Activating all five reveals the full reach of the old kingdom's road network.",
    isMain: false,
    autoStart: true,
    stages: [
      {
        id: "activate_all",
        description: "Read all five waystones (ice, fire, sand, peak, marsh).",
        completeWhenFlag: "all_waystones_activated",
      },
    ],
    rewardXp: 200,
    rewardItemIds: ["enchanted_compass"],
  },
  quest_lich_king: {
    id: "quest_lich_king",
    title: "The Unbound King",
    description:
      "At the heart of the ancient temple, the kingdom's last king still guards his own crown.",
    isMain: false,
    autoStart: true,
    stages: [
      {
        id: "defeat_lich_king",
        description: "Defeat the Lich King at the Altar of the Unbound King.",
        completeWhenFlag: "defeated_ancient_lich_king_at_altar_room",
      },
    ],
    rewardXp: 1000,
    rewardGold: 300,
  },
};

export function getQuest(id: string): Quest | undefined {
  return QUESTS[id];
}

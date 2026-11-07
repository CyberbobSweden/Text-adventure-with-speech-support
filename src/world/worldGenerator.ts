import type { Location, Region } from "@/types";

/**
 * Deterministic, seedable filler-room generator. This is the mechanism
 * that lets the world grow past the hand-authored slice in
 * `locations/index.ts` toward the design doc's 1000+ location ambition,
 * without ever hand-typing a thousand rooms.
 *
 * The generator never invents landmarks, bosses, or quest content — it
 * only produces connective tissue (corridors, cells, thickets) between
 * hand-authored anchor rooms, using per-region vocabulary pools so the
 * results still read as intentional. Swap the pools out (or feed them
 * from an LLM at runtime, per the design doc's "Future AI Features"
 * idea) without touching the engine.
 */

interface RegionVocabulary {
  nouns: string[];
  adjectives: string[];
  ambient: string[];
  isDark: boolean;
}

const REGION_VOCAB: Partial<Record<Region, RegionVocabulary>> = {
  mine: {
    nouns: ["Shaft", "Gallery", "Chute", "Vein", "Crossing"],
    adjectives: ["Collapsed", "Flooded", "Timbered", "Narrow", "Abandoned"],
    ambient: ["dripping water", "settling timber", "distant pickaxe echoes"],
    isDark: true,
  },
  sewers: {
    nouns: ["Culvert", "Junction", "Cistern", "Drain", "Passage"],
    adjectives: ["Brick-lined", "Flooded", "Cracked", "Silted", "Rusted"],
    ambient: ["slow-moving water", "distant dripping", "scuttling in the dark"],
    isDark: true,
  },
  crypt: {
    nouns: ["Alcove", "Chamber", "Vault", "Niche", "Hall"],
    adjectives: ["Sealed", "Cracked", "Frost-rimed", "Forgotten", "Silent"],
    ambient: ["utter silence", "a distant, wrong sound", "cold air moving"],
    isDark: true,
  },
  ice_caves: {
    nouns: ["Passage", "Cavern", "Shelf", "Crevasse", "Hollow"],
    adjectives: ["Frozen", "Glittering", "Frost-choked", "Blue-lit", "Silent"],
    ambient: ["cracking ice", "wind funneling through stone", "silence"],
    isDark: false,
  },
  desert: {
    nouns: ["Dune", "Ridge", "Wash", "Outcrop", "Basin"],
    adjectives: ["Sun-bleached", "Wind-carved", "Sunken", "Cracked", "Endless"],
    ambient: ["wind over sand", "distant heat shimmer", "silence"],
    isDark: false,
  },
  swamp: {
    nouns: ["Mire", "Thicket", "Bog", "Channel", "Hollow"],
    adjectives: ["Sunken", "Fetid", "Root-choked", "Misted", "Waterlogged"],
    ambient: ["croaking", "buzzing insects", "sucking mud"],
    isDark: false,
  },
};

/** Small seeded PRNG so generated worlds are reproducible from a save seed. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return h;
}

/**
 * Generates `count` linearly-chained filler rooms in `region`, starting
 * adjacent to `anchorLocationId`. Returns the new locations plus the exit
 * that should be added to the anchor to connect it to the chain.
 */
export function generateFillerChain(
  region: Region,
  anchorLocationId: string,
  count: number,
  seed: string
): { locations: Location[]; firstId: string } {
  const vocab = REGION_VOCAB[region];
  if (!vocab) {
    throw new Error(`No generator vocabulary registered for region "${region}"`);
  }
  const rand = mulberry32(hashSeed(`${seed}:${anchorLocationId}:${region}`));
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  const locations: Location[] = [];
  let previousId = anchorLocationId;

  for (let i = 0; i < count; i++) {
    const id = `${anchorLocationId}_gen_${i}`;
    const noun = pick(vocab.nouns);
    const adj = pick(vocab.adjectives);
    const isLast = i === count - 1;

    locations.push({
      id,
      name: `${adj} ${noun}`,
      region,
      shortDescription: `A ${adj.toLowerCase()} ${noun.toLowerCase()}, much like the last.`,
      longDescription:
        `Another ${adj.toLowerCase()} ${noun.toLowerCase()} extends ahead, indistinguishable ` +
        `from the last except for the particular quality of the dark.`,
      exits: [
        { direction: "west", to: previousId },
        ...(isLast ? [] : [{ direction: "east" as const, to: `${anchorLocationId}_gen_${i + 1}` }]),
      ],
      ambientSounds: [pick(vocab.ambient)],
      isDark: vocab.isDark,
      tags: [region, "generated"],
    });

    previousId = id;
  }

  return { locations, firstId: locations[0]?.id };
}

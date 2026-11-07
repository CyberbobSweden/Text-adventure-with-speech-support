import type { Location } from "@/types";

export const DESERT_LOCATIONS: Location[] = [
  {
    id: "desert_entrance",
    name: "Dune's Edge",
    region: "desert",
    shortDescription: "Dry wind, and light so bright it hurts after the dark.",
    longDescription:
      "The waystone opens onto open sky for the first time in a long while — dunes " +
      "roll out in every direction, pale gold under a sun that feels wrong to see " +
      "again after so long underground.",
    exits: [
      { direction: "west", to: "hall_of_waystones" },
      { direction: "east", to: "shifting_dunes" },
    ],
    tags: ["desert", "frontier"],
    mapPosition: { x: 0, y: 0, z: -12 },
  },
  {
    id: "shifting_dunes",
    name: "Shifting Dunes",
    region: "desert",
    shortDescription: "Dunes that don't look quite the same twice.",
    longDescription:
      "Wind moves the sand constantly, erasing your footprints almost as soon as " +
      "you make them. Twice now you've felt the ground shift underfoot in a way " +
      "the wind doesn't explain.",
    exits: [
      { direction: "west", to: "desert_entrance" },
      { direction: "north", to: "buried_oasis" },
      { direction: "east", to: "sandworm_den" },
      { direction: "south", to: "salt_flats" },
    ],
    isDark: false,
    tags: ["desert", "frontier"],
    mapPosition: { x: 1, y: 0, z: -12 },
  },
  {
    id: "salt_flats",
    name: "Salt Flats",
    region: "desert",
    shortDescription: "White salt crust, cracked into a million hexagons.",
    longDescription:
      "The ground here is dry salt, cracked into a pattern too regular to be " +
      "accidental. Heat shimmers rise off the white crust even where nothing " +
      "should be burning.",
    exits: [{ direction: "north", to: "shifting_dunes" }],
    itemIds: ["gold_coin_pile"],
    tags: ["desert", "frontier", "landmark"],
    mapPosition: { x: 1, y: -1, z: -12 },
  },
  {
    id: "buried_oasis",
    name: "Buried Oasis",
    region: "desert",
    shortDescription: "A ring of dead palms around a pool half-full of sand.",
    longDescription:
      "This was an oasis once. Half the pool is silted over now, but the other " +
      "half still holds clear water, and something about the stillness of it feels " +
      "deliberate rather than abandoned.",
    exits: [{ direction: "south", to: "shifting_dunes" }],
    itemIds: ["ration", "silver_ring"],
    isSafe: true,
    tags: ["desert", "frontier", "landmark"],
    mapPosition: { x: 1, y: 1, z: -12 },
  },
  {
    id: "sandworm_den",
    name: "Sandworm Den",
    region: "desert",
    shortDescription: "A crater of churned sand, ringed with old bone.",
    longDescription:
      "The sand here has been disturbed so many times it's compacted into a bowl. " +
      "Bones — some old, some not — are scattered around the rim like the crater " +
      "was built on purpose, which, in a way, it was.",
    exits: [{ direction: "west", to: "shifting_dunes" }],
    itemIds: ["rune_of_warding"],
    monsterIds: ["sandworm"],
    tags: ["desert", "frontier", "boss"],
    mapPosition: { x: 2, y: 0, z: -12 },
  },
];

# World Map — reference (out-of-game)

A complete, spoiler-showing map of everything currently built, for your own
reference. It is **not** shown to the player in-game — the in-game `map`
command only reveals what the player has actually explored (fog of war),
and requires finding `Old Paper` + `Rusty Pencil` first (Village Square,
then the tavern).

**Current size: 100 hand-authored locations across 16 regions.** Every
single one has been verified two ways: (1) an automated check that every
exit resolves to a real location, no ids collide, no map coordinates
overlap, and all 100 rooms are reachable from the start via BFS; (2) an
actual scripted playthrough of the engine — walking the surface route,
both underground shortcuts, the waystone network, and the final boss
encounter — to confirm the story chain plays the way it reads below.

---

## The shape of the world

```
                         VILLAGE (surface, 12 rooms)
                               |
                          FOREST (8) — DARK FOREST (4)
                               |
                    RUINS (4) ---- CASTLE (9)
                               |         |
                    MINE/CAVES (7)       | (secret stair)
                               |         |
                         DUNGEON (6) <---'
                               |
                          CRYPT (8) <---- CATACOMBS (village graveyard shortcut)
                               |
                         SEWERS (4)
                               |
                    UNDERGROUND CITY (8)
                          /    |    \
              ANCIENT TEMPLE   |   HALL OF WAYSTONES
                 (6, final          |
                  boss)         +---+---+---+---+
                                 |   |   |   |   |
                                ICE VOLC DES MTN SWAMP
                               (5)  (5) (5) (5)  (4)
```

## The story, in one paragraph

Elder Maren fears something in the village well ("What Sleeps in the
Well"). Following the water down leads through the sewers to the **Gate
of the Sunken City** — the surface of an entire buried kingdom. Explore
it far enough (past the Archive Hall) and you reach the **Ancient
Temple**, ending at the **Lich King** — the kingdom's last ruler, still
guarding his crown centuries later. Separately, the same buried city
holds the **Hall of Waystones**, a working piece of that kingdom's own
magic: five runed stones that open travel to the far corners of the
world (ice caves, volcano, desert, mountains, swamp) — the "powerful
artifact" that ties the frontier regions into the main story rather than
leaving them as disconnected bonus areas.

The **Castle** (reached via the forest → dark forest → ruins causeway) is
the same royal house's above-ground seat — the chapel and library both
contain lore confirming this, and a **hidden stair behind the throne**
drops directly into the Dungeon region's Guard Room, a physical shortcut
between the two halves of the story. Likewise, a disturbed grave in the
**Village Graveyard** opens straight into the Catacombs, connecting the
crypt directly back to the village without going through the caves.

## Key mechanics reference

| What | Where | How |
|---|---|---|
| Unlock `map` | Village Square | `take paper` (it's caught by the well) |
| Unlock `journal` | The tavern | `take pencil` (on Old Tomas's table) |
| Well shaft (main quest start) | Old Well | `search rope` reveals `down` |
| Dark forest hidden path | Dark Forest Edge | `search carved root` reveals `south` |
| Cave → crypt shortcut | Underground Lake | `climb ladder` reveals `up`, one-way into the crypt |
| Village → crypt shortcut | Graveyard | `search disturbed grave` reveals `down` |
| Castle → dungeon shortcut | Castle Throne Room | `search throne` reveals `down` |
| Dungeon Armory (locked) | Guard Room | needs `Rusty Key`, found in the Cell Block |
| The 5 frontier regions | Hall of Waystones | `read ice/fire/sand/peak/marsh waystone` |
| Endgame artifact | Altar of the Unbound King | defeat the Lich King (level 30 — this is deliberately the hardest fight in the game; it will not go well for a low-level character, by design) |

## Full location table

<!-- Generated directly from the location data, not hand-maintained —
     if this ever looks out of sync with the game, the game is right. -->

### village (12)

| Location | Exits |
|---|---|
| Village Square (`village_square`) | N old_well · E blacksmith · W tavern · S village_gate |
| Old Well (`old_well`) | S village_square · N chapel · D well_shaft (hidden) |
| Blacksmith's Forge (`blacksmith`) | W village_square · E market_stalls |
| The Broken Wheel Tavern (`tavern`) | E village_square · W stables |
| Village Gate (`village_gate`) | N village_square · S forest_path · U watchtower |
| Well Shaft (`well_shaft`) | U old_well · D sewers_entrance |
| Millbrook Chapel (`chapel`) | S old_well |
| Market Stalls (`market_stalls`) | W blacksmith · E millers_house |
| Miller's House (`millers_house`) | W market_stalls |
| Stables (`stables`) | E tavern · S graveyard |
| Millbrook Graveyard (`graveyard`) | N stables · D catacombs_entrance (hidden) |
| Village Watchtower (`watchtower`) | D village_gate |

### forest (8)

| Location | Exits |
|---|---|
| Forest Path (`forest_path`) | N village_gate · S forest_clearing · E hunters_camp · W river_crossing |
| Hunter's Camp (`hunters_camp`) | W forest_path |
| Forest Clearing (`forest_clearing`) | N forest_path · S dark_forest_edge · E cave_mouth · W ancient_grove |
| River Crossing (`river_crossing`) | E forest_path · S bandit_camp · W old_bridge |
| Old Stone Bridge (`old_bridge`) | E river_crossing |
| Bandit Camp (`bandit_camp`) | N river_crossing |
| Ancient Grove (`ancient_grove`) | E forest_clearing |
| Cave Mouth (`cave_mouth`) | W forest_clearing · I cave_tunnel |

### dark_forest (4)

| Location | Exits |
|---|---|
| Dark Forest Edge (`dark_forest_edge`) | N forest_clearing · S ruined_shrine (hidden) · W twisted_hollow |
| Twisted Hollow (`twisted_hollow`) | E dark_forest_edge · S witchlight_bog |
| Witchlight Bog (`witchlight_bog`) | N twisted_hollow · S hollow_altar |
| Hollow Altar (`hollow_altar`) | N witchlight_bog |

### mine (7)

| Location | Exits |
|---|---|
| Cave Tunnel (`cave_tunnel`) | O cave_mouth · E underground_lake · D dungeon_entrance · S mine_shaft |
| Underground Lake (`underground_lake`) | W cave_tunnel · U lake_ledge (hidden) |
| Lake Ledge (`lake_ledge`) | D underground_lake · E ossuary (one-way) |
| Old Mine Shaft (`mine_shaft`) | N cave_tunnel · S crystal_vein · E collapsed_shaft |
| Crystal Vein (`crystal_vein`) | N mine_shaft · S flooded_gallery |
| Flooded Gallery (`flooded_gallery`) | N crystal_vein |
| Collapsed Shaft (`collapsed_shaft`) | W mine_shaft |

### dungeon (6)

| Location | Exits |
|---|---|
| Dungeon Entrance (`dungeon_entrance`) | U cave_tunnel · D crypt_corridor · E guard_room |
| Guard Room (`guard_room`) | W dungeon_entrance · E cell_block · N armory (locked) · U castle_dungeon_stair |
| Dungeon Armory (`armory`) | S guard_room |
| Cell Block (`cell_block`) | W guard_room · D treasure_vault · S torture_chamber |
| Dungeon Treasure Vault (`treasure_vault`) | U cell_block |
| Torture Chamber (`torture_chamber`) | N cell_block |

### crypt (8)

| Location | Exits |
|---|---|
| Crypt Corridor (`crypt_corridor`) | U dungeon_entrance · E ossuary · W forgotten_crypt · N catacombs_entrance |
| Ossuary (`ossuary`) | W crypt_corridor · E bone_chapel |
| Bone Chapel (`bone_chapel`) | W ossuary |
| Forgotten Crypt (`forgotten_crypt`) | E crypt_corridor |
| Catacombs Entrance (`catacombs_entrance`) | U graveyard · S crypt_corridor · E catacombs_gallery |
| Catacombs Gallery (`catacombs_gallery`) | W catacombs_entrance · S hidden_reliquary (hidden) |
| Hidden Reliquary (`hidden_reliquary`) | N catacombs_gallery · D sealed_vault |
| Sealed Vault (`sealed_vault`) | U hidden_reliquary |

### sewers (4)

| Location | Exits |
|---|---|
| Sewer Entrance (`sewers_entrance`) | U well_shaft · S sewer_junction |
| Sewer Junction (`sewer_junction`) | N sewers_entrance · E rat_nest · S underground_city_gate |
| Flooded Nest (`rat_nest`) | W sewer_junction · S sunken_cistern |
| Sunken Cistern (`sunken_cistern`) | N rat_nest |

### underground_city (8)

| Location | Exits |
|---|---|
| Gate of the Sunken City (`underground_city_gate`) | N sewer_junction · S sunken_plaza |
| Sunken Plaza (`sunken_plaza`) | N underground_city_gate · E collapsed_market · W archive_hall · D throne_approach |
| Collapsed Market (`collapsed_market`) | W sunken_plaza |
| Archive Hall (`archive_hall`) | E sunken_plaza · D temple_antechamber · N scriptorium |
| Scriptorium (`scriptorium`) | S archive_hall |
| Approach to the Sunken Throne (`throne_approach`) | U sunken_plaza · S sunken_throne_room · D hall_of_waystones |
| Sunken Throne Room (`sunken_throne_room`) | N throne_approach |
| Hall of Waystones (`hall_of_waystones`) | U throne_approach · N ice_caves_entrance (hidden) · S volcano_entrance (hidden) · E desert_entrance (hidden) · W mountains_entrance (hidden) · D swamp_entrance (hidden) |

### ruins (4)

| Location | Exits |
|---|---|
| Ruined Shrine (`ruined_shrine`) | N dark_forest_edge · S old_causeway |
| Old Causeway (`old_causeway`) | N ruined_shrine · S collapsed_keep · E broken_aqueduct |
| Broken Aqueduct (`broken_aqueduct`) | W old_causeway |
| Collapsed Outer Keep (`collapsed_keep`) | N old_causeway · S castle_gatehouse |

### castle (9)

| Location | Exits |
|---|---|
| Castle Gatehouse (`castle_gatehouse`) | N collapsed_keep · S castle_courtyard |
| Castle Courtyard (`castle_courtyard`) | N castle_gatehouse · E armory_tower · W castle_chapel · S great_hall |
| Armory Tower (`armory_tower`) | W castle_courtyard · U battlements |
| Castle Battlements (`battlements`) | D armory_tower |
| Royal Chapel (`castle_chapel`) | E castle_courtyard |
| Great Hall (`great_hall`) | N castle_courtyard · E castle_library · S castle_throne_room |
| Castle Library (`castle_library`) | W great_hall |
| Castle Throne Room (`castle_throne_room`) | N great_hall · D castle_dungeon_stair (hidden) |
| Castle Dungeon Stair (`castle_dungeon_stair`) | U castle_throne_room · D guard_room |

### ancient_temple (6)

| Location | Exits |
|---|---|
| Temple Antechamber (`temple_antechamber`) | U archive_hall · S guardian_hall · E meditation_cloister |
| Meditation Cloister (`meditation_cloister`) | W temple_antechamber |
| Guardian Hall (`guardian_hall`) | N temple_antechamber · S inner_sanctum |
| Inner Sanctum (`inner_sanctum`) | N guardian_hall · E temple_treasury · S altar_room |
| Temple Treasury (`temple_treasury`) | W inner_sanctum |
| Altar of the Unbound King (`altar_room`) | N inner_sanctum |

### ice_caves (5) — frontier, via waystone

| Location | Exits |
|---|---|
| Ice Cave Mouth (`ice_caves_entrance`) | S hall_of_waystones · N frozen_passage |
| Frozen Passage (`frozen_passage`) | S ice_caves_entrance · E crystal_chamber · N frost_giant_lair |
| Crystal Chamber (`crystal_chamber`) | W frozen_passage |
| Frost Giant's Lair (`frost_giant_lair`) | S frozen_passage · E ice_shrine |
| Frozen Shrine (`ice_shrine`) | W frost_giant_lair |

### volcano (5) — frontier, via waystone

| Location | Exits |
|---|---|
| Ashen Threshold (`volcano_entrance`) | N hall_of_waystones · S lava_tube |
| Lava Tube (`lava_tube`) | N volcano_entrance · E obsidian_chamber · S dragons_lair · W ember_vents |
| Ember Vents (`ember_vents`) | E lava_tube |
| Obsidian Chamber (`obsidian_chamber`) | W lava_tube |
| Dragon's Lair (`dragons_lair`) | N lava_tube |

### desert (5) — frontier, via waystone

| Location | Exits |
|---|---|
| Dune's Edge (`desert_entrance`) | W hall_of_waystones · E shifting_dunes |
| Shifting Dunes (`shifting_dunes`) | W desert_entrance · N buried_oasis · E sandworm_den · S salt_flats |
| Salt Flats (`salt_flats`) | N shifting_dunes |
| Buried Oasis (`buried_oasis`) | S shifting_dunes |
| Sandworm Den (`sandworm_den`) | W shifting_dunes |

### mountains (5) — frontier, via waystone

| Location | Exits |
|---|---|
| High Pass (`mountains_entrance`) | E hall_of_waystones · W cliffside_trail |
| Cliffside Trail (`cliffside_trail`) | E mountains_entrance · N eagles_nest · W frozen_summit · S hidden_grotto |
| Hidden Grotto (`hidden_grotto`) | N cliffside_trail |
| Roc's Aerie (`eagles_nest`) | S cliffside_trail |
| Frozen Summit (`frozen_summit`) | E cliffside_trail |

### swamp (4) — frontier, via waystone

| Location | Exits |
|---|---|
| Mire's Edge (`swamp_entrance`) | U hall_of_waystones · S sunken_ruins |
| Sunken Ruins (`sunken_ruins`) | N swamp_entrance · E witch_hut · S drowned_grove |
| Drowned Grove (`drowned_grove`) | N sunken_ruins |
| Witch's Hut (`witch_hut`) | W sunken_ruins |

---

## How this was verified (not just written)

Three automated passes, run against the actual game data:

1. **Graph integrity** — every exit resolves to a location that exists, no
   duplicate ids, no two locations share map coordinates on the same
   floor, and a breadth-first search from the starting room reaches all
   100 locations.
2. **Reference integrity** — every monster id, item id, and NPC id
   referenced anywhere in the world actually exists in the respective
   registry (this caught a missing NPC definition).
3. **Scripted playthrough** — the actual `GameEngine`, driven the same
   way the UI drives it, walking: the map/journal unlock, the graveyard
   ⇄ catacombs shortcut (both directions), the full surface route to the
   castle plus the secret castle ⇄ dungeon stair (both directions), the
   locked armory + key found in the cell block, and the well → sewers →
   underground city → Hall of Waystones → two frontier regions and back.

This process found and fixed several real bugs before you ever saw
them: `Old Paper`/`Rusty Pencil` were defined as items but never placed
anywhere in the world (the entire map-unlock mechanic was unreachable);
starting characters were never auto-equipping their class weapon; the
Hall of Waystones' rune interactions referenced exits that didn't
actually exist in the room's exit list; and three "early main quest"
encounters (a Stone Ogre, a Vampire Thrall) were tuned high enough to
reliably kill a level-1 character with no warning.

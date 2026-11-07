# Dark Passages

A modern retro text adventure — Zork/Colossal Cave/Infocom atmosphere, a
forgiving natural-language parser, RPG progression, and a self-drawing
ASCII map you have to earn first. Runs entirely client-side: React + Vite
+ TypeScript + Tailwind, saves to JSON.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL. Create a character, then type `look` to start.

```bash
npm run build     # production build to dist/
npm run typecheck # strict TS check, no emit
```

## Design pillars (from the brief)

- **No map at first.** You start with nothing. Find `Old Paper` and a
  `Rusty Pencil` and the `map` command unlocks — the ASCII map renders
  itself from wherever you've actually been, with fog of war (`?` for
  known-but-unvisited, blank for undiscovered).
- **A forgiving parser.** `go north`, `north`, `n`, `walk north`, and
  `head north` are all the same command. So are `attack goblin`, `kill
  goblin`, `fight goblin`, `hit goblin`, `stab goblin`. See
  `src/parser/synonyms.ts` — adding a new synonym is a one-line change.
- **Atmosphere over combat spam.** Room text, ambient sound lines, and a
  CRT-styled terminal UI carry the mood; the log tries to read like a
  transcript, not a stat sheet.
- **Difficulty selection at character creation.** Easy/Normal/Hard scales
  every monster's health, damage, and XP reward (`applyDifficulty()` in
  `entities/monsters.ts`) — chosen once, applied to every fight.
- **World completion tracking.** A weighted percentage (60% locations
  explored, 20% quests completed, 20% unique monsters defeated) shown in
  the sidebar's Character and Save tabs, and via the `completion` command.
  It's meant to encourage exploration, not gate an achievement — several
  locations are mutually-exclusive shortcuts, so 100% isn't the expected
  outcome of a single playthrough.
- **ASCII banners for the big moments** (`src/data/asciiArt.ts`): the
  title screen, dying, and the current story's climax.
- **9 quests** (up from 2): the main well quest plus 8 self-tracking side
  quests tied to specific bosses (bandits, frost giant, dragon, sandworm,
  castle intruder, the Lich King) and the waystone network — see
  `src/data/quests.ts`. Side quests use `autoStart: true` and track
  themselves via a `defeated_<monsterId>_at_<locationId>` flag set
  automatically on every kill, no NPC hand-off required.
- **Zork-style scoring**: a trophy case at the Village Square
  (`put <item> in case`) banks treasure-tier items for points, plus a
  `score` command with rank titles (Vagrant → ... → Legend of the Deep).
  Also a small set of "for your amusement" easter eggs in the Colossal
  Cave/Zork tradition: `xyzzy`, `plugh` (an old teleport-home word),
  `swear`, `sing`, `dance`, `count leaves`, `zork`, `yell`, `examine
  myself`, `take myself` — see `docs/HINTS.md` for the full list.
- **Procedural ambient audio** (`src/systems/audio/AmbientAudioSystem.ts`):
  a low drone + filtered noise per region, generated entirely with the
  Web Audio API (no sound files to host). It auto-ducks to near-silent
  while the mic is actively listening for a voice command, since sound
  and voice control were an explicit "don't let one break the other" ask.
- **Voice control that actually loops.** The original hands-free
  implementation died silently whenever `SpeechRecognition` ended from a
  silence timeout (very common on mobile) instead of a real result — it
  only restarted itself after speaking a response. Fixed to distinguish
  "got a result" from "timed out with nothing said" and restart itself
  in the latter case too, unless the mic was explicitly turned off or
  permission was denied.
- **RPG systems**: seven stats, ten classes, leveling, equipment,
  quests with multi-stage tracking, a loot/rarity system, and a combat
  loop simple enough to stay legible in a text log.

## Architecture

```
retro-dungeon/
├── src/
│   ├── types/            Shared domain model (Location, Item, Monster,
│   │                     GameState, ParsedCommand, ...) — the vocabulary
│   │                     every other module speaks. No logic here.
│   │
│   ├── parser/            Natural-language command parsing
│   │   ├── synonyms.ts        Verb/direction alias tables
│   │   └── Parser.ts          Tokenizer + parser
│   │
│   ├── world/
│   │   ├── locations/         One file per region (16 files, 100 rooms
│   │   │                      total) + index.ts aggregator
│   │   ├── World.ts            Stateless queries over the world graph
│   │   └── worldGenerator.ts   Procedural filler-room generator (see
│   │                          "Scaling further" below)
│   │
│   ├── entities/
│   │   ├── items.ts            Item registry
│   │   ├── monsters.ts         Monster registry + scaled-variant generator
│   │   └── npc.ts               NPCs + dialogue trees
│   │
│   ├── data/
│   │   ├── classes.ts          10 playable classes, stats, starting gear
│   │   └── quests.ts           Quest definitions
│   │
│   ├── systems/
│   │   ├── combat/CombatSystem.ts
│   │   ├── inventory/InventorySystem.ts
│   │   ├── character/CharacterSystem.ts   (leveling, XP curve, resting)
│   │   ├── quests/QuestSystem.ts
│   │   ├── map/MapSystem.ts                (ASCII rendering, fog of war)
│   │   └── save/SaveSystem.ts              (JSON save/load, local + file)
│   │
│   ├── engine/
│   │   ├── GameState.ts        New-game state factory
│   │   └── GameEngine.ts       Dispatches ParsedCommand -> systems -> text
│   │
│   └── ui/                    React components (terminal, status bar,
│                               sidebar tabs, character creation)
│
├── docs/
│   ├── WORLD_MAP.md            Full spoiler map of all 100 locations
│   └── HINTS.md                 Tiered hints, soft nudge -> full spoiler
│
├── index.html, vite.config.ts, tailwind.config.ts, tsconfig.json
└── README.md
```

**Nothing is monolithic.** The engine never touches raw location data —
it goes through `World`. The UI never touches game logic — it calls
`GameEngine.execute(input)` and renders the returned text plus the
current `GameState`. Every system is independently testable and
independently replaceable.

## The world today

**100 hand-authored locations across 16 regions**, fully connected and
verified (see `docs/WORLD_MAP.md` for the complete map, the story arc,
and exactly how it was tested — including an actual scripted playthrough
of the engine, not just static checks):

- **Surface**: Village (12 rooms), Forest (8), Dark Forest (4), Ruins (4), Castle (9)
- **Underground, "main quest" side**: Mine/Caves (7), Dungeon (6), Crypt (8), Sewers (4), Underground City (8), Ancient Temple (6, final boss)
- **Frontier, reached via the Hall of Waystones**: Ice Caves (5), Volcano (5), Desert (5), Mountains (5), Swamp (4)

Three shortcuts tie the "separate-feeling" branches into one connected
world: the village graveyard drops directly into the crypt catacombs, a
hidden stair behind the castle throne drops directly into the dungeon's
guard room, and the Hall of Waystones (found deep in the underground
city) opens all five frontier regions from one hub.

## Scaling further (toward the original 1000+ ambition)

Going from 100 to 1000+ rooms from here is still a content problem, not
an architecture problem:

1. **Keep hand-authoring landmarks.** Bosses, quest hubs, and unique
   set-pieces stay hand-written, one region file at a time, exactly like
   the 16 files already in `world/locations/`.
2. **Generate the connective tissue.** `src/world/worldGenerator.ts`
   deterministically (seeded) generates filler corridors between
   landmarks from per-region vocabulary pools, using the exact same
   `Location` shape — the engine can't tell a generated room from a
   hand-written one.
3. **Load regions lazily.** Convert the static imports in
   `world/locations/index.ts` to `import()` calls per region so the
   client only holds the current region (+ neighbors) in memory.
4. **Optional: AI-authored flavor text at runtime**, per the brief's
   "Future AI Features" idea — the *graph* (which rooms connect to which,
   what's in them) stays deterministic and hand-designed for puzzle
   integrity; only the prose description would be swapped for an LLM
   call, keyed by room id + a short context prompt, with the
   hand-written text as a fallback.

## Monster roster

23 hand-authored monsters spanning goblinoids, undead, spiders, oozes,
demons, dragons, elementals, and frontier-region specialists (frost
giant, sandworm, roc, bog witch, magma hound), plus `generateVariant()`
in `entities/monsters.ts`, which produces Weak/Elder/Ancient tiers of
any base monster on demand — the mechanism for reaching "300+ distinct
encounters" without hand-authoring 300 stat blocks.

## Command reference

Movement: `go <dir>` / bare direction / `n,s,e,w,u,d`, `climb`, `enter`, `leave`
Senses: `look`, `look <direction>`, `inspect <thing>`, `search`, `listen`, `smell`, `taste`
Items: `take`, `drop`, `put <item> in case`, `wear`/`equip`, `remove`/`unequip`, `inventory`, `use`, `drink`, `eat`
Combat: `attack` (`kill`/`fight`/`hit`/`stab` all work), `attack <target> with <item>`, `cast <spell>`, `spells`, `flee`
World interaction: `open`, `close`, `unlock`, `push`, `pull`, `read`, `pray`, `sit`, `climb`, `dig`
Social: `talk <npc>`, `ask <npc> about <topic>`, `buy <item>`
Meta: `stats`, `quests`, `map`, `journal`, `rest`, `save`, `help`, `hint`, `completion`, `score`, `xyzzy`

## Roadmap (from the brief, not yet built)

- Node.js/Express backend, accounts, cloud save, multiplayer/co-op
- Growing from 100 toward the design doc's 1000+ rooms via the generator pipeline above
- Full ~300 monster roster via tiered generation across all families
- Crafting (`craft`, `combine`) and full economy loop
- Runtime AI-generated side quests and dialogue variation
- Audio layer (ambient loops per the brief: wind, dripping water, chains,
  distant screams, thunder, low ambient dungeon drone)

## Hands-free / smart glasses (Meta Ray-Ban etc.)

The glasses pair with your **phone** as a Bluetooth headset. Speech recognition and
text-to-speech run in the phone's browser; the glasses only supply mic and speakers.

Setup:
1. Pair the glasses with the phone, open the game in **Chrome on Android** (best support).
2. Tap **Hands-free** once and allow the microphone.
3. Keep the browser in the foreground with the screen on (the game requests a screen wake lock).
4. Say commands like "look", "north", "attack goblin". The game reads the answer aloud, then listens again.

Caveats (honest):
- Chrome stops recognition when the tab is backgrounded or the screen locks.
- Meta's own assistant ("Hey Meta") may grab the glasses' mic; disable it if the game hears nothing.
- Bluetooth headset mode can lower audio quality while the mic is open.
- iOS Safari has limited/unreliable Web Speech support. In-car browsers may block the mic.
- Not yet verified on real glasses or in a car.

## Android app (works with the screen locked)

A web page cannot listen with the screen locked, so there is a Capacitor Android app
(`android/`). It uses Android's native speech recognition and a foreground
"microphone" service (notification "Voice mode is listening") so hands-free keeps
working in your pocket. Audio goes through whatever Bluetooth device the phone uses
(e.g. Meta Ray-Ban glasses).

**Get the APK without installing Android Studio:** push to GitHub, open
*Actions → Build Android APK → Run workflow*, download the `dark-passages-debug-apk`
artifact, and install `app-debug.apk` on the phone (allow "install unknown apps").

**Local build:** `npm run android:sync && npm run android:open` (needs Android Studio).

Status: native code is written but not yet compiled or tested on a device.
Phone settings that may be needed: exempt the app from battery optimisation, and make
sure the glasses are the active Bluetooth audio device.

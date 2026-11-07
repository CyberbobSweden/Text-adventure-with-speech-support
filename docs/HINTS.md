# Hints

A side reference, not shown in-game. Each topic goes from a soft nudge to
a full spoiler — stop reading as soon as you've got what you need.

---

### "I have no map and don't know where to start."
1. Look around. Talk to people in the village — they know more than they volunteer.
2. Elder Maren (Village Square) and Old Tomas (the tavern) both know something about maps, if you ask them the right question.
3. **Spoiler:** `take paper` in the Village Square (there's a blank sheet caught by the well), then go to the tavern and `take pencil`. That unlocks the `map` and `journal` commands.

### "How do I fight? I don't seem to be doing much damage."
1. Check what you're holding — `stats` shows your class, but not your gear. Try `inventory`.
2. Your starting weapon should already be equipped, but if you ever unequip it or find a better one, remember to `equip <item>`.
3. **Spoiler:** you can also swap weapons mid-fight with `attack <monster> with <item>` (e.g. `attack goblin with sword`), and spellcasters can check what they know with the `spells` command, then `cast <spell name>`.

### "Something's blocking a path and I can't get past it."
1. Not every route is a straight walk — some places want you to interact with something first (search, climb, dig...) rather than just walking through.
2. Search suspicious-sounding features (ropes, roots, ladders) — `search <thing>` sometimes reveals a route `look` won't show you.
3. **Spoiler locations:**
   - The **Old Well** has a rope — `search rope` reveals a way down.
   - **Dark Forest Edge** has a carved root — `search carved root` reveals a hidden path south.
   - **Underground Lake** has an old ladder — `climb ladder` reveals a way up to a shortcut ledge.

### "I found a locked/sealed thing and don't know what to do with it."
1. Some containers just need the right verb, not a key — try `open`, `read`, `pray`, or `sit` on things that look ceremonial or coffin-shaped.
2. **Spoiler:** the sarcophagus in the **Forgotten Crypt** opens with `open sarcophagus` — no key needed, just be ready, there's a boss in that room.

### "A fight is going badly."
1. `flee` has a real (not guaranteed) chance of working — better than dying.
2. Potions work mid-fight: `drink minor healing potion`.
3. If you're exploring past your level, it's OK to come back later — nothing forces you to push through the Underground Lake / crypt on your first pass through the caves. The Giant Spider down there hits hard for an early character.

### "I want to know the full quest chain without figuring it out."
1. `quests` shows your active quest's current stage in plain language — that's usually enough of a nudge.
2. **Full spoiler — main quest ("What Sleeps in the Well"):** Elder Maren asks you to investigate the well. Climb down (Old Well → search rope → down), follow the water through the **Sewer Entrance** to the **Gate of the Sunken City**. The quest itself currently completes there, but the city continues: the **Archive Hall** leads down into the **Ancient Temple**, ending with the Lich King and the Crown of the Sunken King. The same city also holds the **Hall of Waystones**, which opens travel to five frontier regions (ice caves, volcano, desert, mountains, swamp) — those are separate from the main quest and can be tackled in any order.

### "Is there a way to skip ahead / shortcut the caves?"
- **Spoiler:** yes — climbing the ladder at the Underground Lake leads to Lake Ledge, which has a one-way passage straight into the Ossuary (crypt region), skipping the dungeon entrance and crypt corridor entirely. You can't go back the way you came, though.

### "What are all these quests I keep seeing start automatically?"
Most side quests now track themselves automatically the moment you enter the world — you don't need to find an NPC to "accept" them, they just start recording progress in the background. Check `quests` any time to see what's active. There are 9 total: the main well quest (needs Elder Maren to start), and 8 self-tracking side quests tied to specific bosses and the waystone network.

### "There's a trophy case in the Village Square. What goes in it?"
1. Not everything — try something valuable-looking first.
2. **Spoiler:** any item of type treasure/jewelry/rune, or rarity epic/legendary/artifact, can be banked with `put <item> in case`. Each one is worth points toward your `score` and rank (Vagrant → ... → Legend of the Deep) — this is the game's version of the classic "collect treasures, get points" adventure-game structure.

### "What's `score` vs `completion`?"
`completion` is about how much of the *world* you've seen (locations/quests/monsters). `score` is a points-and-rank system in the Zork tradition — kills, quest completions, and trophy case deposits all contribute. They're deliberately separate: you can finish the story without maxing either one.

### "Are there any easter eggs? (No spoilers past this point if you want to find them yourself.)"
Yes — a handful of "for your amusement" commands in the Colossal Cave/Zork tradition. Try: `xyzzy`, `plugh`, `swear`, `sing` (especially as a Bard), `dance`, `count leaves`, `zork`, `yell`, `examine myself`, and `take myself`. None of them are required for anything — they're just tradition.

### "I found a caved-in grave in the village graveyard."
1. That's not decoration.
2. **Spoiler:** `search disturbed grave` reveals a passage down into the Catacombs — a second, direct entrance to the crypt region that doesn't require going through the caves or dungeon at all.

### "I'm in the castle throne room and something's off about the throne."
1. Not everything needs to be picked up to be useful — some things are worth just looking closer at.
2. **Spoiler:** `search throne` reveals a hidden stair down, which leads all the way to the dungeon region's Guard Room — a direct physical shortcut between the castle and the dungeon in the hills. It works in both directions.

### "I found a locked armory door in the dungeon and don't have a key."
1. You haven't looked everywhere near it yet.
2. **Spoiler:** the Rusty Key is in the Cell Block, one room over. Grab it, come back, `unlock armory` or just `go north` again.

### "What are the five strange stones in the Hall of Waystones?"
1. They're not decoration either. Try reading them.
2. **Spoiler:** `read ice waystone` / `read fire waystone` / `read sand waystone` / `read peak waystone` / `read marsh waystone` each reveal a different hidden exit (north/south/east/west/down respectively), leading to five frontier regions: ice caves, volcano, desert, mountains, and swamp. These are late-game areas — expect real danger.

### "I reached the ancient temple / the final boss and got wrecked."
That's expected, not a bug. The Lich King at the Altar of the Unbound King is a deliberately brutal endgame encounter (level 30) — it's meant to require a well-leveled, well-equipped character, not a rushed first visit. Go level up elsewhere first (the castle, the mine, the frontier regions all have gear and XP), and come back when you're ready. Dying just sends you back to the village with reduced health, not game over — so it's a safe way to scout the fight.

/**
 * Hand-generated ASCII banners (FIGlet "small" font) for the moments
 * that deserve a bit of theater: the title screen, dying, and pulling
 * off the game's current climax. Kept as plain exported strings so
 * engine code can drop them into narration without any rendering logic.
 */

export const TITLE_BANNER = String.raw`
 ___   _   ___ _  __  ___  _   ___ ___   _   ___ ___ ___
|   \ /_\ | _ \ |/ / | _ \/_\ / __/ __| /_\ / __| __/ __|
| |) / _ \|   / ' <  |  _/ _ \\__ \__ \/ _ \ (_ | _|\__ \
|___/_/ \_\_|_\_|\_\ |_|/_/ \_\___/___/_/ \_\___|___|___/`;

export const DEATH_BANNER = String.raw`
__   _____  _   _   _  _   ___   _____   ___ ___ ___ ___
\ \ / / _ \| | | | | || | /_\ \ / / __| |   \_ _| __|   \
 \ V / (_) | |_| | | __ |/ _ \ V /| _|  | |) | || _|| |) |
  |_| \___/ \___/  |_||_/_/ \_\_/ |___| |___/___|___|___/`;

export const VICTORY_BANNER = String.raw`
__   _____ ___ _____ ___  _____   __
\ \ / /_ _/ __|_   _/ _ \| _ \ \ / /
 \ V / | | (__  | || (_) |   /\ V /
  \_/ |___\___| |_| \___/|_|_\ |_|`;

/** A small decorative divider used between narration blocks, e.g. after combat. */
export const DIVIDER = "· · · · · · · · · · · · · · · · · · · · · · · ·";

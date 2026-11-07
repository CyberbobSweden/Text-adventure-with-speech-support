import type { ParsedCommand } from "@/types";
import {
  DIRECTION_WORDS,
  PREPOSITIONS,
  STOP_WORDS,
  VERB_SYNONYMS,
} from "./synonyms";

/**
 * Turns free-text player input into a structured ParsedCommand.
 * Deliberately forgiving: bare direction words ("north"), multi-word
 * verbs ("pick lock"), and prepositional splits ("attack goblin with sword")
 * are all handled without the caller needing to know the grammar.
 */
export class Parser {
  parse(rawInput: string): ParsedCommand {
    const normalized = rawInput.trim().toLowerCase();
    const tokens = normalized
      .split(/\s+/)
      .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

    if (tokens.length === 0) {
      return { verb: "", rawInput };
    }

    // Bare direction, e.g. "north" or "n"
    if (tokens.length === 1 && DIRECTION_WORDS[tokens[0]]) {
      return {
        verb: "go",
        rawInput,
        directObject: DIRECTION_WORDS[tokens[0]],
      };
    }

    let [first, ...rest] = tokens;

    // "pick lock" -> pick-lock is its own verb, distinct from "take"
    if (first === "pick" && rest[0] === "lock") {
      return { verb: "pick_lock", rawInput, directObject: rest.slice(1).join(" ") };
    }

    // "look at map" / "look north" both fall into `look`
    if (first === "look" && rest[0] === "at") {
      rest = rest.slice(1);
    }

    const verb = VERB_SYNONYMS[first] ?? first;

    // "go north", "go to village"
    if (verb === "go" && rest.length > 0 && DIRECTION_WORDS[rest[0]]) {
      return { verb, rawInput, directObject: DIRECTION_WORDS[rest[0]] };
    }

    // Split remaining tokens on a preposition: "attack goblin with sword"
    let directObject: string[] = [];
    let indirectObject: string[] = [];
    let preposition: string | undefined;
    let sawPreposition = false;

    for (const tok of rest) {
      if (!sawPreposition && PREPOSITIONS.has(tok)) {
        sawPreposition = true;
        preposition = tok;
        continue;
      }
      if (sawPreposition) indirectObject.push(tok);
      else directObject.push(tok);
    }

    return {
      verb,
      rawInput,
      directObject: directObject.length ? directObject.join(" ") : undefined,
      indirectObject: indirectObject.length
        ? indirectObject.join(" ")
        : undefined,
      preposition,
    };
  }
}

export const parser = new Parser();

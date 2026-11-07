/**
 * Minimal ambient declarations for the Web Speech API. Not every TS/DOM
 * lib version ships these, and browser support varies (notably: consistent
 * in desktop/Android Chrome; NOT guaranteed in embedded/automotive
 * browsers — see the voice-control hook for the runtime feature check
 * this type-checks against).
 */

interface SpeechRecognitionResultLike {
  transcript: string;
}

interface SpeechRecognitionAlternativeList {
  [index: number]: SpeechRecognitionResultLike;
  length: number;
}

interface SpeechRecognitionResultListLike {
  [index: number]: SpeechRecognitionAlternativeList;
  length: number;
}

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognitionLike, ev: SpeechRecognitionEventLike) => void) | null;
  onerror: ((this: SpeechRecognitionLike, ev: SpeechRecognitionErrorEventLike) => void) | null;
  onend: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
  onstart: ((this: SpeechRecognitionLike, ev: Event) => void) | null;
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

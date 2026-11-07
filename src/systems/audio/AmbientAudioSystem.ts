import type { Region } from "@/types";

/**
 * Ambient sound, generated entirely in-browser with the Web Audio API —
 * no external audio files to host or license. Each region gets a
 * distinct procedural "flavor" (filtered noise + a slow drone), matching
 * the brief's wish list: wind, dripping water, distant screams, low
 * ambient dungeon drone, etc., approximated proceedurally rather than
 * as sampled recordings.
 *
 * Deliberately quiet and easy to duck: the explicit goal from the person
 * building this is "cool, but not so much that voice commands stop
 * working" — so this system exposes `duck()`/`unduck()` for the voice
 * hook to call while actively listening, rather than trying to be clever
 * with automatic echo cancellation it can't actually control (the
 * SpeechRecognition API gives this code no access to the raw mic stream).
 */

interface RegionProfile {
  droneFreq: number; // Hz, a very low sine/triangle drone
  noiseType: "wind" | "drip" | "hum" | "none";
  noiseGain: number; // 0-1
}

const REGION_PROFILES: Partial<Record<Region, RegionProfile>> = {
  village: { droneFreq: 0, noiseType: "none", noiseGain: 0 },
  forest: { droneFreq: 60, noiseType: "wind", noiseGain: 0.5 },
  dark_forest: { droneFreq: 45, noiseType: "wind", noiseGain: 0.35 },
  ruins: { droneFreq: 55, noiseType: "wind", noiseGain: 0.4 },
  castle: { droneFreq: 50, noiseType: "hum", noiseGain: 0.3 },
  mine: { droneFreq: 40, noiseType: "drip", noiseGain: 0.5 },
  dungeon: { droneFreq: 35, noiseType: "hum", noiseGain: 0.45 },
  crypt: { droneFreq: 30, noiseType: "hum", noiseGain: 0.55 },
  sewers: { droneFreq: 38, noiseType: "drip", noiseGain: 0.6 },
  underground_city: { droneFreq: 32, noiseType: "hum", noiseGain: 0.5 },
  ancient_temple: { droneFreq: 28, noiseType: "hum", noiseGain: 0.5 },
  ice_caves: { droneFreq: 65, noiseType: "wind", noiseGain: 0.4 },
  volcano: { droneFreq: 25, noiseType: "hum", noiseGain: 0.6 },
  desert: { droneFreq: 70, noiseType: "wind", noiseGain: 0.45 },
  mountains: { droneFreq: 75, noiseType: "wind", noiseGain: 0.55 },
  swamp: { droneFreq: 42, noiseType: "drip", noiseGain: 0.5 },
};

export class AmbientAudioSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private currentRegion: Region | null = null;
  private userVolume = 0.35;
  private ducked = false;
  private enabled = false;

  /** Must be called from a user gesture (button click) — browsers block audio otherwise. */
  init(): void {
    if (this.ctx) return;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.userVolume;
    this.masterGain.connect(this.ctx.destination);
    this.enabled = true;
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(volume: number): void {
    this.userVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.ducked ? this.userVolume * 0.15 : this.userVolume, this.ctx.currentTime, 0.3);
    }
  }

  /** Quiets ambient audio while the mic is actively listening for a voice command. */
  duck(): void {
    if (!this.masterGain || !this.ctx) return;
    this.ducked = true;
    this.masterGain.gain.setTargetAtTime(this.userVolume * 0.15, this.ctx.currentTime, 0.15);
  }

  unduck(): void {
    if (!this.masterGain || !this.ctx) return;
    this.ducked = false;
    this.masterGain.gain.setTargetAtTime(this.userVolume, this.ctx.currentTime, 0.4);
  }

  private makeNoiseBuffer(): AudioBuffer {
    const ctx = this.ctx!;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  setRegion(region: Region): void {
    if (!this.ctx || !this.masterGain) return;
    if (region === this.currentRegion) return;
    this.currentRegion = region;

    const profile = REGION_PROFILES[region] ?? { droneFreq: 0, noiseType: "none" as const, noiseGain: 0 };
    const now = this.ctx.currentTime;

    // Fade out and tear down the previous drone/noise, then build the new one.
    this.droneGain?.gain.setTargetAtTime(0, now, 0.4);
    this.noiseGain?.gain.setTargetAtTime(0, now, 0.4);
    const oldDrone = this.droneOsc;
    const oldNoise = this.noiseSource;
    setTimeout(() => {
      oldDrone?.stop();
      oldNoise?.stop();
    }, 900);

    if (profile.droneFreq > 0) {
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();
      this.droneOsc.type = "sine";
      this.droneOsc.frequency.value = profile.droneFreq;
      this.droneGain.gain.value = 0;
      this.droneOsc.connect(this.droneGain).connect(this.masterGain);
      this.droneOsc.start();
      this.droneGain.gain.setTargetAtTime(0.5, now + 0.5, 0.6);
    } else {
      this.droneOsc = null;
      this.droneGain = null;
    }

    if (profile.noiseType !== "none") {
      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = this.makeNoiseBuffer();
      this.noiseSource.loop = true;
      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.value = 0;

      if (profile.noiseType === "wind") {
        this.noiseFilter.type = "bandpass";
        this.noiseFilter.frequency.value = 400;
        this.noiseFilter.Q.value = 0.6;
      } else if (profile.noiseType === "drip") {
        this.noiseFilter.type = "lowpass";
        this.noiseFilter.frequency.value = 900;
      } else {
        this.noiseFilter.type = "lowpass";
        this.noiseFilter.frequency.value = 250;
      }

      this.noiseSource.connect(this.noiseFilter).connect(this.noiseGain).connect(this.masterGain);
      this.noiseSource.start();
      this.noiseGain.gain.setTargetAtTime(profile.noiseGain, now + 0.5, 0.6);
    } else {
      this.noiseSource = null;
      this.noiseGain = null;
      this.noiseFilter = null;
    }
  }

  stop(): void {
    this.droneOsc?.stop();
    this.noiseSource?.stop();
    this.ctx?.close();
    this.ctx = null;
    this.enabled = false;
  }
}

export const ambientAudio = new AmbientAudioSystem();

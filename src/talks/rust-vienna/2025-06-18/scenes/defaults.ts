import { View2D } from "@motion-canvas/2d";
import {
  chain,
  InterpolationFunction,
  SignalValue,
  SimpleSignal,
  TimingFunction,
} from "@motion-canvas/core";

export const DEFAULT_COLOR_BACKGROUND = "#101010";
export const DEFAULT_FONT = "JetBrains Mono";
export const DEFAULT_FONT_SIZE = 50;
export const DEFAULT_WPM = 166; // default typing speed for relative text transitions in words per minute
export const NOBREAK_SPACE = " ";

// not "real" rem units, just relative to DEFAULT_FONT_SIZE
export function rem(factor: number): number {
  return DEFAULT_FONT_SIZE * factor;
}

export function make_viewport_unit_functions(
  view: View2D,
): [Function, Function, Function, Function] {
  let vw = (factor: number) => view.width() * (factor / 100);
  let vh = (factor: number) => view.height() * (factor / 100);
  let vmin = (factor: number) =>
    Math.min(view.width(), view.height()) * (factor / 100);
  let vmax = (factor: number) =>
    Math.max(view.width(), view.height()) * (factor / 100);

  return [vw, vh, vmin, vmax];
}

function isSignalValueCallable<TValue>(
  value: SignalValue<TValue>,
): value is () => TValue {
  return typeof value === "function";
}

function resolveSignalValue<TValue>(value: SignalValue<TValue>): TValue {
  if (isSignalValueCallable(value)) {
    return value();
  }

  return value;
}

export function textToUnderscores(value: SignalValue<string>): string {
  return resolveSignalValue(value).replace(/\S/g, "_");
}

// Transition time is calculated per character, essentially
export function relTextTransition<TOwner = void>(
  signal: SimpleSignal<string, TOwner>,
  value: SignalValue<string>,
  wordsPerMinute: number = DEFAULT_WPM,
  timingFunction?: TimingFunction,
  interpolationFunction?: InterpolationFunction<string, any[]>,
) {
  const avgWordLength = 5;
  const charactersPerSecond = (wordsPerMinute * avgWordLength) / 60;

  const duration = value.length / charactersPerSecond;

  return signal(value, duration, timingFunction, interpolationFunction);
}

export function typewriterTransition<TOwner = void>(
  signal: SimpleSignal<string, TOwner>,
  value: SignalValue<string>,
  time: number,
  timingFunction?: TimingFunction,
  interpolationFunction?: InterpolationFunction<string, any[]>,
) {
  const underscoresTime = time / 3;
  const textTime = time - underscoresTime;

  return chain(
    signal(
      textToUnderscores(value),
      underscoresTime,
      timingFunction,
      interpolationFunction,
    ).to(value, textTime, timingFunction, interpolationFunction),
  );
}

export function relTypewriterTransition<TOwner = void>(
  signal: SimpleSignal<string, TOwner>,
  value: SignalValue<string>,
  wordsPerMinute: number = DEFAULT_WPM,
  timingFunction?: TimingFunction,
  interpolationFunction?: InterpolationFunction<string, any[]>,
) {
  return chain(
    relTextTransition(
      signal,
      textToUnderscores(value),
      wordsPerMinute,
      timingFunction,
      interpolationFunction,
    ),
    relTextTransition(
      signal,
      value,
      wordsPerMinute,
      timingFunction,
      interpolationFunction,
    ),
  );
}

import { View2D } from "@motion-canvas/2d";

export const DEFAULT_COLOR_BACKGROUND = "#111111";
export const DEFAULT_FONT = "JetBrains Mono";
export const DEFAULT_FONT_SIZE = 50;
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

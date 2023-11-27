import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { waitFor } from "@motion-canvas/core/lib/flow";
import { DEFAULT_COLOR_BACKGROUND } from "./defaults";

export default makeScene2D(function* (view) {
  view.fill(DEFAULT_COLOR_BACKGROUND);

  yield* waitFor(1.5);
});

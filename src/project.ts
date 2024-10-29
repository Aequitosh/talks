import { makeProject } from '@motion-canvas/core';

import intro from './talks/rust-vienna/2024-10-29/scenes/000_intro?scene';
import strings from './talks/rust-vienna/2024-10-29/scenes/100_strings?scene';
import end from './talks/rust-vienna/2024-10-29/scenes/300_end?scene';

export default makeProject({
  scenes: [intro, strings, end],
});


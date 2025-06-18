import { makeProject } from '@motion-canvas/core';

import intro from './talks/rust-vienna/2025-06-18/scenes/000_intro?scene';
import main from './talks/rust-vienna/2025-06-18/scenes/100_main?scene';

export default makeProject({
  scenes: [
    intro,
    main,
  ],
});


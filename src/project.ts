import { makeProject } from '@motion-canvas/core';

import intro from './talks/rust-vienna/2024-06-27/scenes/000_intro?scene';
import what_is_pyo3 from './talks/rust-vienna/2024-06-27/scenes/100_what_is_pyo3?scene';
import architecture from './talks/rust-vienna/2024-06-27/scenes/200_architecture?scene';
import end from './talks/rust-vienna/2024-06-27/scenes/300_end?scene';

export default makeProject({
  scenes: [intro, what_is_pyo3, architecture, end],
});


import { makeProject } from '@motion-canvas/core';

import intro from './talks/rust-vienna/2024-04-25/scenes/000_intro?scene';
import what_is_pyo3 from './talks/rust-vienna/2024-04-25/scenes/100_what_is_pyo3?scene';
import proc_and_lt from './talks/rust-vienna/2024-04-25/scenes/110_proc_and_lt?scene';
import open_source from './talks/rust-vienna/2024-04-25/scenes/200_open_source?scene';
import end from './talks/rust-vienna/2024-04-25/scenes/300_end?scene';

export default makeProject({
  scenes: [intro, what_is_pyo3, proc_and_lt, open_source, end],
});


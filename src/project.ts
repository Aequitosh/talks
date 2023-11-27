import {makeProject} from '@motion-canvas/core';

import intro from './talks/rust-vienna/2023-11-30/scenes/000_intro?scene';
import web_servers from './talks/rust-vienna/2023-11-30/scenes/100_web_servers?scene';

export default makeProject({
  scenes: [intro, web_servers],
});


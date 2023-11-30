import {makeProject} from '@motion-canvas/core';

import intro from './talks/rust-vienna/2023-11-30/scenes/000_intro?scene';
import core_principles from './talks/rust-vienna/2023-11-30/scenes/100_core_principles?scene';
import web_servers from './talks/rust-vienna/2023-11-30/scenes/200_web_servers?scene';

export default makeProject({
  scenes: [intro, core_principles, web_servers],
});


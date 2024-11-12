import { makeProject } from '@motion-canvas/core';

import intro from './talks/0xA-science-association/2024-11-12/scenes/000_intro?scene';
import who_cares from './talks/0xA-science-association/2024-11-12/scenes/100_who_cares?scene';
import code from './talks/0xA-science-association/2024-11-12/scenes/200_code?scene';
import end from './talks/0xA-science-association/2024-11-12/scenes/300_end?scene';

export default makeProject({
  scenes: [intro, who_cares, code, end],
});


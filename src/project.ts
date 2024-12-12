import { makeProject } from '@motion-canvas/core';

import intro from './talks/rust-vienna/2024-12-12/scenes/000_intro?scene';
import usingRules from './talks/rust-vienna/2024-12-12/scenes/100_using_rules?scene';
import usingIntrinsics from './talks/rust-vienna/2024-12-12/scenes/200_using_rules_of_intrinsics?scene';
import usingBlanketImpls from './talks/rust-vienna/2024-12-12/scenes/300_using_blanket_impls?scene';
import referencesEtc from './talks/rust-vienna/2024-12-12/scenes/400_references_etc?scene';
import end from './talks/rust-vienna/2024-12-12/scenes/500_end?scene';

export default makeProject({
  scenes: [
    intro,
    usingRules,
    usingIntrinsics,
    usingBlanketImpls,
    referencesEtc,
    end,
  ],
});


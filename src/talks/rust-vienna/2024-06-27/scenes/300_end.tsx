import { Img, Layout, Txt, Rect } from "@motion-canvas/2d";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
  beginSlide,
  createRef,
  easeInOutQuad,
  easeInQuad,
  easeOutQuad,
} from "@motion-canvas/core";
import { all, chain, waitFor } from "@motion-canvas/core/lib/flow";
import {
  DEFAULT_COLOR_BACKGROUND,
  DEFAULT_FONT,
  make_viewport_unit_functions,
  NOBREAK_SPACE,
  rem,
} from "./defaults";

import repoQRCode from "../assets/repo_qr_code.png";

export default makeScene2D(function* (view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  let titleLayout = createRef<Layout>();

  const title = createRef<Txt>();
  const titleTo = "Thank you";

  const subtitle = createRef<Txt>();
  const subtitleTo = "for your attention";

  const name = createRef<Txt>();
  const nameTo = "Max R. Carrara - @aequitosh";

  const company = createRef<Txt>();
  const companyTo = "Proxmox";

  const refs = [title, subtitle, name, company];

  view.add(
    <Layout
      ref={titleLayout}
      fontFamily={DEFAULT_FONT}
      width={"80%"}
      height={"60%"}
      direction={"column"}
      rowGap={150}
      layout
    >
      <Rect direction={"column"} width={"100%"} alignItems={"center"} layout>
        <Txt ref={title} fontSize={rem(5)} fill={"white"} />
        <Txt ref={subtitle} fontSize={rem(5)} fill={"white"} />
      </Rect>

      <Rect
        direction={"column"}
        rowGap={55}
        width={"100%"}
        alignItems={"center"}
        layout
      >
        <Txt ref={name} fontSize={75} fill={"white"} />
        <Txt ref={company} fontSize={50} fill={"white"} />
      </Rect>
    </Layout>,
  );

  // Because I'm too lazy to layout stuff properly
  for (const ref of refs) {
    ref().text(" ");
    ref().opacity(0);
  }

  yield* all(
    chain(
      waitFor(0),
      all(
        title().opacity(1, 1),
        title()
          .text(NOBREAK_SPACE.repeat(titleTo.length), 0)
          .to(titleTo, 1, easeInOutQuad),
      ),
    ),

    chain(
      waitFor(0.75),
      all(
        subtitle().opacity(1, 1),
        subtitle()
          .text(NOBREAK_SPACE.repeat(subtitleTo.length), 0)
          .to(subtitleTo, 1.5, easeInOutQuad),
      ),
    ),
  );

  yield* all(
    name().text(NOBREAK_SPACE.repeat(nameTo.length), 0),
    company().text(NOBREAK_SPACE.repeat(companyTo.length), 0),
    chain(
      waitFor(0),
      all(name().opacity(1, 1), name().text(nameTo, 1.5, easeInOutQuad)),
    ),

    chain(
      all(
        company().opacity(1, 1),
        company().text(companyTo, 1.5, easeInOutQuad),
      ),
    ),
  );

  yield* beginSlide("next_scene");
  yield* all(
    ...refs
      .reverse()
      .map((ref, i) => all(ref().opacity(0, 1 + i, easeOutQuad))),
  );

  const qr = createRef<Img>();

  view.add(
    <Img
      ref={qr}
      src={repoQRCode}
      size={vh(50)}
      alignSelf={"center"}
      opacity={0}
    />,
  );

  yield* all(qr().opacity(1, 1, easeInOutQuad));

  yield* beginSlide("end");

  yield* view.opacity(0, 2.5, easeInOutQuad);
});

import { Layout, Txt, Rect } from "@motion-canvas/2d";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { beginSlide, createRef, easeOutQuad } from "@motion-canvas/core";
import { all, chain, waitFor } from "@motion-canvas/core/lib/flow";
import {
  DEFAULT_COLOR_BACKGROUND,
  DEFAULT_FONT,
  NOBREAK_SPACE,
} from "./defaults";

export default makeScene2D(function* (view) {
  view.fill(DEFAULT_COLOR_BACKGROUND);

  yield* beginSlide("intro");

  let titleLayout = createRef<Layout>();

  const title = createRef<Txt>();
  const titleTo = "PyO3 Demystified";

  const subtitle = createRef<Txt>();
  const subtitleTo = "the perfect marriage between snakes and crabs";

  const name = createRef<Txt>();
  const nameTo = "Max R. Carrara";

  const company = createRef<Txt>();
  const companyTo = "Proxmox";

  const username = createRef<Txt>();
  const usernameTo = "@aequitosh";

  const refs = [title, subtitle, name, company, username];

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
      <Rect direction={"column"} width={"100%"} rowGap={50} layout>
        <Txt ref={title} fontSize={120} width={"100%"} fill={"white"} />
        <Txt ref={subtitle} fontSize={50} width={"100%"} fill={"white"} />
      </Rect>

      <Rect direction={"column"} rowGap={25} layout>
        <Layout layout>
          <Txt ref={name} width={"50%"} fontSize={50} fill={"white"} />
          <Txt ref={company} width={"50%"} fontSize={50} fill={"white"} />
        </Layout>

        <Txt ref={username} fontSize={40} fill={"white"} />
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
        title().text("_".repeat(titleTo.length), 1).to(titleTo, 1.5),
      ),
    ),

    chain(
      waitFor(0.75),
      all(
        subtitle().opacity(1, 1),
        subtitle()
          .text("_".repeat(subtitleTo.length), 0.75)
          .to(subtitleTo, 1.75),
      ),
    ),
  );

  yield* beginSlide("introduce_yourself");

  yield* all(
    chain(
      waitFor(0),
      all(
        name().opacity(1, 1),
        name().text("_".repeat(nameTo.length), 0.75).to(nameTo, 1.5),
      ),
    ),

    chain(
      waitFor(1.5),
      all(
        company().opacity(1, 1),
        company().text("_".repeat(companyTo.length), 0.75).to(companyTo, 1.5),
      ),
    ),
  );

  yield* beginSlide("username");

  yield* all(
    username().opacity(1, 1),
    username().text("_".repeat(usernameTo.length), 0.75).to(usernameTo, 1.5),
  );

  yield* beginSlide("next_scene");
  yield* all(
    ...refs
      .reverse()
      .map((ref, i) =>
        all(
          ref().opacity(0, 1 + i * 0.25, easeOutQuad),
          ref().text(NOBREAK_SPACE, 1 + i * 0.25, easeOutQuad),
        ),
      ),
  );
});

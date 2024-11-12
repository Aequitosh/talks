import { Layout, Txt, Rect, Line } from "@motion-canvas/2d";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
  beginSlide,
  createRef,
  easeInBounce,
  easeInExpo,
  easeInOutExpo,
  easeInOutQuad,
  easeInOutQuart,
  easeOutQuad,
  range,
} from "@motion-canvas/core";
import { all, chain, waitFor } from "@motion-canvas/core/lib/flow";
import {
  DEFAULT_COLOR_BACKGROUND,
  DEFAULT_FONT,
  make_viewport_unit_functions,
  NOBREAK_SPACE,
  rem,
} from "./defaults";

export default makeScene2D(function* (view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  yield* beginSlide("chapter_intro");

  let titleLayout = createRef<Layout>();

  const title = createRef<Txt>();
  const titleTo = "Effective Rust I";

  const subtitle = createRef<Txt>();
  const subtitleTo = "Ownership Tips & Tricks";

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
      width={"80%"}
      height={"60%"}
      direction={"column"}
      rowGap={"20%"}
      layout
    ></Layout>,
  );

  titleLayout().add(
    <>
      <Rect direction={"column"} width={"100%"} rowGap={"20%"} textWrap layout>
        <Txt ref={title} fontSize={rem(6)} width={"100%"} fill={"white"} />
        <Txt ref={subtitle} fontSize={rem(3)} width={"100%"} fill={"white"} />
      </Rect>

      <Rect direction={"column"} rowGap={vh(1.5)} fontSize={rem(1.75)} layout>
        <Txt ref={name} fill={"white"} />
        <Txt ref={company} fill={"white"} />
        <Txt ref={username} fill={"white"} />
      </Rect>
    </>,
  );

  const makeIntermediateText = (text: string) => text.replace(/\S/g, "_");

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
        title().text(makeIntermediateText(titleTo), 1).to(titleTo, 1.5),
      ),
    ),

    chain(
      waitFor(0.5),
      all(
        subtitle().opacity(1, 1),
        subtitle()
          .text(makeIntermediateText(subtitleTo), 0.75)
          .to(subtitleTo, 1.75),
      ),
    ),
  );

  yield* all(
    chain(
      all(
        name().opacity(1, 1),
        name().text(makeIntermediateText(nameTo), 0.75).to(nameTo, 1.5),
      ),
    ),
    chain(
      waitFor(0.25),
      all(
        company().opacity(1, 1),
        company()
          .text(makeIntermediateText(companyTo), 0.75)
          .to(companyTo, 1.5),
      ),
    ),
    chain(
      waitFor(0.5),
      all(
        username().opacity(1, 1),
        username()
          .text(makeIntermediateText(usernameTo), 0.75)
          .to(usernameTo, 1.5),
      ),
    ),
  );

  yield* beginSlide("goals_of_this_talk");

  let nextTitle = "What to expect from this talk";

  yield* all(
    chain(
      all(
        ...[subtitle, name, company, username]
          .reverse()
          .map((ref, i) =>
            chain(
              ref().text(
                ref().text().replace(/\S/g, "_"),
                0.25 + i * 0.125,
                easeOutQuad,
              ),
              ref().text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
            ),
          ),
      ),
      all(chain(title().text(nextTitle, 1, easeInOutQuad))),
    ),
  );

  yield* beginSlide("goals_ownership_tricks");

  subtitle().padding([vh(10), 0, 0, 0]);

  let nextSubtitle = "ownership tricks for everyday Rust";

  yield* subtitle().text(nextSubtitle, 1.2, easeInOutQuad);

  yield* beginSlide("goals_ownership_stl");

  nextSubtitle = "utilising the standard library";

  yield* subtitle().text(nextSubtitle, 0.8, easeInOutQuad);

  yield* beginSlide("next_scene");

  title().minHeight(title().height());

  yield* all(
    ...[title, subtitle, name, company, username]
      .reverse()
      .map((ref, i) =>
        chain(
          ref().text(
            ref().text().replace(/\S/g, "_"),
            0.25 + i * 0.125,
            easeOutQuad,
          ),
          ref().text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
        ),
      ),
  );
});

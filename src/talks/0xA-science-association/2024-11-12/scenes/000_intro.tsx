import { Layout, Txt, Rect } from "@motion-canvas/2d";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
  Reference,
  beginSlide,
  createRef,
  easeInOutQuad,
  easeOutQuad,
  SignalValue,
  PossibleVector2,
  tween,
  createRefArray,
  range,
  easeInOutBack,
} from "@motion-canvas/core";
import { all, chain, waitFor } from "@motion-canvas/core/lib/flow";
import {
  DEFAULT_COLOR_BACKGROUND,
  DEFAULT_FONT,
  make_viewport_unit_functions,
  NOBREAK_SPACE,
  rem,
  typewriterTransition,
  relTypewriterTransition,
} from "./defaults";

export default makeScene2D(function* (view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  yield* beginSlide("chapter_intro");

  let titleLayout = createRef<Layout>();
  let descLayout = createRef<Layout>();
  let firstColumn = createRef<Layout>();
  let secondColumn = createRef<Layout>();

  const title = createRef<Txt>();
  const titleTo = "Rust in Industry";

  const firstDescColRows = createRefArray<Txt>();
  const secondDescColRows = createRefArray<Txt>();

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
        <Txt
          ref={title}
          fontSize={rem(6)}
          width={"100%"}
          fill={"white"}
          opacity={0}
          text={" "}
        />
      </Rect>

      <Layout
        ref={descLayout}
        direction={"row"}
        columnGap={vw(10)}
        layout
      >
        <Layout ref={firstColumn} direction={"column"} rowGap={vh(1.5)} fontSize={rem(1.75)} layout>
          {range(5).map(() => (
            <Txt
              ref={firstDescColRows}
              fill={"white"}
              text={" "}
            />))
          }
        </Layout>
        <Layout ref={secondColumn} direction={"column"} rowGap={vh(1.5)} fontSize={rem(1.75)} layout>
          {range(5).map(() => (
            <Txt
              ref={secondDescColRows}
              fill={"white"}
              text={" "}
            />))
          }
        </Layout>
      </Layout>
    </>,
  );

  yield* all(
    all(
      all(
        title().opacity(1, 1),
        relTypewriterTransition(title().text, titleTo),
      ),
      all(
        firstDescColRows[0].opacity(1, 1),
        relTypewriterTransition(firstDescColRows[0].text, "Max R. Carrara"),
      ),
    ),
  );

  yield* beginSlide("about_me");

  yield* chain(
    title().fontSize(rem(3), 0.75, easeInOutBack),
    title().text("About me", 0.75),
  );

  yield* beginSlide("about_me_company");

  yield* chain(
    all(
      typewriterTransition(firstDescColRows[1].text, "Proxmox", 1),
    ),
  );

  yield* beginSlide("about_me_handle");

  yield* chain(
    all(
      typewriterTransition(firstDescColRows[2].text, "@aequitosh", 1),
    ),
  );

  yield* beginSlide("about_me_rust");

  yield* chain(
    all(
      typewriterTransition(secondDescColRows[0].text, "3 years of Rust", 1),
    ),
  );

  yield* beginSlide("about_me_rust_vienna");

  yield* chain(
    all(
      typewriterTransition(secondDescColRows[1].text, "Organiser of Rust Vienna", 1),
    ),
  );


  yield* beginSlide("about_me_rust_contrib");

  yield* chain(
    all(
      typewriterTransition(secondDescColRows[2].text, "PyO3", 1),
    ),
  );

  yield* beginSlide("next_scene");

  title().minHeight(title().height());
  firstColumn().size(firstColumn().size());
  secondColumn().size(secondColumn().size());

  yield* all(
    all(
      ...firstDescColRows.reverse().map((txt, i) => chain(
        txt.text(
          txt.text().replace(/\S/g, "_"),
          0.25 + i * 0.125,
          easeOutQuad,
        ),
        txt.text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
        ),
      ),
      ...secondDescColRows.reverse().map((txt, i) => chain(
        txt.text(
          txt.text().replace(/\S/g, "_"),
          0.25 + i * 0.125,
          easeOutQuad,
        ),
        txt.text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
      )),
      chain(
        waitFor(0.75),
        title().text(title().text().replace(/\S/g, "_"), 0.5, easeOutQuad),
        title().text(NOBREAK_SPACE, 0.5, easeOutQuad),
      ),
    ),
  );
});

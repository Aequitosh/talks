import {
  Layout,
  Txt,
  Rect,
  Img,
  Code,
  LezerHighlighter,
  CODE,
  lines,
} from "@motion-canvas/2d";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
  beginSlide,
  createRef,
  TimingFunction,
  Reference,
  easeInQuad,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeOutQuad,
  easeInOutQuad,
  range,
  createRefMap,
  createRefArray,
  createSignal,
  DEFAULT,
  Vector2,
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

import referencesQRCode from "../assets/references_qr_code.png";

export default makeScene2D(function* (view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  let titleLayout = createRef<Layout>();

  const textFieldRefs = createRefMap<Txt>();

  view.add(
    <Layout
      ref={titleLayout}
      width={"90%"}
      height={"90%"}
      direction={"column"}
      rowGap={"10%"}
      layout
    ></Layout>,
  );

  titleLayout().add(
    <>
      <Rect direction={"column"} width={"100%"} rowGap={vh(5)} textWrap layout>
        <Txt
          ref={textFieldRefs.title}
          fontSize={rem(6)}
          width={"100%"}
          fill={"white"}
          paddingBottom={vh(5)}
        />
      </Rect>
    </>,
  );

  const qr = createRef<Img>();

  view.add(
    <Layout
      ref={qr}
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      opacity={0}
      layout
    >
      <Layout
        direction={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        layout
      >
        <Img src={referencesQRCode} size={vh(50)} />
      </Layout>
    </Layout>,
  );

  // Because I'm too lazy to layout stuff properly
  for (const ref of textFieldRefs.mapRefs((ref) => ref)) {
    ref.text(NOBREAK_SPACE);
  }

  let nextTitle = "References\n& Cool Crates";

  const title = textFieldRefs.title;
  title().textWrap(false);

  yield* typewriterTransition(title().text, nextTitle, 2);

  yield* chain(
    title().fontSize(rem(3), 0.6, easeInOutBack),
    title().text("References", 0.6, easeInOutQuad),
  );

  title().textWrap(true);

  yield* all(title().text(nextTitle, 0.6, easeInOutQuad), qr().opacity(1, 1));

  yield* beginSlide("next_slide");

  yield* all(
    qr().opacity(0, 1),
    ...[...textFieldRefs.mapRefs((ref) => ref)]
      .reverse()
      .map((ref, i) =>
        chain(
          ref.text(
            ref.text().replace(/\S/g, "_"),
            0.25 + i * 0.125,
            easeOutQuad,
          ),
          ref.text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
        ),
      ),
  );
});

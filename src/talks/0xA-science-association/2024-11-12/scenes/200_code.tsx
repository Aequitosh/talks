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

import { monokaiDarkStyle } from "@uiw/codemirror-theme-monokai";

import { HighlightStyle } from "@codemirror/language";
import { parser } from "@lezer/rust";

const codeStyle = HighlightStyle.define(monokaiDarkStyle);

Code.defaultHighlighter = new LezerHighlighter(parser, codeStyle);

export default makeScene2D(function* (view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  yield* beginSlide("chapter_code");

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
        {["a", "b", "c", "d", "e"].map((refName) => (
          <Txt
            ref={textFieldRefs[refName]}
            fontSize={rem(2)}
            width={"100%"}
            fill={"white"}
          />
        ))}
      </Rect>
    </>,
  );

  const codeLayout = createRef<Layout>();

  view.add(
    <Layout
      ref={codeLayout}
      height={vh(100)}
      width={vw(100)}
      fontFamily={DEFAULT_FONT}
      fontSize={rem(3)}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      columnGap={vw(10)}
      layout
    />
  );

  const codeExample = createRef<Code>();

  codeLayout().add(<Code ref={codeExample} code={""} />);

  const erase = function* (
    txtRef: Reference<Txt>,
    totalDuration: number,
    useAlternative: boolean = false,
    timingFunction: TimingFunction = easeInOutQuad,
  ) {
    let finalText;

    if (useAlternative) {
      finalText = txtRef().text().replace(/\S*/g, NOBREAK_SPACE);
    } else {
      finalText = NOBREAK_SPACE;
    }

    yield* chain(
      typewriterTransition(txtRef().text, finalText, totalDuration, timingFunction),
    );
  };

  // Because I'm too lazy to layout stuff properly
  for (const ref of textFieldRefs.mapRefs((ref) => ref)) {
    ref.text(NOBREAK_SPACE);
  }

  let nextTitle = "What problems does Rust solve?";

  let [nextSubtitleA, nextSubtitleB, nextSubtitleC, nextSubtitleD, nextSubtitleE] = ["", "", "", "", ""];

  const title = textFieldRefs.title;

  yield* typewriterTransition(title().text, nextTitle, 2);

  yield* beginSlide("problems_rust_solves");

  yield* chain(
    title().fontSize(rem(3), 0.6, easeInOutBack),
  );

  nextSubtitleA = "- memory safety without garbage collection";
  nextSubtitleB = "- null safety";
  nextSubtitleC = "- safe concurrency";
  nextSubtitleD = "- interop with other languages";
  nextSubtitleE = "- easily support multiple platforms";

  yield* beginSlide("problem_memory_safety");

  yield* chain(
    typewriterTransition(textFieldRefs.a().text, nextSubtitleA, 1.5, easeInOutQuad),
  );

  yield* beginSlide("problem_null_safety");

  yield* chain(
    typewriterTransition(textFieldRefs.b().text, nextSubtitleB, 1.5, easeInOutQuad),
  );

  yield* beginSlide("problem_concurrency");

  yield* chain(
    typewriterTransition(textFieldRefs.c().text, nextSubtitleC, 1.5, easeInOutQuad),
  );

  yield* beginSlide("problem_interop");

  yield* chain(
    typewriterTransition(textFieldRefs.d().text, nextSubtitleD, 1.5, easeInOutQuad),
  );

  yield* beginSlide("problem_platforms");

  yield* chain(
    typewriterTransition(textFieldRefs.e().text, nextSubtitleE, 1.5, easeInOutQuad),
  );

  yield* beginSlide("chapter_memory_safety");

  yield* all(
    ...[...textFieldRefs.mapRefs((ref => ref))].reverse().map((ref, i) => chain(
      ref.text(
        ref.text().replace(/\S/g, "_"),
        0.25 + i * 0.125,
        easeOutQuad,
      ),
      ref.text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
    )),
  );

  nextTitle = "Memory Safety Without GC";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  // Rust memory safety is based on this rule: Given an object T, it is only possible to have one of the following:
  //
  //     Having several immutable references (&T) to the object (also known as aliasing).
  //     Having one mutable reference (&mut T) to the object (also known as mutability).
  //
  //     -> enforced through borrow checker

  yield* beginSlide("chapter_null_safety");

  nextTitle = "Null Safety";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  // Option<T>
  // type system
  // typestate
  // typestate analysis

  yield* beginSlide("chapter_concurrency");

  nextTitle = "Concurrency";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  // borrow checker + lifetimes ensure code may be safely shared between threads
  // Send + Sync traits

  yield* beginSlide("chapter_interop");

  nextTitle = "Interoperability - FFI";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  // ffi calls -- repr(C)
  // checking for nullptrs

  yield* beginSlide("chapter_platforms");

  nextTitle = "Supporting Multiple Platforms";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  // targets supported by Rust
  // conditional compilation
  // cargo

  yield* beginSlide("next_scene");

  // also remove code stuff here if necessary

  yield* all(
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

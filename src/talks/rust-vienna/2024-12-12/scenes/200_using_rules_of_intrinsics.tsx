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

  // no beginSlide here for a smooth transition

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
      height={"90%"}
      width={"90%"}
      fontFamily={DEFAULT_FONT}
      fontSize={rem(2)}
      direction={"row"}
      justifyContent={"start"}
      alignItems={"start"}
      columnGap={vw(10)}
      layout
    />
  );

  const codeExample = createRef<Code>();
  const codeMarginTop = createSignal<number>(25);
  const codeMarginLeft = createSignal<number>(0);

  const modifyMarginTop = (offset: number) => codeMarginTop(codeMarginTop() + offset); 
  const modifyMarginLeft = (offset: number) => codeMarginLeft(codeMarginLeft() + offset);

  codeLayout().add(
    <Code
      ref={codeExample}
      code={""}
      marginTop={() => vh(codeMarginTop())}
      marginLeft={() => vw(codeMarginLeft())}
    />
  );

  const annotationRef = createRef<Txt>();
  const annotationOffsetX = createSignal<number>(0);
  const annotationOffsetY = createSignal<number>(0.66);

  const modifyAnnotationOffsetX = (offset: number) => annotationOffsetX(annotationOffsetX() + offset);
  const modifyAnnotationOffsetY = (offset: number) => annotationOffsetY(annotationOffsetY() + offset);

  view.add(
    <Txt
      ref={annotationRef}
      text={""}
      fontFamily={DEFAULT_FONT}
      fontSize={rem(2)}
      fill={"white"}
      textWrap={false}
      topLeft={() => {
        let x = codeExample().topLeft().x + vw(annotationOffsetX());
        let y = codeExample().topLeft().y + vh(annotationOffsetY());

        return new Vector2(x, y);
      }}
    />
  );

  let refsWithoutTitle = [
    textFieldRefs.a,
    textFieldRefs.b,
    textFieldRefs.c,
    textFieldRefs.d,
    textFieldRefs.e
  ];

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

  let nextTitle = "Using Properties of\nIntrinsics";

  let [
    nextSubtitleA,
    nextSubtitleB,
    nextSubtitleC,
    nextSubtitleD,
    nextSubtitleE
  ] = ["", "", "", "", ""];

  const title = textFieldRefs.title;
  title().textWrap(false);

  yield* typewriterTransition(title().text, nextTitle, 2);

  yield* beginSlide("definition_transmute");

  yield* chain(
    title().fontSize(rem(3), 0.6, easeInOutBack),
    title().text("Using Properties", 0.6, easeInOutQuad),
  );

  title().textWrap(true);

  yield* chain(
    title().text(nextTitle, 0.6, easeInOutQuad),
  );

  let exampleCode = CODE`\
pub fn transmute<Src, Dst>(src: Src) -> Dst;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("definition_transmute_annotation_01");

  let annotationText = '"Both types must have the same size. [...]"';

  modifyAnnotationOffsetY(20);

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("definition_transmute_annotation_02");

  annotationText = '"Both types must have the same size.';

  yield* annotationRef().text(annotationText, 0.25, easeInOutQuad);

  annotationText = '"Both types must have the same size.\nCompilation will fail if this is not guaranteed."';

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("example_struct_a");

  yield* annotationRef().text("", 0.6, easeInOutQuad);

  exampleCode = CODE`\
struct A {
    something: u8,
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_struct_b");

  exampleCode = CODE`\
struct A {
    something: u8,
}

struct B {
    something: u32,
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_call_transmute");

  exampleCode = CODE`\
struct A {
    something: u8,
}

struct B {
    something: u32,
}

let a = A { something: 42, };
let b = B { something: 42, };
let new_b = transmute(a, b);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_call_transmute_fails");

  modifyAnnotationOffsetY(35.75);
  modifyAnnotationOffsetX(45);

  annotationText = "<- this fails";

  yield* all(
    annotationRef().text(annotationText, 0.6, easeInOutQuad),
    codeExample().selection(lines(10), 0.6, easeInOutQuad),
  );

  yield* beginSlide("get_rid_of_definitions");

  exampleCode = CODE`\
let new_b = transmute(a, b);`;

  yield* all(
    codeExample().selection(DEFAULT, 0.6, easeInOutQuad),
    annotationRef().text("", 0.6, easeInOutQuad),
  );

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("dont_have_to_call_transmute");

  exampleCode = CODE`\
let new_b = transmute::<A, B>;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("make_transmute_const");

  exampleCode = CODE`\
const _ = transmute::<A, B>;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("use_const_function_pointer");

  exampleCode = CODE`\
const _: fn() = || {
    let _ = transmute::<A, B>;
};`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("macro_definition");

  exampleCode = CODE`\
macro_rules! assert_eq_size {
    ($x:ty, $($xs:ty),+ $(,)?) => {
        const _: fn() = || {
            $(let _ = ::core::mem::transmute::<$x, $xs>;)+
        };
    }
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("macro_example");

  exampleCode = CODE`\
macro_rules! assert_eq_size {
    ($x:ty, $($xs:ty),+ $(,)?) => {
        const _: fn() = || {
            $(let _ = ::core::mem::transmute::<$x, $xs>;)+
        };
    }
}

assert_eq_size!(A, B);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("macro_example_cont");

  exampleCode = CODE`\
macro_rules! assert_eq_size {
    ($x:ty, $($xs:ty),+ $(,)?) => {
        const _: fn() = || {
            $(let _ = ::core::mem::transmute::<$x, $xs>;)+
        };
    }
}

assert_eq_size!(A, B, C);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("adapted_from_static_assertions");

  exampleCode = CODE`\
static_assertions`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  annotationText = "<- on crates.io";

  annotationOffsetY(0.66);
  annotationOffsetX(30);

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

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
    codeExample().code("", 2, easeOutBack),
    annotationRef().text("", 0.6, easeOutQuad),
  );
});

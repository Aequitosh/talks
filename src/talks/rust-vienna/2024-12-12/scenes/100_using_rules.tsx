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

  let nextTitle = "Using Properties\nof Types";

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

  yield* beginSlide("chapter_using_properties_of_types");

  yield* chain(
    title().fontSize(rem(3), 0.6, easeInOutBack),
    title().text("Using Properties", 0.6, easeInOutQuad),
  );

  title().textWrap(true);

  yield* chain(
    title().text(nextTitle, 0.6, easeInOutQuad),
  );

  yield* beginSlide("example_enum");

  let exampleCode = CODE`\
enum Color {
    Red,
    Green,
    Blue,
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_enum_annotation");

  let annotationText = "<- Can only be one of three variants";

  modifyAnnotationOffsetX(25);

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("example_shared_reference");

  yield* annotationRef().text("", 0.6, easeInOutQuad);

  exampleCode = CODE`\
let text = String::from("Hi Rust Vienna!");`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  exampleCode = CODE`\
let text = String::from("Hi Rust Vienna!");

let shared_ref: &str = &text;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_shared_reference_annotation_01");

  annotationText = "<- Can never be null";

  modifyAnnotationOffsetX(25);
  modifyAnnotationOffsetY(11);

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("example_shared_reference_annotation_02");

  annotationText = "<- Cannot modify referent*";

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("example_object_safe_trait");

  yield* annotationRef().text("", 0.6, easeInOutQuad);

  exampleCode = CODE`\
pub trait Read {
    fn read(&mut self, buf: &mut [u8]) -> Result<usize>;

    // [...]
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_object_safe_trait_annotation");

  annotationOffsetX(0);
  modifyAnnotationOffsetY(25);

  annotationText = "How do we guarantee this trait stays object safe?";

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("example_obj_safe_declaration_annotation");

  annotationText = "We try to instantiate it! (kind of)";

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("example_obj_safe_declaration");

  exampleCode = CODE`\
let _: Option<&dyn Read> = None;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_obj_safe_declaration_const");

  yield* annotationRef().text("", 0.6, easeInOutQuad);

  exampleCode = CODE`\
const _: Option<&dyn Read> = None;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_obj_safe_declaration_macro");

  exampleCode = CODE`\
macro_rules! assert_obj_safe {
    ($($trait:path),+ $(,)?) => {
        $(const _: Option<&dyn $trait> = None;)+
    };
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_obj_safe_declaration_macro_use");

  exampleCode = CODE`\
macro_rules! assert_obj_safe {
    ($($trait:path),+ $(,)?) => {
        $(const _: Option<&dyn $trait> = None;)+
    };
}

assert_obj_safe!(Read);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("example_obj_safe_declaration_macro_use_2");

  exampleCode = CODE`\
macro_rules! assert_obj_safe {
    ($($trait:path),+ $(,)?) => {
        $(const _: Option<&dyn $trait> = None;)+
    };
}

assert_obj_safe!(Read, Write);`;

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

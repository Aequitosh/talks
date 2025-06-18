import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, chain, waitFor } from "@motion-canvas/core/lib/flow";
import {
  Reference,
  beginSlide,
  createRef,
  createRefArray,
  createSignal,
  DEFAULT,
  easeInOutBack,
  easeInOutQuad,
  range,
  easeOutQuad,
} from "@motion-canvas/core";

import { Layout, Txt, Rect, Code, Img } from "@motion-canvas/2d/lib/components";

import { LezerHighlighter, CODE, lines } from "@motion-canvas/2d/lib/code";

import { monokaiDarkStyle } from "@uiw/codemirror-theme-monokai";

import { HighlightStyle } from "@codemirror/language";
import { parser as rustParser } from "@lezer/rust";
import { parser as dartParser } from "@lezer/java"; // cursed
import { parser as markdownParser } from "@lezer/markdown";

import repoQRCode from "../assets/repo_qr_code.png";
import motionCanvasLogo from "../assets/motion_canvas.svg";

const codeStyle = HighlightStyle.define(monokaiDarkStyle);

const rustHighlighter = new LezerHighlighter(rustParser, codeStyle);
const dartHighlighter = new LezerHighlighter(dartParser, codeStyle);
const markdownHighlighter = new LezerHighlighter(markdownParser, codeStyle);

Code.defaultHighlighter = new LezerHighlighter(rustParser, codeStyle);

import {
  DEFAULT_COLOR_BACKGROUND,
  DEFAULT_FONT,
  NOBREAK_SPACE,
  make_viewport_unit_functions,
  rem,
  typewriterTransition,
} from "./defaults";

export default makeScene2D(function* (view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  const makeIntermediateText = (text: string) => text.replace(/\S/g, "_");

  const textLayout = createRef<Rect>();
  const codeLayout = createRef<Rect>();

  view.add(
    <Rect
      ref={textLayout}
      width={"95%"}
      height={"92.5%"}
      direction={"column"}
      rowGap={"10%"}
      alignItems={"start"}
      justifyContent={"start"}
      layout
    ></Rect>,
  );

  view.add(
    <Rect
      ref={codeLayout}
      height={"90%"}
      width={"90%"}
      fontFamily={DEFAULT_FONT}
      fontSize={rem(1.5)}
      direction={"column"}
      justifyContent={"space-between"}
      alignItems={"stretch"}
      alignContent={"stretch"}
      layout
    />,
  );

  const txtRef = createRef<Txt>();

  textLayout().add(
    <>
      <Txt ref={txtRef} text={NOBREAK_SPACE} fill={"white"} fontSize={rem(2)} />
    </>,
  );

  const codeRectTop = createRef<Rect>();
  const codeExampleTop = createRef<Code>();

  const codeRectBottom = createRef<Rect>();
  const codeExampleBottom = createRef<Code>();

  codeLayout().add(
    <Rect ref={codeRectTop} padding={5} grow={1} shrink={1} basis={0}>
      <Code ref={codeExampleTop} code={""} />
    </Rect>,
  );

  codeLayout().add(
    <Rect ref={codeRectBottom} padding={5} grow={1} shrink={1} basis={0}>
      <Code ref={codeExampleBottom} code={""} />
    </Rect>,
  );

  let txtContents = "Functions";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  codeRectTop().margin([vh(10), 0, 0, 0]);
  codeExampleTop().code("");
  codeExampleTop().highlighter(dartHighlighter);

  codeRectBottom().margin([0, 0, vh(5), 0]);
  codeExampleBottom().code("");
  codeExampleBottom().highlighter(rustHighlighter);

  let exampleCodeTop = CODE`\
int fibonacci(int n) {

}`;

  let exampleCodeBottom = CODE``;

  yield* all(chain(codeExampleTop().code(exampleCodeTop, 1, easeInOutBack)));

  exampleCodeTop = CODE`\
int fibonacci(int n) {
  if (n < 2) {
    return n;
  }

  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

  yield* all(chain(codeExampleTop().code(exampleCodeTop, 1, easeInOutBack)));

  yield* beginSlide("function_rust");

  exampleCodeBottom = CODE`\
fn fibonacci(n: usize) -> usize {

}`;

  yield* all(
    chain(codeExampleBottom().code(exampleCodeBottom, 1, easeInOutBack)),
  );

  exampleCodeBottom = CODE`\
fn fibonacci(n: usize) -> usize {
    if n < 2 {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}`;

  yield* all(
    chain(codeExampleBottom().code(exampleCodeBottom, 1, easeInOutBack)),
  );

  yield* beginSlide("function_rust_integers");

  exampleCodeBottom = CODE`\
fn fibonacci(n: i32) -> i32 {
    if n < 2 {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}`;

  yield* all(
    chain(
      codeExampleBottom().code(exampleCodeBottom, 1, easeInOutBack),
      waitFor(0.5),
    ),
  );

  exampleCodeBottom = CODE`\
fn fibonacci(n: i128) -> i128 {
    if n < 2 {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}`;

  yield* all(
    chain(
      codeExampleBottom().code(exampleCodeBottom, 1, easeInOutBack),
      waitFor(0.5),
    ),
  );

  exampleCodeBottom = CODE`\
fn fibonacci(n: u64) -> u64 {
    if n < 2 {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}`;

  yield* all(
    chain(
      codeExampleBottom().code(exampleCodeBottom, 1, easeInOutBack),
      waitFor(0.5),
    ),
  );

  exampleCodeBottom = CODE`\
fn fibonacci(n: usize) -> usize {
    if n < 2 {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}`;

  yield* all(
    chain(codeExampleBottom().code(exampleCodeBottom, 1, easeInOutBack)),
  );

  yield* beginSlide("function_rust_omit_return");

  exampleCodeBottom = CODE`\
fn fibonacci(n: usize) -> usize {
    if n < 2 {
        return n;
    }

    fibonacci(n - 1) + fibonacci(n - 2)
}`;

  yield* all(
    chain(codeExampleBottom().code(exampleCodeBottom, 1, easeInOutBack)),
  );

  yield* beginSlide("function_rust_if_expr");

  exampleCodeBottom = CODE`\
fn fibonacci(n: usize) -> usize {
    if n < 2 {
        n
    } else {
        fibonacci2(n - 1) + fibonacci2(n - 2)
    }
}`;

  yield* all(
    chain(codeExampleBottom().code(exampleCodeBottom, 1, easeInOutBack)),
  );

  yield* beginSlide("function_dart_arrow");

  exampleCodeTop = CODE`\
int fibonacci(int n) => n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);`;

  yield* all(chain(codeExampleTop().code(exampleCodeTop, 1, easeInOutBack)));

  yield* beginSlide("inspiration_dart");

  txtContents = "Languages That Inspired Dart";

  yield* all(
    chain(
      all(
        codeExampleTop().code(" ", 1, easeInOutBack),
        codeExampleBottom().code(" ", 1, easeInOutBack),
      ),
      typewriterTransition(txtRef().text, txtContents, 2),
    ),
  );

  yield* codeExampleTop().fontSize(rem(2), 0.1);
  codeExampleTop().highlighter(markdownHighlighter);

  codeLayout().direction("row");
  codeLayout().justifyContent("space-evenly");

  let dartObviousInsp = [
    CODE`- C`,
    CODE`- C
- C++`,
    CODE`- C
- C++
- C#`,
    CODE`- C
- C++
- C#
- Java`,
    CODE`- C
- C++
- C#
- Java
- JavaScript`,
  ];

  yield* chain(
    ...dartObviousInsp.map((code) =>
      chain(codeExampleTop().code(code, 0.6, easeInOutBack)),
    ),
  );

  yield* beginSlide("inspiration_dart_2");

  let dartLessObviousInsp = [
    CODE`- C
- C++
- C#
- Java
- JavaScript
- Ruby`,
    CODE`- C
- C++
- C#
- Java
- JavaScript
- Ruby
- Smalltalk`,
    CODE`- C
- C++
- C#
- Java
- JavaScript
- Ruby
- Smalltalk
- Strongtalk`,
    CODE`- C
- C++
- C#
- Java
- JavaScript
- Ruby
- Smalltalk
- Strongtalk
- TypeScript`,
    CODE`- C
- C++
- C#
- Java
- JavaScript
- Ruby
- Smalltalk
- Strongtalk
- TypeScript
- Erlang`,
  ];

  yield* chain(
    ...dartLessObviousInsp.map((code) =>
      chain(codeExampleTop().code(code, 0.6, easeInOutBack)),
    ),
  );

  yield* beginSlide("inspiration_dart_years");

  exampleCodeTop = CODE`\
- C (1972)
- C++ (1985)
- C# (2000)
- Java (1995)
- JavaScript (1995)
- Ruby (1995)
- Smalltalk (1972)
- Strongtalk (2002)
- TypeScript (2012)
- Erlang (1987)`;

  yield* codeExampleTop().code(exampleCodeTop, 1.5, easeInOutBack);

  yield* beginSlide("inspiration_rust");

  txtContents = "Languages That Inspired Rust";

  yield* all(
    chain(
      all(codeExampleTop().code(" ", 1, easeInOutBack)),
      typewriterTransition(txtRef().text, txtContents, 2),
    ),
  );

  let rustInsp = [
    CODE`- CLU`,
    CODE`- CLU
- BETA`,
    CODE`- CLU
- BETA
- Mesa`,
    CODE`- CLU
- BETA
- Mesa
- NIL`,
    CODE`- CLU
- BETA
- Mesa
- NIL
- Hermes`,
    CODE`- CLU
- BETA
- Mesa
- NIL
- Hermes
- Erlang`,
    CODE`- CLU
- BETA
- Mesa
- NIL
- Hermes
- Erlang
- Sather`,
    CODE`- CLU
- BETA
- Mesa
- NIL
- Hermes
- Erlang
- Sather
- Newsqueak`,
    CODE`- CLU
- BETA
- Mesa
- NIL
- Hermes
- Erlang
- Sather
- Newsqueak
- Alef`,
    CODE`- CLU
- BETA
- Mesa
- NIL
- Hermes
- Erlang
- Sather
- Newsqueak
- Alef
- Limbo`,
    CODE`- CLU
- BETA
- Mesa
- NIL
- Hermes
- Erlang
- Sather
- Newsqueak
- Alef
- Limbo
- Napier`,
  ];

  yield* chain(
    ...rustInsp.map((code) =>
      chain(codeExampleTop().code(code, 0.6, easeInOutBack)),
    ),
  );

  yield* beginSlide("inspiration_rust_years");

  exampleCodeTop = CODE`\
- CLU (1974)
- BETA (1975)
- Mesa (1977)
- NIL (1981)
- Hermes (1990)
- Erlang (1987)
- Sather (1990)
- Newsqueak (1988)
- Alef (1995)
- Limbo (1996)
- Napier (1985, 1988)`;

  yield* codeExampleTop().code(exampleCodeTop, 1.5, easeInOutBack);

  yield* beginSlide("inspiration_rust_known_plus_years");

  codeRectBottom().margin(codeRectTop().margin());
  yield* codeExampleBottom().fontSize(rem(2), 0.1);
  codeExampleBottom().highlighter(markdownHighlighter);

  codeExampleBottom().code("");
  let knownInsp = [
    "- C++",
    "\n- C#",
    "\n- Haskell",
    "\n- OCaml",
    "\n- Standard ML",
    "\n- Swift",
  ];

  yield* chain(
    ...knownInsp.map((piece) =>
      chain(codeExampleBottom().code.append(piece, 0.6)),
    ),
  );

  exampleCodeBottom = CODE`\
- C++ (1985)
- C# (2000)
- Haskell (1990)
- OCaml (1996)
- Standard ML (1983)
- Swift (2014)`;

  yield* codeExampleBottom().code(exampleCodeBottom, 1.5, easeInOutBack);

  yield* beginSlide("feature_comparison");

  txtContents = "Feature Comparison";

  yield* all(
    chain(
      chain(
        codeExampleBottom().code(" ", 1, easeInOutBack),
        codeExampleTop().code(" ", 1, easeInOutBack),
      ),
      typewriterTransition(txtRef().text, txtContents, 2),
    ),
  );

  const codeRectDesc = createRef<Rect>();
  const codeExampleDesc = createRef<Code>();

  codeLayout().insert(
    <Rect ref={codeRectDesc} padding={5} grow={1} shrink={1} basis={0}>
      <Code ref={codeExampleDesc} code={""} highlighter={rustHighlighter} />
    </Rect>,
    0,
  );

  // TODO:
  // codeExampleTop().code("Dart");
  // codeExampleBottom().code("Rust");
  // codeExampleDesc().code("Feature");
  //
  // codeRectDesc().margin(codeRectTop().margin());
  // codeExampleDesc().fontSize(codeExampleTop().fontSize());

  yield* beginSlide("null_safety");

  // TODO:
  // codeRectDesc().remove();

  txtContents = "Null Safety";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  yield* beginSlide("null_safety_rust");

  txtContents = "Null Safety in Rust";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  // top is still left here, and bottom is right
  codeExampleTop().highlighter(rustHighlighter);
  codeExampleBottom().highlighter(dartHighlighter);

  codeExampleTop().fontSize(rem(1.5));
  codeExampleBottom().fontSize(rem(1.5));

  yield* beginSlide("null_safety_dart");

  txtContents = "Null Safety in Dart";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  yield* beginSlide("null_safety_importance");

  txtContents = "Importance of Null Safety";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  yield* beginSlide("null_safety_history");

  txtContents = "Null Safety: Some History";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  yield* beginSlide("algebraic_data_types_rust_option");

  txtContents = "Algebraic Data Types";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  yield* beginSlide("algebraic_data_types_rust_example");

  yield* beginSlide("algebraic_data_types_dart_example");

  yield* beginSlide("algebraic_data_types_rust_result");

  yield* beginSlide("algebraic_data_types_dart_result");

  yield* beginSlide("end_slide");

  yield* all(textLayout().opacity(0, 1), codeLayout().opacity(0, 1));

  let titleLayout = createRef<Layout>();

  const title = createRef<Txt>();
  const titleTo = "Thank you";

  const subtitle = createRef<Txt>();
  const subtitleTo = "for your attention";

  const name = createRef<Txt>();
  const nameTo = "Max R. Carrara - @aequitosh";

  const company = createRef<Txt>();
  const companyTo = "Rust Vienna | Proxmox";

  const refs: Reference<any>[] = [title, subtitle, name, company];

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

  const qr = createRef<Img>();
  const mc = createRef<Img>();

  refs.push(qr, mc);

  view.add(
    <Layout
      ref={qr}
      position={() => [
        view.absolutePosition().x - vw(10),
        view.absolutePosition().y - vh(17.5),
      ]}
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
        <Img src={repoQRCode} size={vh(20)} />
        <Txt
          minHeight={vh(10)}
          fontSize={rem(1.5)}
          text={"\nslides"}
          textAlign={"center"}
          fill={"white"}
        />
      </Layout>
    </Layout>,
  );

  view.add(
    <Layout
      ref={mc}
      position={() => [
        -view.absolutePosition().x + vw(10),
        view.absolutePosition().y - vh(17.5),
      ]}
      direction={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      opacity={0}
      layout
    >
      <Img src={motionCanvasLogo} size={vh(20)} />
      <Txt
        minHeight={vh(10)}
        fontSize={rem(1.5)}
        text={"made with\nMotion Canvas"}
        textAlign={"center"}
        fill={"white"}
      />
    </Layout>,
  );

  yield* all(
    qr().opacity(1, 1, easeInOutQuad),
    mc().opacity(1, 1, easeInOutQuad),
  );

  yield* beginSlide("end");
  yield* all(
    ...refs
      .reverse()
      .map((ref, i) => all(ref().opacity(0, 1 + i, easeOutQuad))),
  );
});

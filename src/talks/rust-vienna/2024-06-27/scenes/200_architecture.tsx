import {
  CODE,
  Code,
  Layout,
  LezerHighlighter,
  lines,
  makeScene2D,
  Rect,
  Txt,
} from "@motion-canvas/2d";
import {
  all,
  beginSlide,
  chain,
  createRef,
  createRefArray,
  DEFAULT,
  easeOutQuad,
  makeRef,
  range,
  waitFor,
} from "@motion-canvas/core";
import {
  DEFAULT_COLOR_BACKGROUND,
  DEFAULT_FONT,
  make_viewport_unit_functions,
  NOBREAK_SPACE,
  rem,
} from "./defaults";

import { parser } from "@lezer/rust";

import { parser as pyParser } from "@lezer/python";

Code.defaultHighlighter = new LezerHighlighter(parser);

const PythonHighlighter = new LezerHighlighter(pyParser);

export default makeScene2D(function* (view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  const COLOR_PY_BLUE1 = "#4b8bbe";
  const COLOR_PY_BLUE2 = "#306998";
  const COLOR_PY_YELLOW1 = "#ffd43b";
  const COLOR_RUST_ORANGE1 = "#B33F0E";
  const COLOR_RUST_ORANGE2 = "#803B20";

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  const packageNameRef = createRef<Txt>();
  let packageNameTo = "";

  const baseLayout = createRef<Layout>();

  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  let titleTo = "";
  let subtitleTo = "";

  const subItems = createRefArray<Txt>();
  const subItemCount = 10;

  view.add(
    <Layout layout width={"100%"} height={"100%"}>
      <Txt
        ref={packageNameRef}
        fill={"white"}
        fontSize={rem(2)}
        margin={rem(2)}
      />
    </Layout>,
  );

  view.add(
    <Layout
      ref={baseLayout}
      width={vw(80)}
      height={vh(60)}
      direction={"column"}
      rowGap={vh(5)}
      layout
    >
      <Txt ref={title} fontSize={rem(6)} fill={"white"} />
      <Txt ref={subtitle} fontSize={rem(2.5)} fill={"white"} />
      {range(subItemCount).map(() => (
        <Txt ref={subItems} fontSize={rem(2)} fill={"white"} />
      ))}
    </Layout>,
  );

  // Helpers for items below title

  const displaySubItem = function* (
    index: number,
    text: string,
    totalDuration: number = 2.0,
  ) {
    yield* chain(
      subItems[index].height(vh(7.5), totalDuration * 0.1),
      subItems[index].text(text, totalDuration * 0.9),
    );
  };

  const hideSubItem = function* (index: number, totalDuration: number = 2.0) {
    yield* chain(
      subItems[index].text(NOBREAK_SPACE, totalDuration * 0.5),
      subItems[index].height(0, totalDuration * 0.5),
    );
  };

  // Architecture

  titleTo = "Architecture";
  subtitleTo = "PyO3 in the wild";

  yield* all(
    ...range(10).map((n) => hideSubItem(n)),
    chain(all(title().text("_".repeat(titleTo.length), 1).to(titleTo, 1))),
    chain(
      waitFor(0.6),
      all(subtitle().text("_".repeat(subtitleTo.length), 1).to(subtitleTo, 1)),
    ),
  );

  yield* beginSlide("architecture_polars");

  titleTo = "polars";
  subtitleTo = "https://pola.rs/";

  yield* all(
    all(subtitle().text(subtitleTo, 1), subtitle().fill("66d9ee", 1)),
    title().text(titleTo, 1),
  );

  yield* beginSlide("package_rect");

  yield* chain(
    all(title().text(NOBREAK_SPACE, 1), subtitle().text(NOBREAK_SPACE, 1)),
  );

  subtitle().fill("white");

  const archLayout = createRef<Layout>();

  const packageRectLeft = createRef<Rect>();
  const packageRectMiddle = createRef<Rect>();
  const packageRectRight = createRef<Rect>();

  const packageTextLeft = createRef<Txt>();
  const packageTextMiddle = createRef<Txt>();
  const packageTextRight = createRef<Txt>();

  const packageCodeLeft = createRef<Code>();
  const packageCodeMiddle = createRef<Code>();
  const packageCodeRight = createRef<Code>();

  view.add(
    <Layout
      ref={archLayout}
      width={vw(80)}
      height={vh(60)}
      columnGap={vw(1)}
      justifyContent={"space-evenly"}
      layout
    >
      <Rect
        ref={packageRectLeft}
        width={"100%"}
        height={"100%"}
        stroke={"gray"}
        fontSize={rem(2)}
        radius={rem(1)}
        lineWidth={rem(0.5)}
        padding={rem(1)}
        opacity={0}
        rowGap={vh(5)}
        direction={"column"}
      >
        <Txt ref={packageTextLeft} />
        <Code ref={packageCodeLeft} fontSize={rem(1)} />
      </Rect>
      <Rect
        ref={packageRectMiddle}
        width={"1%"}
        height={"100%"}
        stroke={"gray"}
        fontSize={rem(2)}
        radius={rem(1)}
        lineWidth={rem(0.5)}
        padding={rem(1)}
        opacity={0}
        rowGap={vh(5)}
        direction={"column"}
      >
        <Txt ref={packageTextMiddle} />
        <Code ref={packageCodeMiddle} fontSize={rem(1)} />
      </Rect>
      <Rect
        ref={packageRectRight}
        width={"1%"}
        height={"100%"}
        stroke={"gray"}
        fontSize={rem(2)}
        radius={rem(1)}
        lineWidth={rem(0.5)}
        padding={rem(1)}
        opacity={0}
        rowGap={vh(5)}
        direction={"column"}
      >
        <Txt ref={packageTextRight} />
        <Code ref={packageCodeRight} fontSize={rem(1)} />
      </Rect>
    </Layout>,
  );

  packageNameTo = "polars";

  yield* all(
    packageNameRef()
      .text("_".repeat(packageNameTo.length), 1)
      .to(packageNameTo, 1),
    packageRectLeft().opacity(1, 1),
  );

  yield* beginSlide("highlight_package");

  yield* chain(
    ...range(3).map((_) =>
      chain(
        packageRectLeft().stroke("white", 0.2),
        packageRectLeft().stroke("gray", 0.2),
      ),
    ),
  );

  yield* beginSlide("package_python_rust1");

  packageRectRight().stroke(COLOR_RUST_ORANGE1);

  yield* all(
    packageRectRight().opacity(1, 0.5),
    packageRectRight().width("100%", 1),
    packageRectLeft().stroke(COLOR_PY_BLUE1, 1),
  );

  packageTextLeft().fill(COLOR_PY_BLUE1);
  packageTextRight().fill(COLOR_RUST_ORANGE1);

  yield* all(
    packageTextLeft().text("Python", 1),
    packageTextRight().text("Rust", 1),
  );

  yield* beginSlide("python_dataframe");

  const codeCompLayoutRef = createRef<Rect>();
  const codePythonRef = createRef<Code>();
  const codeRustRef = createRef<Code>();

  view.add(
    <Rect
      ref={codeCompLayoutRef}
      justifyContent={"center"}
      width={"100%"}
      direction={"row"}
      columnGap={vw(6)}
      fontSize={rem(1.8)}
      layout
    >
      <Code ref={codePythonRef} highlighter={PythonHighlighter} />
      <Code ref={codeRustRef} />
    </Rect>,
  );

  packageNameTo = "polars: Python";

  yield* all(
    archLayout().opacity(0, 1),
    packageNameRef().text(packageNameTo, 1),
  );

  const pyDataframe = CODE`\
class Dataframe:
    _df: PyDataFrame
    _accessors: ClassVar[set[str]] = {"plot"}

    def __init__(self, ...):
        ...`;

  yield* codePythonRef().code(pyDataframe, 1);

  yield* beginSlide("package_dataframe_hl");

  yield* codePythonRef().selection(lines(1), 0.5);

  yield* beginSlide("package_dataframe_unhl");

  yield* codePythonRef().selection(DEFAULT, 0.5);

  yield* beginSlide("package_python_rust2");

  packageCodeLeft().highlighter(PythonHighlighter);
  packageCodeLeft().code(pyDataframe);

  yield* codeCompLayoutRef().opacity(0, 0.75);
  yield* all(codePythonRef().code("", 0.75), archLayout().opacity(1, 0.75));

  yield* beginSlide("rust_dataframe");

  packageNameTo = "polars: Rust";

  yield* all(
    archLayout().opacity(0, 1),
    packageNameRef().text(packageNameTo, 1),
  );

  yield* codeCompLayoutRef().opacity(1, 0.75);

  const rustDataframe = CODE`\
#[pyclass]
#[repr(transparent)]
#[derive(Clone)]
pub struct PyDataFrame {
    pub df: DataFrame,
}

// ...

impl PyDataFrame {
    pub(crate) fn new(df: DataFrame) -> Self {
        PyDataFrame { df }
    }
}`;

  yield* codeRustRef().code(rustDataframe, 1);

  yield* beginSlide("package_pydataframe_hl");

  yield* codeRustRef().selection(lines(4), 0.5);

  yield* beginSlide("package_pydataframe_unhl");

  yield* codeRustRef().selection(DEFAULT, 0.5);

  yield* beginSlide("package_python_rust3");

  packageCodeRight().code(rustDataframe);

  packageNameTo = "polars";

  yield* codeCompLayoutRef().opacity(0, 0.75);
  yield* all(
    codeRustRef().code("", 0.75),
    archLayout().opacity(1, 0.75),
    packageNameRef().text(packageNameTo, 1),
  );

  yield* beginSlide("pyo3_purpose_visualized");

  packageTextMiddle().fill(COLOR_PY_YELLOW1);

  yield* chain(
    all(
      packageRectMiddle().opacity(1, 0.5),
      packageRectMiddle().stroke(COLOR_PY_YELLOW1, 0.5),
      packageRectMiddle().width("100%", 0.5),
    ),
    archLayout().width("80%", 1),
    packageTextMiddle().text("PyO3", 0.5),
  );

  yield* beginSlide("summary");

  titleTo = "Summary";

  yield* all(
    packageNameRef().text("", 1),
    archLayout().opacity(0, 1),
    title().text("_".repeat(titleTo.length), 1).to(titleTo, 1),
  );

  yield* beginSlide("summary_item_0");

  // yield* title().text("", 0.5);

  subtitle().height(0);

  yield* all(
    displaySubItem(
      0,
      "Rust data structures are exposed via PyO3\nas Python classes contained in a native module",
      3,
    ),
    displaySubItem(1, NOBREAK_SPACE, 3),
  );

  yield* beginSlide("summary_item_1");

  yield* all(
    displaySubItem(
      2,
      "In Python, these classes are wrapped in\nsome manner, so that docstrings,\ntype annotations, etc. can be provided",
      3,
    ),
  );

  yield* beginSlide("questions");

  titleTo = "Questions?";

  yield* all(
    hideSubItem(2, 2),
    hideSubItem(1, 2),
    hideSubItem(0, 2),
    title().text("_".repeat(titleTo.length), 1).to(titleTo, 1),
  );

  yield* beginSlide("next_scene");

  yield* all(
    title().text(NOBREAK_SPACE, 1, easeOutQuad),
    ...range(subItemCount).map((n) => hideSubItem(n, 2)),
  );
});

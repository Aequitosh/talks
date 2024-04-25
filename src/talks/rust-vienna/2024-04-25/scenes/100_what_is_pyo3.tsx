import { Code, CODE, LezerHighlighter, Layout, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import { DEFAULT, all, beginSlide, chain, createRef, createRefArray, range, easeOutQuad } from "@motion-canvas/core";
import { parser } from '@lezer/rust';

import { parser as pyParser } from '@lezer/python';

import { DEFAULT_COLOR_BACKGROUND, DEFAULT_FONT, NOBREAK_SPACE } from "./defaults";

Code.defaultHighlighter = new LezerHighlighter(parser);

const PythonHighlighter = new LezerHighlighter(pyParser);

export default makeScene2D(function*(view) {
  view.fill(DEFAULT_COLOR_BACKGROUND)

  const baseLayout = createRef<Layout>();
  const innerLayout = createRef<Layout>();

  const title = createRef<Txt>();
  let titleTo = "Expectations";

  const subItems = createRefArray<Txt>();

  view.add(
    <Layout
      ref={baseLayout}
      fontFamily={DEFAULT_FONT}
      width={"80%"}
      height={"60%"}
      direction={"row"}
      alignItems={"center"}
      layout
    >
      <Rect
        ref={innerLayout}
        width={"100%"}
        direction={"column"}
        alignItems={"start"}
        layout
      >
        <Txt
          ref={title}
          width={"100%"}
          fontSize={120}
          fill={"white"}
        />
        {range(5).map(() => (
          <Txt
            ref={subItems}
            fontSize={65}
            fill={"white"}
          />
        ))}
      </Rect>
    </Layout>
  );

  title().height(baseLayout().height() * 0.25);

  // Helpers for items below title

  const displaySubItem = function*(index: number, text: string, totalDuration: number = 2.0) {
    yield* chain(
      subItems[index].height(baseLayout().height() * 0.2, totalDuration * 0.25),
      subItems[index].text(text, totalDuration * 0.75),
    );
  };

  const hideSubItem = function*(index: number, totalDuration: number = 2.0) {
    yield* chain(
      subItems[index].text("", totalDuration * 0.25),
      subItems[index].height(0, totalDuration * 0.75),
    );
  }

  // Expectations

  yield* beginSlide("expectations");

  yield* all(
    title().opacity(1, 1),
    title().text("_".repeat(titleTo.length), 1).to(titleTo, 1.5),
  );

  yield* beginSlide("expect_item_1");

  yield* all(
    displaySubItem(0, " "),  // cheap placeholder for gap lmao
    displaySubItem(1, " * show PyO3 & its inner workings"),
  );

  yield* beginSlide("expect_item_2");

  yield* displaySubItem(2, " * not a tutorial");

  yield* beginSlide("expect_item_3");

  yield* displaySubItem(3, " * open source & contributing");


  // What is PyO3?

  yield* beginSlide("what_is_pyo3");

  titleTo = "What is PyO3?";

  yield* all(
    ...range(4).map(n => (
      hideSubItem(n)
    )),
    chain(
      title().text(titleTo, 3),
    )
  );

  yield* beginSlide("its_elegant");

  const codeShowcaseRef = createRef<Code>();

  const codePrelude = CODE`\
use pyo3::prelude::*;

`;

  const codeModule = CODE`\
#[pymodule]
fn my_library(m: &Bound<'_, PyModule>) -> PyResult<()> {
    Ok(())
}`;

  const codeFunction = CODE`\
#[pyfunction]
fn hello_world() -> String {
    String::from("Hello World!")
}

`;

  const codeModuleFunction = CODE`\
    m.add_function(wrap_pyfunction!(hello_world, m)?)?;

`;

  const codeClass = CODE`\
#[pyclass]
struct MyClass {
    #[pyo3(get)]
    num: i32,
}

`;

  const codeModuleClass = CODE`\
    m.add_class::<MyClass>()?;

`;

  yield* chain(
    title().text(NOBREAK_SPACE, 1.5, easeOutQuad),
    title().height(0, 0),
  );

  innerLayout().add(
    <Code
      ref={codeShowcaseRef}
      fontSize={36}
    />
  );

  yield* beginSlide("show_prelude");

  yield* codeShowcaseRef().code.insert([0, 0], codePrelude, 0.6);

  yield* beginSlide("show_module");

  yield* codeShowcaseRef().code.insert([2, 0], codeModule, 0.6);

  yield* beginSlide("show_function");

  yield* codeShowcaseRef().code.insert([2, 0], codeFunction, 0.6);

  yield* beginSlide("show_module_function");

  yield* codeShowcaseRef().code.insert([9, 0], codeModuleFunction, 0.6);

  yield* beginSlide("show_class");

  yield* codeShowcaseRef().code.insert([7, 0], codeClass, 0.6);

  yield* beginSlide("show_module_class");

  yield* codeShowcaseRef().code.insert([17, 0], codeModuleClass, 0.6);

  // Interacting with Python objects

  yield* beginSlide("it_can_interact_with_python_objects");

  yield* codeShowcaseRef().code('', 0.6);

  const codeCompPython = CODE`\
def example():
    x = []
    x.append(1)
    y = x
    del x`;

  const codeCompRust = CODE`\
use pyo3::prelude::*;
use pyo3::types::PyList;

fn example<'py>(py: Python<'py>) -> PyResult<()> {
    let x: Bound<'py, PyList> = PyList::empty_bound(py);
    x.append(1)?;
    let y: Bound<'py, PyList> = x.clone();
    drop(x);
    Ok(())
}`;

  const codeCompRustClean = CODE`\
use pyo3::prelude::*;
use pyo3::types::PyList;

fn example(py: Python<'_>) -> PyResult<()> {
    let x = PyList::empty_bound(py);
    x.append(1)?;
    let y = x.clone();
    drop(x);
    Ok(())
}`;

  const codeCompPythonAligned = CODE`\



def example():
    x = []
    x.append(1)
    y = x
    del x`;

  const codeCompLayoutRef = createRef<Rect>();
  const codePythonRef = createRef<Code>();
  const codeRustRef = createRef<Code>();

  view.add(
    <Rect
      ref={codeCompLayoutRef}
      justifyContent={"center"}
      width={"100%"}
      direction={"row"}
      columnGap={100}
      layout
    >
      <Code
        ref={codePythonRef}
        highlighter={PythonHighlighter}
      />
      <Code
        ref={codeRustRef}
      />
    </Rect>
  );

  yield* codePythonRef().code(codeCompPython, 1.0);

  yield* beginSlide("rust_equivalent");

  yield* chain(
    codePythonRef().code("", 0.6),
    codeRustRef().code(codeCompRust, 1.0),
  );

  yield* beginSlide("highlight_fancy_types");

  const selectionRanges = codeRustRef().findAllRanges(/python<'py>|bound<.*>/gi);

  yield* chain(
    ...range(selectionRanges.length).map(n => (
        codeRustRef().selection(selectionRanges.slice(0, n + 1), 0.6)
      )
    )
  );

  yield* beginSlide("highlight_lifetimes");

  yield* codeRustRef().selection(codeRustRef().findAllRanges("'py"), 0.6);

  yield* beginSlide("unhighlight");

  yield* codeRustRef().selection(DEFAULT, 0.6);

  yield* beginSlide("rust_equivalent_clean");

  yield* codeRustRef().code(codeCompRustClean, 1.5);

  yield* beginSlide("final_comparison");

  codePythonRef().opacity(0);

  yield* chain(
    codePythonRef().code(codeCompPythonAligned, 0.6),
    codePythonRef().opacity(1, 0.6),
  );

  yield* beginSlide("summary");

  yield* all(
    codeRustRef().opacity(0, 1),
    codePythonRef().opacity(0, 1),
  );

  codePythonRef().code("");
  codeRustRef().code("");

  yield* chain(
    title().height(DEFAULT, 0),
    title().text("_".repeat("Summary".length), 1),
    title().text("Summary", 1.5),
  );

  yield* beginSlide("summary_item_1");

  yield* all(
    displaySubItem(0, " "),  // placeholder for gap
    displaySubItem(1, " * idiomatic"),
  );

  yield* beginSlide("summary_item_1_more");

  yield* displaySubItem(1, " * idiomatic, ergonomic", 1.5);

  yield* beginSlide("summary_item_1_even_more");

  yield* displaySubItem(1, " * idiomatic, ergonomic, economic", 1);

  yield* beginSlide("summary_item_2");

  yield* displaySubItem(2, " * safe API abstractions");

  yield* beginSlide("summary_item_2_proc_macros");

  yield* displaySubItem(2, " * safe API abstractions\n -> proc macros", 1);

  yield* beginSlide("summary_item_2_primitives");

  yield* displaySubItem(2, " * safe API abstractions\n -> smart pointers", 1);

  yield* beginSlide("summary_item_2_back");

  yield* displaySubItem(2, " * safe API abstractions", 1);

  yield* beginSlide("next_scene");

  yield* chain(
    all(
      ...range(4).map(n => (
        hideSubItem(n)
      )),
    ),
    chain(
      title().text(NOBREAK_SPACE, 1.5, easeOutQuad),
      title().height(0, 0),
    ),
  );

})

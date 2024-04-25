import { Code, CODE, LezerHighlighter, Layout, makeScene2D, Rect, Txt, lines } from "@motion-canvas/2d";
import { DEFAULT, all, beginSlide, chain, createRef, createRefArray, range, easeOutQuad, waitFor } from "@motion-canvas/core";
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
  let titleTo = "PyO3 and Open Source";

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
            textWrap={true}
            width={"80%"}
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

  // PyO3 and Open Source

  yield* beginSlide("open_source");

  title().opacity(0);

  yield* all(
    title().opacity(1, 1),
    title().text("_".repeat(titleTo.length), 1).to(titleTo, 1.5),
  );

  yield* beginSlide("who_uses_pyo3");

  yield* chain(
    title().text("Open Source:", 1),
    title().text("Open Source:\nWho uses PyO3?", 1),
  );

  yield* beginSlide("who_uses_pyo3_list");

  const listItems = createRefArray<Txt>();
  const listItemDescs = createRefArray<Txt>();

  view.add(
    <Layout
      width={"90%"}
      height={"75%"}
      justifyContent={"space-between"}
      fontFamily={DEFAULT_FONT}
      fontSize={55}
      layout
    >
      <Rect
        direction={"column"}
        width={"40%"}
        gap={75}
        layout
      >
        {range(6).map(() => (
          <Txt
            ref={listItems}
            fill={"white"}
            opacity={0}
          />
        ))}
      </Rect>
      <Rect
        direction={"column"}
        width={"60%"}
        gap={75}
        layout
      >
        {range(6).map(() => (
          <Txt
            ref={listItemDescs}
            fill={"white"}
            opacity={0}
          />
        ))}
      </Rect>
    </Layout>
  );

  yield* title().text("", 1, easeOutQuad);

  const displayListItem = function*(index: number, name: string, desc: string) {
    yield* chain(
      all(
        listItems[index].opacity(1, 1),
        listItems[index].text(name, 1),
      ),
      all(
        listItemDescs[index].opacity(1, 1),
        listItemDescs[index].text(desc, 1),
      ),
    );
  }

  yield* beginSlide("list_0_polars");

  yield* displayListItem(0, "polars", "multi-threaded DataFrames");

  yield* beginSlide("list_1_orjson");

  yield* displayListItem(1, "orjson", "extremely fast JSON library");

  yield* beginSlide("list_2_tokenizers");

  yield* displayListItem(2, "tokenizers", "bindings to HF's tokenizers");

  yield* beginSlide("list_3_wasmer_python");

  yield* displayListItem(3, "wasmer-python", "run WebAssembly binaries");

  yield* beginSlide("list_4_datafusion");

  yield* displayListItem(4, "datafusion-python", "bindings for DataFusion");

  yield* beginSlide("list_5_cryptography");

  yield* displayListItem(5, "cryptography", "cryptographic primitives");

  yield* beginSlide("pyo3_contributing");

  yield* all(
    chain(...listItems.map(i => i.opacity(0, 0.25)).reverse()),
    chain(...listItemDescs.map(i => i.opacity(0, 0.25))),
  );

  title().opacity(0);

  yield* all(
    title().opacity(1, 1),
    title().text("How I ended up\nas a contributor", 1),
  );

  yield* beginSlide("ceph_dashboard");

  yield* all(
    displaySubItem(0, " "),  // gap
    displaySubItem(1, " "),  // another gap (yeah I'm lazy)
    displaySubItem(2, "Post in Proxmox Forum"),
  );

  yield* beginSlide("ceph_dashboard_broke");

  yield* displaySubItem(2, "Turns out, the Ceph Dashboard broke");

  yield* beginSlide("ceph_dashboard_subinterpreters");

  yield* displaySubItem(2, "Reason: PyO3 doesn't support CPython's sub-interpreters");

  yield* beginSlide("ceph_dashboard_fixed");

  yield* displaySubItem(2, "The Dashboard got fixed eventually, but ...");

  yield* beginSlide("subinterpreters");

  yield* chain(
    all(
      ...subItems.map(i => i.text("", 1.5)),
      ...subItems.map(i => i.height(0, 1.5)),
      ...subItems.map(i => i.opacity(0, 1.5)),
    ),
    chain(
      title().text("Python", 0.75),
      title().text("Python\nSubinterpreters", 0.75),
    ),
  );

  yield* beginSlide("what_are_subinterpreters");

  subItems.map(i => i.opacity(1));

  yield* all(
    displaySubItem(0, " "),  // gap
    displaySubItem(1, " "),  // another gap (yeah I'm lazy)
    displaySubItem(2, "Run multiple interpreters in the same process"),
  );

  yield* beginSlide("since_when");

  yield* displaySubItem(2, "Exist since Python 1.5");

  yield* beginSlide("since_when_exactly");

  yield* displaySubItem(2, "Exist since Python 1.5 (1997)");

  yield* beginSlide("pyo3_not_supported");

  yield* displaySubItem(2, "Not supported in PyO3, for now");

  yield* beginSlide("why_care");

  yield* chain(
    displaySubItem(2, ""),
    title().text("", 1),
    all(...subItems.map(i => i.height(0, 0.5))),
    title().text("But why are\nsubinterpreters\nimportant?", 2.5),
  );

  yield* beginSlide("gil_removal");

  let prevFontSize = title().fontSize();

  yield* chain(
    title().text("", 2.5),
    title().fontSize(200, 0),
    title().text("Removing\nthe GIL", 4.0),
  );

  yield* beginSlide("subinterpreters_and_pyo3");

  yield* chain(
    title().text("", 3.0, easeOutQuad),
    title().fontSize(prevFontSize, 0),
    title().text("Supporting\nsubinterpreters\nin PyO3", 2.5),
  );

  yield* beginSlide("tracking_issue");

  yield* chain(
    title().text("", 1.8, easeOutQuad),
    title().text("Tracking\nIssue", 1.25),
  );

  yield* all(
    subItems[2].fontSize(70, 0),
    displaySubItem(0, " "),
    displaySubItem(1, " "),
    displaySubItem(2, "PyO3 GitHub: #3451"),
  );

  yield* beginSlide("next_scene");

  yield* chain(
    displaySubItem(2, ""),
    all(...subItems.map(i => i.height(0, 1))),
    title().text("", 2, easeOutQuad),
  );

});

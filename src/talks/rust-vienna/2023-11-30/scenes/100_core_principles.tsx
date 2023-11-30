import { Layout, Txt } from "@motion-canvas/2d";
import {
  CodeBlock,
  insert,
  edit,
  lines,
  range as codeRange,
  remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
  beginSlide,
  createRef,
  createRefArray,
  DEFAULT,
  Direction,
  easeOutQuad,
  range,
  slideTransition,
} from "@motion-canvas/core";
import { all, chain, waitFor } from "@motion-canvas/core/lib/flow";
import { DEFAULT_COLOR_BACKGROUND } from "./defaults";
import { zip } from "../util/functions";

export default makeScene2D(function* (view) {
  view.fill(DEFAULT_COLOR_BACKGROUND);

  let titleLayout = createRef<Layout>();
  const titleRows = createRefArray<Txt>();

  view.add(
    <Layout ref={titleLayout} direction={"column"} alignSelf={"center"} layout>
      <Txt
        ref={titleRows}
        fontFamily={"JetBrains Mono"}
        fontSize={82}
        fill={"white"}
        justifyContent={"center"}
      />
    </Layout>,
  );

  const baseLayout = createRef<Layout>();
  const rows = createRefArray<Layout>();

  const codeExampleTitle = createRef<Txt>();
  const codeExample = createRef<CodeBlock>();

  view.add(
    <Layout ref={baseLayout} direction={"column"} size={"80%"} layout />,
  );

  baseLayout().add(
    range(5).map((_) => (
      <Layout
        ref={rows}
        direction={"row"}
        alignItems={"center"}
        size={"100%"}
        layout
      />
    )),
  );

  view.add(
    <Layout direction={"column"} alignItems={"center"} size={"100%"} layout>
      <Txt
        ref={codeExampleTitle}
        fontFamily={"JetBrains Mono"}
        fontSize={64}
        padding={[75, 0]}
        fill={"white"}
      />
      <CodeBlock
        ref={codeExample}
        fontFamily={"JetBrains Mono"}
        fontSize={50}
        language={"rust"}
        opacity={0}
        code={``}
      />
    </Layout>,
  );

  yield* slideTransition(Direction.Left, 1);

  const titleParts = ["core principles", "of async rust"];

  titleLayout().add(
    titleParts.map((_) => (
      <Txt
        ref={titleRows}
        fontFamily={"JetBrains Mono"}
        fontSize={82}
        fill={"white"}
        justifyContent={"center"}
      />
    )),
  );

  yield* all(
    ...zip(titleRows, titleParts).map(([row, part], i) =>
      row.text(part, 1.5 + 0.25 * (i + 1)),
    ),
  );

  yield* beginSlide("futures_title");

  yield* all(...titleRows.map((t) => all(t.text("", 1))));

  yield* all(titleRows[0].text("the Future trait", 1));

  yield* beginSlide("futures_simple");

  yield* all(titleRows[0].text("", 0.5));

  yield* waitFor(1);

  yield codeExample().code(`pub trait Future {
    type Output;
    fn poll(&mut self, wake: fn()) -> Poll<Self::Output>;
}

pub enum Poll<T> {
    Ready(T),
    Pending,
}`);

  yield* all(
    codeExampleTitle().text("the Future trait", 1),
    chain(waitFor(0.25), codeExample().opacity(1, 1)),
  );

  yield* beginSlide("futures_simple_output");
  yield* codeExample().selection(lines(1), 1);

  yield* beginSlide("futures_poll_fn");
  yield* codeExample().selection(lines(2), 1);

  yield* beginSlide("futures_poll_enum");
  yield* codeExample().selection(
    [...codeRange(2, 38, 2, 56), ...lines(5, 8)],
    1,
  );

  yield* beginSlide("futures_wake");
  yield* codeExample().selection(codeRange(2, 23, 2, 33), 1);

  yield* beginSlide("futures_clear_selection");
  yield* codeExample().selection(DEFAULT, 2);

  yield* beginSlide("futures_std");
  // NOTE: the edit()s below contain significant whitespace at the end of fn poll()!
  yield* all(
    codeExampleTitle().text("the actual Future trait", 2.0),
    chain(
      codeExample().fontSize(42, 0.65),

      codeExample().edit(1.25, false)`pub trait Future {
    type Output;
    fn poll(${insert(`self: Pin<`)}&mut ${edit(`s`, `S`)}elf${insert(
      `>`,
    )}, wake: fn()) -> Poll<Self::Output>;${insert(`      `)}
}

pub enum Poll<T> {
    Ready(T),
    Pending,
}${insert(`

#[repr(transparent)]
pub struct Pin<P> { /* private fields */ }`)}`,

      codeExample().fontSize(36, 0.65),

      codeExample().edit(1.25, false)`pub trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, ${edit(
      `wake: fn()`,
      `cx: &mut Context<'_>`,
    )}) -> Poll<Self::Output>;      
}

pub enum Poll<T> {
    Ready(T),
    Pending,
}

#[repr(transparent)]
pub struct Pin<P> { /* private fields */ }${insert(`

pub struct Context<'a> { /* private fields */ }`)}`,
    ),
  );

  yield* beginSlide("futures_context");
  yield* codeExample().edit(1, false)`pub trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;      
}

pub enum Poll<T> {
    Ready(T),
    Pending,
}

#[repr(transparent)]
pub struct Pin<P> { /* private fields */ }

pub struct Context<'a> { /* private fields */ }${insert(
    `  // only used to notify executor atm`,
  )}`;

  yield* beginSlide("futures_pin");
  yield* codeExample().edit(1, false)`pub trait Future {
    type Output;
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;      
}

pub enum Poll<T> {
    Ready(T),
    Pending,
}

#[repr(transparent)]
pub struct Pin<P> { /* private fields */ }${insert(`  // ¯\\_(ツ )_/¯`)}

pub struct Context<'a> { /* private fields */ }  // only used to notify executor atm`;

  yield* beginSlide("async_await");

  yield* all(
    codeExample().opacity(0, 0.75),
    codeExampleTitle().text("", 1),
    titleRows[0].text("async / .await", 1),
  );

  yield* beginSlide("async_fn");
  yield* all(...titleRows.map((t) => t.text("", 0.5)));

  yield* waitFor(1);

  yield codeExample().code(`async fn give_answer() -> u8 { 42 }`);
  yield* codeExample().fontSize(50, 0);

  yield* all(
    codeExampleTitle().text("async / .await", 1),
    chain(waitFor(0.25), codeExample().opacity(1, 1)),
  );

  yield* beginSlide("async_fn_keyword");
  yield* codeExample().selection(codeRange(0, 0, 0, 5), 1);

  yield* beginSlide("async_await_clear_selection");
  yield* codeExample().selection(DEFAULT, 2);

  yield* beginSlide("async_fn_desugared");
  yield* codeExample().edit(3.5, false)`${remove(
    `async `,
  )}fn give_answer() -> ${edit(`u8`, `impl Future<Output = u8>`)} {${edit(
    ` 42 `,
    `
    GiveAnswerFuture {}
`,
  )}}`;
  yield* codeExample().edit(
    0.5,
    false,
  )`fn give_answer() -> impl Future<Output = u8> {
    GiveAnswerFuture {}
}${insert(`

struct GiveAnswerFuture;`)}`;

  yield* beginSlide("async_fn_desugared_impl");
  yield* codeExample().edit(
    1,
    false,
  )`fn give_answer() -> impl Future<Output = u8> {
    GiveAnswerFuture {}
}

struct GiveAnswerFuture;${insert(`

impl Future for GiveAnswerFuture {
    // ...
}`)}`;

  yield* codeExample().edit(
    1,
    false,
  )`fn give_answer() -> impl Future<Output = u8> {
    GiveAnswerFuture {}
}

struct GiveAnswerFuture;

impl Future for GiveAnswerFuture {${insert(`
    type Output = u8;`)}${insert(`
`)}
    // ...
}`;

  yield* codeExample().fontSize(36, 1);
  yield* codeExample().edit(
    2,
    false,
  )`fn give_answer() -> impl Future<Output = u8> {
    GiveAnswerFuture {}
}

struct GiveAnswerFuture;

impl Future for GiveAnswerFuture {
    type Output = u8;
${insert(`
`)}${insert(
    `    fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {`,
  )}
    ${insert(`    `)}// ...${insert(`
`)}${insert(`    }`)}
}`;

  yield* beginSlide("async_fn_desugared_final");
  yield* codeExample().edit(
    1,
    false,
  )`fn give_answer() -> impl Future<Output = u8> {
    GiveAnswerFuture {}
}

struct GiveAnswerFuture;

impl Future for GiveAnswerFuture {
    type Output = u8;

    fn poll(self: Pin<&mut Self>, _cx: &mut Context<'_>) -> Poll<Self::Output> {
        ${edit(`// ...`, `Poll::Ready(42)`)}
    }
}`;

  const awaitText = createRef<Txt>();

  view.add(
    <Txt
      ref={awaitText}
      fontFamily={"JetBrains Mono"}
      fontSize={36}
      fill={"white"}
      position={[401, 318]}
    />,
  );

  yield* beginSlide("await_keyword");
  yield* awaitText().text(".await just calls Future::poll()\n", 1);

  yield* beginSlide("await_disclaimer");
  yield* awaitText().text(
    ".await just calls Future::poll()\n(among other things)",
    1,
  );

  yield* beginSlide("next_scene");
  yield* all(
    codeExample().opacity(0, 1, easeOutQuad),
    chain(waitFor(0.25), codeExampleTitle().text("", 2, easeOutQuad)),
    chain(waitFor(0.5), awaitText().text("", 2, easeOutQuad)),
  );
});

import {
  Layout,
  Txt,
  Rect,
  Img,
  Code,
  LezerHighlighter,
  CODE,
  lines,
  Circle,
  Line,
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
  easeInQuart,
  easeInOutQuart,
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

  // TODO: adapt this further: "Using blanket implementations to your advantage"
  // --> usually "restrictive" because reasons (which?)
  // --> but every restriction is something we can use to our benefit

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
    />,
  );

  const codeExample = createRef<Code>();
  const codeMarginTop = createSignal<number>(25);
  const codeMarginLeft = createSignal<number>(0);

  const modifyMarginTop = (offset: number) =>
    codeMarginTop(codeMarginTop() + offset);
  const modifyMarginLeft = (offset: number) =>
    codeMarginLeft(codeMarginLeft() + offset);

  codeLayout().add(
    <Code
      ref={codeExample}
      code={""}
      marginTop={() => vh(codeMarginTop())}
      marginLeft={() => vw(codeMarginLeft())}
    />,
  );

  const annotationRef = createRef<Txt>();
  const annotationOffsetX = createSignal<number>(0);
  const annotationOffsetY = createSignal<number>(0.66);

  const modifyAnnotationOffsetX = (offset: number) =>
    annotationOffsetX(annotationOffsetX() + offset);
  const modifyAnnotationOffsetY = (offset: number) =>
    annotationOffsetY(annotationOffsetY() + offset);

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
    />,
  );

  // Because I'm too lazy to layout stuff properly
  for (const ref of textFieldRefs.mapRefs((ref) => ref)) {
    ref.text(NOBREAK_SPACE);
  }

  let nextTitle = "Using Blanket Impls";

  const title = textFieldRefs.title;
  title().textWrap(false);

  yield* typewriterTransition(title().text, nextTitle, 1);

  yield* beginSlide("blanket_impl_beginning");

  yield* chain(title().fontSize(rem(3), 0.6, easeInOutBack));

  let exampleCode = CODE`\
impl<T: Foo> SomeTrait for T {
    // [...]
}`;

  let annotationText = "";

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("blanket_impls_another");

  exampleCode = CODE`\
impl<T: Foo> SomeTrait for T {
    // [...]
}

impl<T: Bar> SomeTrait for T {
    // [...]
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  annotationText = "Blanket impls could potentially overlap!";

  modifyAnnotationOffsetY(45);

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("blanket_impls_source");

  annotationText =
    'What follows is adapted from:\n\nLiebow-Feeser, Joshua. "Safety in an Unsafe World."\nTalk, RustConf 2024';

  yield* all(
    codeExample().code("", 1, easeInOutBack),
    annotationRef().text("", 0.6, easeInOutQuad),
  );

  annotationOffsetY(0);

  yield* annotationRef().text(annotationText, 1.6, easeInOutQuad);

  yield* beginSlide("directed_acyclic_graph_intro");

  yield* annotationRef().text("", 0.6, easeInOutQuad);

  yield* beginSlide("dag_visual");

  const graphLayoutRef = createRef<Layout>();
  const graphNodeRefs = createRefMap<Circle>();

  view.add(
    <Layout ref={graphLayoutRef}>
      <Circle ref={graphNodeRefs.one} fill={"white"} x={vw(-40)} y={vh(-20)} />
      <Circle ref={graphNodeRefs.two} fill={"white"} x={vw(-35)} y={vh(25)} />
      <Circle
        ref={graphNodeRefs.three}
        fill={"white"}
        x={vw(-15)}
        y={vh(-15)}
      />
      <Circle ref={graphNodeRefs.four} fill={"white"} x={vw(10)} y={vh(-22)} />
      <Circle ref={graphNodeRefs.five} fill={"white"} x={vw(5)} y={vh(5)} />
      <Circle ref={graphNodeRefs.six} fill={"white"} x={vw(-2)} y={vh(35)} />
      <Circle ref={graphNodeRefs.seven} fill={"white"} x={vw(30)} y={vh(0)} />
    </Layout>,
  );

  [
    ...graphNodeRefs.mapRefs((ref) => {
      graphLayoutRef().add(
        <Circle
          fill={DEFAULT_COLOR_BACKGROUND}
          position={() => ref.position()}
          size={() => ref.size().mul(0.8)}
        />,
      );
    }),
  ];

  const graphLineRefs = createRefMap<Line>();

  graphLayoutRef().add(
    <>
      <Line
        ref={graphLineRefs.a}
        points={() => [
          graphNodeRefs.one().middle(),
          graphNodeRefs.two().middle(),
        ]}
        endOffset={() => graphNodeRefs.two().height() * 0.5}
      />
      <Line
        ref={graphLineRefs.b}
        points={() => [
          graphNodeRefs.one().middle(),
          graphNodeRefs.three().middle(),
        ]}
        endOffset={() => graphNodeRefs.three().height() * 0.5}
      />
      <Line
        ref={graphLineRefs.c}
        points={() => [
          graphNodeRefs.two().middle(),
          graphNodeRefs.six().middle(),
        ]}
        endOffset={() => graphNodeRefs.six().height() * 0.5}
      />
      <Line
        ref={graphLineRefs.d}
        points={() => [
          graphNodeRefs.three().middle(),
          graphNodeRefs.four().middle(),
        ]}
        endOffset={() => graphNodeRefs.four().height() * 0.5}
      />
      <Line
        ref={graphLineRefs.e}
        points={() => [
          graphNodeRefs.three().middle(),
          graphNodeRefs.five().middle(),
        ]}
        endOffset={() => graphNodeRefs.five().height() * 0.5}
      />
      <Line
        ref={graphLineRefs.f}
        points={() => [
          graphNodeRefs.six().middle(),
          graphNodeRefs.five().middle(),
        ]}
        endOffset={() => graphNodeRefs.five().height() * 0.5}
      />
      <Line
        ref={graphLineRefs.g}
        points={() => [
          graphNodeRefs.four().middle(),
          graphNodeRefs.seven().middle(),
        ]}
        endOffset={() => graphNodeRefs.seven().height() * 0.5}
      />
      <Line
        ref={graphLineRefs.h}
        points={() => [
          graphNodeRefs.five().middle(),
          graphNodeRefs.seven().middle(),
        ]}
        endOffset={() => graphNodeRefs.seven().height() * 0.5}
      />
    </>,
  );

  [
    ...graphLineRefs.mapRefs((ref, _index) => {
      ref.stroke("white");
      ref.zIndex(-100);
      ref.lineWidth(rem(0.5));
      ref.arrowSize(rem(1.1));
      ref.endArrow(true);
      ref.end(0);
    }),
  ];

  yield* all(
    ...graphNodeRefs.mapRefs((ref, index) =>
      chain(waitFor(index * 0.1), ref.size(rem(5), 0.5, easeInOutQuart)),
    ),
    ...graphLineRefs.mapRefs((ref, index) =>
      chain(waitFor(index * 0.1), ref.end(1, 1, easeInOutQuart)),
    ),
  );

  yield* beginSlide("dag_code_traits");

  yield* all(
    ...graphLineRefs.mapRefs((ref, index) =>
      chain(waitFor(index * 0.1), ref.end(0, 1, easeInOutQuart)),
    ),
    ...graphNodeRefs.mapRefs((ref, index) =>
      chain(waitFor(index * 0.1), ref.size(0, 0.5, easeInOutQuart)),
    ),
  );

  exampleCode = CODE`\
trait After<T> {}
trait Before<T> {}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("dag_blanket_impl");

  exampleCode = CODE`\
trait After<T> {}
trait Before<T> {}

impl<A, B: After<A>> Before<B> for A {}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("dag_definition");

  exampleCode = CODE`\
trait After<T> {}
trait Before<T> {}

impl<A, B: After<A>> Before<B> for A {}

struct FirstNode;
struct SecondNode;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);
  yield* codeExample().margin([vh(15), 0, 0, 0], 0.5, easeInOutBack);

  yield* beginSlide("dag_definition_arrow");

  exampleCode = CODE`\
trait After<T> {}
trait Before<T> {}

impl<A, B: After<A>> Before<B> for A {}

struct FirstNode;
struct SecondNode;

impl After<FirstNode> for SecondNode {}
impl<N: Before<FirstNode>> After<N> for SecondNode {}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("dag_definition_with_macro");

  exampleCode = CODE`\
trait After<T> {}
trait Before<T> {}

impl<A, B: After<A>> Before<B> for A {}

macro_rules! impl_after {
    ($A:ty => $B:ty) => {
        impl After<$A> for $B {}
        impl<N: Before<$A>> After<N> for $B {}
    };
}

impl_after!(FirstNode => SecondNode);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("dag_compile_fail");

  exampleCode = CODE`\
impl_after!(FirstNode => SecondNode);
impl_after!(SecondNode => ThirdNode);
impl_after!(ThirdNode => FirstNode);`;

  annotationText = "<- compile error!";

  yield* all(
    codeExample().code(exampleCode, 1, easeInOutBack),
    codeExample().margin([vh(25), 0, 0, 0], 0.5, easeInOutBack),
  );

  modifyAnnotationOffsetY(12);
  modifyAnnotationOffsetX(60);

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("mutex_ordering_rename_before");

  exampleCode = CODE`\
trait After<T> {}
trait Before<T> {}

impl<A, B: After<A>> Before<B> for A {}

macro_rules! impl_after {
    ($A:ty => $B:ty) => {
        impl After<$A> for $B {}
        impl<N: Before<$A>> After<N> for $B {}
    };
}

impl_after!(FirstNode => SecondNode);`;

  yield* all(
    annotationRef().text("", 0.6, easeInOutQuad),
    codeExample().code(exampleCode, 1, easeInOutBack),
    codeExample().margin([vh(15), 0, 0, 0], 0.5, easeInOutBack),
  );

  yield* beginSlide("mutex_ordering_rename_after");

  exampleCode = CODE`\
trait LockAfter<T> {}
trait LockBefore<T> {}

impl<A, B: LockAfter<A>> LockBefore<B> for A {}

macro_rules! impl_lock_after {
    ($A:ty => $B:ty) => {
        impl LockAfter<$A> for $B {}
        impl<N: LockBefore<$A>> LockAfter<N> for $B {}
    };
}

impl_lock_after!(FirstLock => SecondLock);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("mutex_definition");

  exampleCode = CODE`\
struct Mutex<Id, T> {
    inner: std::sync::Mutex<T>,
    _marker: PhantomData<Id>,
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("lock_ctx_definition");

  exampleCode = CODE`\
struct Mutex<Id, T> {
    inner: std::sync::Mutex<T>,
    _marker: PhantomData<Id>,
}

struct LockCtx<Id>(PhantomData<Id>);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("mutex_fn_lock");

  exampleCode = CODE`\
impl<Id, T> Mutex<Id, T> {
    fn lock<L>(
        &self,
        ctx: &mut LockCtx<L>
    ) -> (MutexGuard<'_, T>, LockCtx<Id>)
    where
        L: LockBefore<Id>,
    {
        (
            self.inner.lock().unwrap(),
            LockCtx(PhantomData),
        )
    }
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("mutex_fn_lock_ctx");

  yield* codeExample().selection(lines(3), 0.6, easeInOutQuad);

  yield* beginSlide("mutex_fn_lock_require_before");

  yield* codeExample().selection(
    [
      ...codeExample().findAllRanges(/Id/g).slice(0, 2),
      ...codeExample().findAllRanges(/L/g).slice(0, 1),
      ...codeExample().findAllRanges(/L/g).slice(2, 3),
      codeExample().findFirstRange(/L:.*<Id>/g),
    ],
    0.6,
    easeInOutQuad,
  );

  yield* beginSlide("mutex_fn_lock_return_current_id");

  yield* codeExample().selection(
    [
      ...codeExample().findAllRanges(/Id/g).slice(0, 2),
      codeExample().findLastRange(/LockCtx<Id>/g),
    ],
    0.6,
    easeInOutQuad,
  );

  yield* beginSlide("starting_node");

  exampleCode = CODE`\
enum Unlocked {}

impl LockCtx<Unlocked> {
    const UNLOCKED: LockCtx<Unlocked> 
        = LockCtx(PhantomData);
}`;

  yield* codeExample().selection(DEFAULT, 0.6, easeInOutQuad);

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("scenario_start");

  exampleCode = CODE`\
static FOO: Mutex<Foo, FooState> = Mutex::new(...);
static BAR: Mutex<Bar, BarState> = Mutex::new(...);

enum Foo {}
enum Bar {}

impl_lock_after!(Unlocked => Foo);
impl_lock_after!(Foo => Bar);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("scenario_highlight_macros");

  yield* codeExample().selection(
    codeExample().findAllRanges(/impl_lock_after.*/g),
    0.6,
    easeInOutQuad,
  );

  yield* beginSlide("scenario_thread_a_ctx");

  yield* codeExample().selection(DEFAULT, 0.6, easeInOutQuad);

  exampleCode = CODE`\
impl_lock_after!(Unlocked => Foo);
impl_lock_after!(Foo => Bar);

// Thread A
let mut ctx = LockCtx::UNLOCKED;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("scenario_thread_a_first");

  exampleCode = CODE`\
impl_lock_after!(Unlocked => Foo);
impl_lock_after!(Foo => Bar);

// Thread A
let mut ctx = LockCtx::UNLOCKED;
let (foo, mut ctx) = FOO.lock(&mut ctx);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("scenario_thread_a_second");

  exampleCode = CODE`\
impl_lock_after!(Unlocked => Foo);
impl_lock_after!(Foo => Bar);

// Thread A
let mut ctx = LockCtx::UNLOCKED;
let (foo, mut ctx) = FOO.lock(&mut ctx);
let (bar, mut ctx) = BAR.lock(&mut ctx);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("scenario_thread_b_ctx");

  exampleCode = CODE`\
impl_lock_after!(Unlocked => Foo);
impl_lock_after!(Foo => Bar);

// Thread A
let mut ctx = LockCtx::UNLOCKED;
let (foo, mut ctx) = FOO.lock(&mut ctx);
let (bar, mut ctx) = BAR.lock(&mut ctx);

// Thread B
let mut ctx = LockCtx::UNLOCKED;`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("scenario_thread_b_first");

  exampleCode = CODE`\
impl_lock_after!(Unlocked => Foo);
impl_lock_after!(Foo => Bar);

// Thread A
let mut ctx = LockCtx::UNLOCKED;
let (foo, mut ctx) = FOO.lock(&mut ctx);
let (bar, mut ctx) = BAR.lock(&mut ctx);

// Thread B
let mut ctx = LockCtx::UNLOCKED;
let (bar, mut ctx) = BAR.lock(&mut ctx);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("scenario_thread_b_error");

  exampleCode = CODE`\
impl_lock_after!(Unlocked => Foo);
impl_lock_after!(Foo => Bar);

// Thread A
let mut ctx = LockCtx::UNLOCKED;
let (foo, mut ctx) = FOO.lock(&mut ctx);
let (bar, mut ctx) = BAR.lock(&mut ctx);

// Thread B
let mut ctx = LockCtx::UNLOCKED;
let (bar, mut ctx) = BAR.lock(&mut ctx);
let (foo, mut ctx) = FOO.lock(&mut ctx);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("scenario_thread_b_highlight_error");

  annotationText = "<- Won't compile!";

  modifyAnnotationOffsetX(5);
  modifyAnnotationOffsetY(50);

  yield* codeExample().selection(
    codeExample().findLastRange(/let .foo,.*/g),
    0.6,
    easeInOutQuad,
  );
  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("adapted_from_sources");

  yield* all(
    codeExample().selection(DEFAULT, 0.6, easeInOutQuad),
    annotationRef().text("", 0.6, easeInOutQuad),
  );

  exampleCode = CODE`\
lock_ordering`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  annotationText = "<- on crates.io";

  annotationOffsetY(0.66);
  annotationOffsetX(30);

  yield* annotationRef().text(annotationText, 0.6, easeInOutQuad);

  yield* beginSlide("originally_by");

  annotationText = "originally by Alex Konradi\ngithub.com/akonradi";

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

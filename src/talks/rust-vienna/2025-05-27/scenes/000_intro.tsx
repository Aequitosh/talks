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
import { parser } from "@lezer/rust";

import repoQRCode from "../assets/repo_qr_code.png";
import motionCanvasLogo from "../assets/motion_canvas.svg";

const codeStyle = HighlightStyle.define(monokaiDarkStyle);

Code.defaultHighlighter = new LezerHighlighter(parser, codeStyle);

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

  yield* beginSlide("chapter_intro");

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
      fontSize={rem(2)}
      direction={"row"}
      justifyContent={"start"}
      alignItems={"start"}
      columnGap={vw(10)}
      layout
    />,
  );

  const txtRef = createRef<Txt>();

  textLayout().add(
    <>
      <Txt ref={txtRef} text={NOBREAK_SPACE} fill={"white"} fontSize={rem(2)} />
    </>,
  );

  const codeRect = createRef<Rect>();
  const codeExample = createRef<Code>();

  codeLayout().add(
    <Rect ref={codeRect} radius={25} padding={25}>
      <Code ref={codeExample} code={""} />
    </Rect>,
  );

  const ringbufLayout = createRef<Rect>();
  const ringbufRect = createRef<Rect>();
  const ringbufItems = createRefArray<Rect>();
  const ringbufDescRect = createRef<Rect>();
  const ringbufDescItems = createRefArray<Rect>();

  view.add(
    <Rect
      ref={ringbufLayout}
      width={"90%"}
      height={"90%"}
      direction={"column"}
      layout
    >
      <Rect ref={ringbufRect} marginTop={vh(15)}>
        {range(7).map(() => (
          <Rect
            ref={ringbufItems}
            size={vh(15)}
            stroke={"#ccc"}
            lineWidth={vh(0.5)}
            alignItems={"center"}
            justifyContent={"center"}
            alignContent={"center"}
            layout
          >
            <Txt text={NOBREAK_SPACE} fontSize={rem(2)} fill={"white"} />
          </Rect>
        ))}
      </Rect>
      <Rect ref={ringbufDescRect}>
        {range(7).map(() => (
          <Rect
            ref={ringbufDescItems}
            size={vh(15)}
            justifyContent={"center"}
            alignContent={"center"}
            alignItems={"center"}
            direction={"column"}
            layout
          >
            <Txt text={NOBREAK_SPACE} fontSize={rem(2)} fill={"white"} />
            <Txt text={NOBREAK_SPACE} fontSize={rem(2)} fill={"white"} />
          </Rect>
        ))}
      </Rect>
    </Rect>,
  );

  ringbufItems.map((item) => item.opacity(0));
  ringbufDescItems.map((item) => item.opacity(0));

  yield* beginSlide("selfref_struct");

  let txtContents = "Imagine you have a self-referential struct ...";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  yield* beginSlide("ringbuffer");

  txtContents = "A stack-allocated ring buffer";

  range(0, 3).map((i) => {
    let txt = ringbufItems[i + 3].childAs<Txt>(0);
    txt.text((i + 3).toString());
    txt.opacity(0);
  });

  ringbufDescItems[3].childAs<Txt>(0).text("↑");
  ringbufDescItems[3].childAs<Txt>(1).text("tail");

  ringbufDescItems[5].childAs<Txt>(0).text("↑");
  ringbufDescItems[5].childAs<Txt>(1).text("head");

  yield* all(
    chain(
      chain(
        ...ringbufItems.map((item) => item.opacity(1, 0.25)),
        ...range(0, 3).map((i) =>
          ringbufItems[i + 3].childAs<Txt>(0).opacity(1, 0.25),
        ),
      ),
      txtRef().text(txtContents, 1, easeInOutQuad),
    ),
  );

  yield* beginSlide("ringbuffer_code");

  codeRect().margin([vh(40), 0, 0, 0]);
  codeExample().code("");

  let exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {

}`;

  let exampleCodeOther = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}`;

  yield* all(
    chain(
      codeExample().code(exampleCode, 1, easeInOutBack),
      codeExample().code(exampleCodeOther, 1, easeInOutBack),
    ),
  );

  yield* beginSlide("ringbuffer_highlight_pointers");

  yield* all(
    chain(
      codeRect().margin([vh(50), 0, 0, 0], 0.5),

      ...range(0, 3).map((i) => ringbufDescItems[i + 3].opacity(1, 0.25)),

      codeExample().selection(lines(3, 4), 0.5),
    ),
  );

  yield* beginSlide("ringbuffer_methods");

  yield* all(codeExample().selection(DEFAULT, 0.5));

  yield* all(
    ringbufLayout().opacity(0, 0.75),
    codeRect().margin([vh(10), 0, 0, 0], 1, easeInOutBack),
  );

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

impl<T, const CAPACITY: usize> RingBuf<T, CAPACITY> {

}`;

  exampleCodeOther = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

impl<T, const CAPACITY: usize> RingBuf<T, CAPACITY> {
    pub const fn new() -> Self { ... }
    pub const fn len(&self) -> usize { ... }
    pub fn push(&mut self, item: T) { ... }
    pub fn pop(&mut self) -> Option<T> { ... }
}`;

  yield* all(
    chain(
      codeExample().code(exampleCode, 0.5, easeInOutBack),
      codeExample().code(exampleCodeOther, 1, easeInOutBack),
    ),
  );

  yield* beginSlide("ringbuffer_usage");

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

// [...]`;

  yield* all(
    chain(
      codeExample().code(exampleCode, 0.75, easeInOutBack),
      codeExample().fontSize(rem(1.25), 0.75, easeInOutBack),
    ),
  );

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

// [...]

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();

  ringbuf.push(42);

  let item = ringbuf.pop();

  assert_eq!(item, Some(42));
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  yield* beginSlide("ringbuffer_move");

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

// [...]

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();

  // [...]

  let mut ringbuf_moved = ringbuf;  // semantic move!
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  yield* beginSlide("ringbuffer_move_println");

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

// [...]

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();

  // [...]

  let mut ringbuf_moved = ringbuf;
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

// [...]

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();

  // [...]

  println!("{:?}", &mut ringbuf as *mut _);

  let mut ringbuf_moved = ringbuf;

  println!("{:?}", &mut ringbuf_moved as *mut _);
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  yield* beginSlide("ringbuffer_move_println_output_1");

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

// [...]

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();

  // [...]

  println!("{:?}", &mut ringbuf as *mut _);
  // 0x7ffc73f60848

  let mut ringbuf_moved = ringbuf;

  println!("{:?}", &mut ringbuf_moved as *mut _);
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  yield* beginSlide("ringbuffer_move_println_output_2");

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}

// [...]

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();

  // [...]

  println!("{:?}", &mut ringbuf as *mut _);
  // 0x7ffc73f60848

  let mut ringbuf_moved = ringbuf;

  println!("{:?}", &mut ringbuf_moved as *mut _);
  // 0x7ffc73f60908
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  yield* beginSlide("how_to_address");

  txtContents = "Pinning a value in place";

  yield* all(
    chain(
      codeExample().code("", 1.25, easeInOutBack),
      typewriterTransition(txtRef().text, txtContents, 2),
    ),
  );

  yield* beginSlide("about_pinning_1");

  const txtItems = createRefArray<Txt>();

  textLayout().add(
    <>
      {range(3).map(() => (
        <Txt
          ref={txtItems}
          fill={"white"}
          fontSize={rem(3)}
          marginLeft={vw(5)}
        />
      ))}
    </>,
  );

  yield* txtItems[0].text(
    "1. Value may not be moved out of\nits memory location",
    2,
  );

  yield* beginSlide("about_pinning_2");

  yield* txtItems[1].text(
    "2. Value must remain valid at\nthat memory location",
    2,
  );

  yield* beginSlide("pin_usage");

  yield* all(chain(txtItems[1].text("", 1), txtItems[0].text("", 1)));

  exampleCode = CODE`\
fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();
}`;

  codeExample().fontSize(rem(1.8));

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  yield* beginSlide("pin_macro");

  exampleCode = CODE`\
use std::pin::pin;

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  exampleCode = CODE`\
use std::pin::pin;

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();

  let ringbuf_pin = pin!(ringbuf);
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  yield* beginSlide("pin_type");

  exampleCode = CODE`\
use std::pin::pin;

fn main() {
  let mut ringbuf: RingBuf<i32, 4> = RingBuf::new();

  let ringbuf_pin: Pin<&mut RingBuf<i32, 4>> = pin!(ringbuf);
}`;

  yield* all(codeExample().code(exampleCode, 1));

  yield* beginSlide("pin_type_highlight");

  yield* all(
    codeExample().selection(codeExample().findFirstRange(/Pin<.*>/g), 1),
  );

  yield* beginSlide("go_back_to_struct");

  exampleCode = CODE`\
struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}`;

  yield* all(
    chain(
      codeExample().selection(DEFAULT, 0.7),
      codeExample().code(exampleCode, 1, easeInOutBack),
    ),
  );

  yield* beginSlide("ensure_not_unpin");

  txtContents = "Ensuring a value is !Unpin";

  yield* all(typewriterTransition(txtRef().text, txtContents, 2));

  exampleCode = CODE`\
use std::marker::PhantomPinned;

struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

  exampleCode = CODE`\
use std::marker::PhantomPinned;

struct RingBuf<T, const CAPACITY: usize> {
    buf: [MaybeUninit<T>, CAPACITY],
    size: usize,
    head: *mut T,
    tail: *mut T,
    _pin: PhantomPinned,
}`;

  yield* all(codeExample().code(exampleCode, 0.75, easeInOutBack));

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

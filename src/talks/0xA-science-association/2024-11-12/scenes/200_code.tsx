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
      fontSize={rem(2)}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      columnGap={vw(10)}
      layout
    />
  );

  const codeExample = createRef<Code>();

  codeLayout().add(<Code ref={codeExample} code={""} />);

  let refsWithoutTitle = [textFieldRefs.a, textFieldRefs.b, textFieldRefs.c, textFieldRefs.d, textFieldRefs.e];

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

  yield* typewriterTransition(title().text, nextTitle, 1);

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

  yield* beginSlide("memory_safety_immutable_refs");

  yield* relTypewriterTransition(textFieldRefs.a().text, "several immutable references (&T)");

  yield* beginSlide("memory_safety_mutable_refs");

  yield* chain(
    relTypewriterTransition(textFieldRefs.b().text, "or ..."),
    relTypewriterTransition(textFieldRefs.c().text, "one mutable reference (&mut T)"),
  );

  yield* beginSlide("memory_safety_borrow_checker");

  yield* chain(
    relTypewriterTransition(textFieldRefs.e().text, "enforced by borrow checker at compile time"),
  );

  yield* beginSlide("memory_safety_example");

  yield* all(
    ...refsWithoutTitle.map(ref => ref().text(NOBREAK_SPACE, 1)),
  );

  let exampleCode = CODE`\
fn takes_shared<T>(value: &T) {
    // [...]
}

fn takes_mut<T>(value: &mut T) {
    // [...]
}

fn takes_ownership<T>(value: T) {
    // [...]
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("memory_safety_example_cont");

  exampleCode = CODE`\
let foo = vec![1, 2, 3];`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("memory_safety_example_cont_2");

  exampleCode = CODE`\
let foo = vec![1, 2, 3];

takes_shared(&foo);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("memory_safety_example_cont_3");

  exampleCode = CODE`\
let mut foo = vec![1, 2, 3];

takes_shared(&foo);
takes_mut(&mut foo);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);


  yield* beginSlide("memory_safety_example_cont_4");

  exampleCode = CODE`\
let mut foo = vec![1, 2, 3];

takes_shared(&foo);
takes_mut(&mut foo);

takes_ownership(foo);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("memory_safety_example_cont_5");

  exampleCode = CODE`\
let mut foo = vec![1, 2, 3];

takes_shared(&foo);
takes_mut(&mut foo);

takes_ownership(foo);

// compiler error
takes_shared(&foo);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("memory_safety_example_cont_5");

  exampleCode = CODE`\
let mut foo = vec![1, 2, 3];

takes_shared(&foo);
takes_mut(&mut foo);

takes_ownership(foo);

// compiler error
takes_mut(&mut foo);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("chapter_concurrency");

  nextTitle = "Concurrency";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  exampleCode = CODE`\
let mut foo = vec![1, 2, 3];

takes_shared(&foo);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  // borrow checker + lifetimes ensure code may be safely shared between threads

  yield* beginSlide("concurrency_threads");

  exampleCode = CODE`\
use std::thread;

let mut foo = vec![1, 2, 3];

takes_shared(&foo);

let handle = std::thread::spawn(move || {
    takes_shared(&foo);
});`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("concurrency_threads_2");

  exampleCode = CODE`\
use std::thread;

let mut foo = vec![1, 2, 3];

takes_shared(&foo);

let handle = std::thread::spawn(move || {
    takes_mut(&mut foo);
});`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("concurrency_threads_3");

  exampleCode = CODE`\
use std::thread;

let mut foo = vec![1, 2, 3];

takes_shared(&foo);

let handle = std::thread::spawn(move || {
    takes_mut(&mut foo);
});

// compiler error
takes_shared(&foo);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("chapter_null_safety");

  yield* codeExample().code("", 1, easeInOutBack);

  nextTitle = "Null Safety";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  // Option<T>
  
  yield* beginSlide("null_safety_option");

  exampleCode = CODE`\
pub enum Option<T> {
    None,
    Some(T),
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("null_safety_option_2");

  exampleCode = CODE`\
let some = Some("Hello World!");`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("null_safety_option_3");

  exampleCode = CODE`\
let some = Some("Hello World!");

match some {
    Some(message) => {
        // [...]
    },
    None => {
        // [...]
    },
};`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("null_safety_option_4");

  exampleCode = CODE`\
let some = Some("Hello World!");

if let Some(message) = some {
  // [...]
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("null_safety_option_5");

  exampleCode = CODE`\
// Same size!

assert_eq!(
    size_of::<Option<&str>>(),
    size_of::<&str>()
);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("chapter_interop");

  yield* codeExample().code("", 1, easeInOutBack);

  nextTitle = "Interoperability - FFI";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  yield* beginSlide("interop_ffi_fn");

  exampleCode = CODE`\
use libc::size_t;

#[link(name = "some_lib")]
extern {
    fn allocate_foo(length: size_t) -> size_t;
}

fn main() {
    let x = unsafe { allocate_foo(100) };
    println!("allocated foo with {} bytes", x);
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("interop_call_rust_from_C");

  exampleCode = CODE`\
#[no_mangle]
pub extern "C" fn hello_from_rust() {
    println!("Hello from Rust!");
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("interop_repr_C");

  exampleCode = CODE`\
use std::ffi::{CString, c_int};

struct UserData {
  name: CString,
  surname: CString,
  registered: c_int,
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("interop_repr_C_2");

  exampleCode = CODE`\
use std::ffi::{CString, c_int};

#[repr(C)]
struct UserData {
  name: CString,
  surname: CString,
  registered: c_int,
}`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("chapter_platforms");

  yield* codeExample().code("", 1, easeInOutBack);

  nextTitle = "Supporting Multiple Platforms";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  yield* beginSlide("platforms_cfg");

  exampleCode = CODE`\
let machine_kind = if cfg!(unix) {
  "unix"
} else if cfg!(windows) {
  "windows"
} else {
  "unknown"
};

println!("I'm running on a {} machine!", machine_kind);`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("platforms_features");

  exampleCode = CODE`\
#[cfg(target_os = "android")]
call_android_specific();

#[cfg(target_os = "ios")]
call_ios_specific();`;

  yield* codeExample().code(exampleCode, 1, easeInOutBack);

  yield* beginSlide("bevy_demo");

  yield* codeExample().code("", 1, easeInOutBack);

  yield* relTypewriterTransition(textFieldRefs.a().text, "-> Demo with Bevy Engine");

  yield* beginSlide("prepare_for_end");

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

  yield* beginSlide("next_scene");
});

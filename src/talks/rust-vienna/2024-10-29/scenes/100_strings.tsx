import { Layout, Txt, Rect, Img, Code, LezerHighlighter, CODE, lines, CubicBezier, QuadBezier, Spline } from "@motion-canvas/2d";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { beginSlide, createRef, TimingFunction, Reference, easeInQuad, easeInBack, easeOutBack, easeInOutBack, easeOutQuad, easeInOutQuad, range, createRefMap, createRefArray, createSignal, DEFAULT, Vector2, easeInBounce, easeOutBounce } from "@motion-canvas/core";
import { all, chain, waitFor } from "@motion-canvas/core/lib/flow";
import { DEFAULT_COLOR_BACKGROUND, DEFAULT_FONT, make_viewport_unit_functions, NOBREAK_SPACE, rem } from "./defaults";

import stringsMeme from '../assets/rust_strings.jpg';

import { monokaiDarkStyle } from '@uiw/codemirror-theme-monokai';

import { HighlightStyle } from '@codemirror/language';
import { parser } from '@lezer/rust';

const codeStyle = HighlightStyle.define(monokaiDarkStyle);

Code.defaultHighlighter = new LezerHighlighter(parser, codeStyle);

export default makeScene2D(function*(view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  yield* beginSlide("chapter_strings");

  let titleLayout = createRef<Layout>();

  const textFieldRefs = createRefMap<Txt>();

  view.add(
    <Layout
      ref={titleLayout}
      width={"80%"}
      height={"80%"}
      direction={"column"}
      rowGap={"20%"}
      layout
    >
    </Layout>
  );

  titleLayout().add(
    <>
      <Rect
        direction={"column"}
        width={"100%"}
        rowGap={vh(5)}
        textWrap
        layout
      >
        <Txt
          ref={textFieldRefs.title}
          fontSize={rem(6)}
          width={"100%"}
          fill={"white"}
          paddingBottom={vh(5)}
        />
        {
          ["a", "b", "c"].map(refName => (
            <Txt
              ref={textFieldRefs[refName]}
              fontSize={rem(2.5)}
              width={"100%"}
              fill={"white"}
            />
          ))
        }
      </Rect>
    </>
  );

  const typewriter = function*(
    txtRef: Reference<Txt>,
    text: string,
    totalDuration: number = 1,
    timingFunction: TimingFunction = easeInOutQuad,
  ) {
    txtRef().text(text.replace(/\S/g, NOBREAK_SPACE));

    const replaced = text.replace(/\S/g, "_");
    yield* chain(
      txtRef().text(replaced, totalDuration / 2, timingFunction),
      txtRef().text(text, totalDuration / 2, timingFunction),
    );
  };

  const erase = function*(
    txtRef: Reference<Txt>,
    totalDuration: number,
    useAlternative: boolean = false,
    timingFunction: TimingFunction = easeInOutQuad,
  ) {
    const replaced = txtRef().text().replace(/\S/g, "_");

    let finalText;

    if (useAlternative) {
      finalText = txtRef().text().replace(/\S*/g, NOBREAK_SPACE);
    } else {
      finalText = NOBREAK_SPACE;
    }

    yield* chain(
      txtRef().text(replaced, totalDuration / 2, timingFunction),
      txtRef().text(finalText, totalDuration / 2, timingFunction),
    );
  };

  // Because I'm too lazy to layout stuff properly
  for (const ref of textFieldRefs.mapRefs(ref => ref)) {
    ref.text(NOBREAK_SPACE);
  }

  let nextTitle = "Strings";

  let [nextSubtitleA, nextSubtitleB, nextSubtitleC] = ["", "", ""];

  const title = textFieldRefs.title;

  yield* typewriter(title, nextTitle, 1);

  yield* beginSlide("strings_meme_shown");

  const imgMeme = createRef<Img>();

  view.add(
    <Img
      ref={imgMeme}
      src={stringsMeme}
      size={vh(100)}
      alignSelf={"center"}
      opacity={0}
      alpha={0}
    />
  );

  imgMeme().fill("white");

  yield* chain(
    titleLayout().opacity(0, 0.65, easeOutQuad),
    all(
      imgMeme().opacity(1, 0.65, easeInQuad),
      imgMeme().alpha(1, 0.65, easeInQuad),
    )
  );

  yield* beginSlide("strings_meme_hidden");

  yield* chain(
    imgMeme().opacity(0, 0.65, easeOutQuad),
    titleLayout().opacity(1, 0.65, easeInQuad),
  );

  yield* beginSlide("why_strings");

  nextSubtitleA = "good example for owned and borrowed representations";

  yield* typewriter(textFieldRefs.a, nextSubtitleA, 1.5);

  yield* beginSlide("string_taxonomy");

  yield* chain(
    erase(textFieldRefs.a, 1.65, true),
    title().fontSize(rem(3), 1),
  );

  const codeLayout = createRef<Layout>();

  const codeBlocks = createRefMap<Code>();

  view.add(
    <Layout
      ref={codeLayout}
      height={vh(100)}
      width={vw(100)}
      fontFamily={DEFAULT_FONT}
      fontSize={rem(3)}
      direction={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      columnGap={vw(10)}
      layout
    >
      <Code
        ref={codeBlocks.str}
        code={''}
      />
      <Code
        ref={codeBlocks.osstr}
        code={''}
      />
      <Code
        ref={codeBlocks.cstr}
        code={''}
      />
      <Code
        ref={codeBlocks.path}
        code={''}
      />
    </Layout>
  );

  yield* beginSlide("taxonomy_string");
  yield* codeBlocks.str().code("String", 0.8), easeInOutBack;

  yield* beginSlide("taxonomy_osstring");
  yield* codeBlocks.osstr().code("OsString", 0.8, easeInOutBack);

  yield* beginSlide("taxonomy_cstring");
  yield* codeBlocks.cstr().code("CString", 0.8, easeInOutBack);

  yield* beginSlide("taxonomy_pathbuf");
  yield* codeBlocks.path().code("PathBuf", 0.8, easeInOutBack);

  yield* beginSlide("taxonomy_borrowed_variants");
  yield* all(
    codeBlocks.str().code("String => &str", 0.8, easeInOutBack),
    chain(
      waitFor(0.15),
      codeBlocks.osstr().code("OsString => &OsStr", 0.8, easeInOutBack),
    ),
    chain(
      waitFor(0.3),
      codeBlocks.cstr().code("CString => &CStr", 0.8, easeInOutBack),
    ),
    chain(
      waitFor(0.45),
      codeBlocks.path().code("PathBuf => &Path", 0.8, easeInOutBack),
    ),
  );

  yield* beginSlide("end_taxonomy");

  yield* all(
    codeBlocks.str().code(" ", 0.6),
    chain(
      waitFor(0.15),
      codeBlocks.osstr().code(" ", 0.8, easeInOutBack),
    ),
    chain(
      waitFor(0.3),
      codeBlocks.cstr().code(" ", 0.8, easeInOutBack),
    ),
    chain(
      waitFor(0.45),
      codeBlocks.path().code(" ", 0.8, easeInOutBack),
    ),
  );

  yield* all(...codeBlocks.mapRefs(code => code.code("", 0.1)));

  codeLayout().removeChildren();

  const stringExampleCode = createRef<Code>();

  codeLayout().add(
    <Code
      ref={stringExampleCode}
      code={''}
    />
  );

  yield* beginSlide("string_deref_example_wrong");

  const stringDerefExampleWrong = CODE`\
fn foo(arg: String) {
    // [...]
}`;

  yield* stringExampleCode().code(stringDerefExampleWrong, 0.6);

  yield* beginSlide("string_deref_example_right");

  const stringDerefExampleRight = CODE`\
fn foo(arg: &str) {
    // [...]
}`;

  yield* stringExampleCode().code(stringDerefExampleRight, 0.6);

  yield* beginSlide("end_string_deref_example");

  yield* stringExampleCode().code('', 0.6);

  codeLayout().removeChildren();

  // Should technically start next scene here, but it's more convenient to
  // just keep going tbh.

  yield* beginSlide("chapter_deref");

  nextTitle = "The Deref Trait";

  yield* chain(
    title().fontSize(rem(6), 1),
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  yield* beginSlide("deref_continue");

  nextTitle = "Deref";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  const derefCodeExample = createRef<Code>();

  codeLayout().add(
    <Code
      ref={derefCodeExample}
      code={''}
    />
  );

  codeLayout().fontSize(rem(2));

  const derefTraitDefinition = CODE`\
pub trait Deref {
    type Target: ?Sized;

    fn deref(&self) -> &Self::Target;
}`;

  yield* derefCodeExample().code(derefTraitDefinition, 0.6);

  yield* beginSlide("deref_example");

  yield* chain(
    title().fontSize(rem(3), 0.6, easeInOutQuad),
    codeLayout().fontSize(rem(1.75), 0.6, easeInOutBack),
  );

  const derefStringExample = CODE`\
fn main() {
    let owned = String::from("Wanna hold a talk at Rust Vienna?");

    let borrowed = *owned;

    println!("{borrowed}");
}`;

  yield* derefCodeExample().code(derefStringExample, 0.75, easeInOutBack);

  yield* beginSlide("deref_example_comment");

  const derefStringExampleCommented = CODE`\
fn main() {
    let owned = String::from("Wanna hold a talk at Rust Vienna?");

    let borrowed = *owned; // str does not implement Sized!

    println!("{borrowed}");
}`;

  yield* derefCodeExample().code(derefStringExampleCommented, 0.6, easeInOutQuad);

  yield* beginSlide("deref_example_fixed");

  const derefStringExampleFixed = CODE`\
fn main() {
    let owned = String::from("Wanna hold a talk at Rust Vienna?");

    let borrowed = &*owned;

    println!("{borrowed}");
}`;

  yield* derefCodeExample().code(derefStringExampleFixed, 0.6, easeInOutQuad);

  yield* beginSlide("deref_explanation");

  nextSubtitleA = "quite profound -> deserves its own talk";

  yield* chain(
    all(
      title().fontSize(rem(6), 1, easeInOutQuad),
      derefCodeExample().code("", 1, easeInOutBack),
    ),
    typewriter(textFieldRefs.a, nextSubtitleA, 1.5),
  );

  yield* beginSlide("deref_explanation_continued");

  nextSubtitleA = "implement if a value of one type transparently behaves like a value of the target type";

  yield* chain(
    erase(textFieldRefs.a, 1),
    typewriter(textFieldRefs.a, nextSubtitleA, 2.5, easeInOutQuad),
  );

  yield* beginSlide("deref_explanation_continued_again");

  nextSubtitleB = "compiler implicitly inserts calls to Deref::deref";

  yield* chain(
    typewriter(textFieldRefs.b, nextSubtitleB, 1.5, easeInOutQuad),
  );

  yield* beginSlide("deref_coercion");

  nextSubtitleC = "--> deref coercion";

  yield* chain(
    erase(textFieldRefs.a, 1),
    typewriter(textFieldRefs.c, nextSubtitleC, 1.5, easeInOutQuad),
  );

  yield* beginSlide("deref_main_point");

  yield* all(
    chain(
      waitFor(0.5),
      erase(textFieldRefs.b, 1),
    ),
    erase(textFieldRefs.c, 1),
  );

  codeLayout().fontSize(rem(3));

  yield* chain(
    title().fontSize(rem(3), 0.6, easeInOutBack),
    derefCodeExample().code("\nString behaves like str", 0.6),
    waitFor(0.2),
    derefCodeExample().code.append("\n\nVec<T> behaves like [T]", 0.6),
    waitFor(0.2),
    derefCodeExample().code.append("\n\nBox<T> behaves like  T", 0.6),
    waitFor(0.2),
    derefCodeExample().code.append("\n\n          ...", 0.6),
  );

  yield* beginSlide("chapter_asref");

  nextTitle = "The AsRef<T> Trait";

  yield* chain(
    derefCodeExample().code.remove(lines(6, 8), 0.6),
    derefCodeExample().code.remove(lines(4, 6), 0.6),
    derefCodeExample().code.remove(lines(2, 4), 0.6),
    derefCodeExample().code("", 0.8, easeInOutBack),
    title().fontSize(rem(6), 0.6, easeInOutBack),
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  codeLayout().removeChildren();

  yield* beginSlide("asref_continue");

  nextTitle = "AsRef<T>";

  yield* chain(
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  const asrefCodeExample = createRef<Code>();

  codeLayout().add(
    <Code
      ref={asrefCodeExample}
      code={''}
    />
  );

  codeLayout().fontSize(rem(2));

  const asrefTraitDefinition = CODE`\
pub trait AsRef<T>
where
    T: ?Sized,
{
    fn as_ref(&self) -> &T;
}`;

  yield* asrefCodeExample().code(asrefTraitDefinition, 0.8, easeInOutBack);

  yield* beginSlide("asref_example_string");

  const asrefExampleString = CODE`\
fn foo(arg: String) {
    // [...]
}`;

  yield* asrefCodeExample().code(asrefExampleString, 0.6, easeInOutQuad);
  yield* codeLayout().fontSize(rem(3), 0.6, easeInOutBack);

  yield* beginSlide("asref_example_str");

  const asrefExampleStr = CODE`\
fn foo(arg: &str) {
    // [...]
}`;

  yield* asrefCodeExample().code(asrefExampleStr, 0.6, easeInOutQuad);

  yield* beginSlide("asref_example_actual");

  const asrefExampleActual = CODE`\
fn foo(arg: impl AsRef<str>) {
    // [...]
}`;

  yield* asrefCodeExample().code(asrefExampleActual, 0.6, easeInOutQuad);

  yield* beginSlide("asref_example_file_path");

  const asrefExampleFilePath = CODE`\
fn read_config(path: impl AsRef<Path>) -> Config {
  // [...]
}`;

  yield* all(
    codeLayout().fontSize(rem(2), 0.6, easeInOutBack),
    asrefCodeExample().code(asrefExampleFilePath, 0.6, easeInOutQuad),
  );

  yield* beginSlide("asref_example_file_path_cont");

  nextSubtitleC = "may also take Box<Path>, Rc<Path>, Arc<Path>, ...";

  yield* typewriter(textFieldRefs.c, nextSubtitleC, 1.5);

  yield* beginSlide("asref_explanation");

  nextSubtitleA = "used for cheap ref-to-ref conversion";

  yield* asrefCodeExample().code("", 0.8, easeInOutBack);

  yield* all(
    chain(
      waitFor(0.5),
      typewriter(textFieldRefs.a, nextSubtitleA, 1, easeInOutQuad),
    ),
    erase(textFieldRefs.c, 1),
  );

  yield* beginSlide("chapter_borrow");

  nextTitle = "The Borrow<T> Trait";

  yield* chain(
    erase(textFieldRefs.a, 1),
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  yield* beginSlide("borrow_continue");

  nextTitle = "Borrow<T>";

  yield* chain(
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  const borrowCodeExample = createRef<Code>();

  codeLayout().add(
    <Code
      ref={borrowCodeExample}
      code={''}
    />
  );

  codeLayout().fontSize(rem(2));

  const borrowTraitDefinition = CODE`\
pub trait Borrow<Borrowed>
where
    Borrowed: ?Sized,
{
    fn borrow(&self) -> &Borrowed;
}`;

  yield* borrowCodeExample().code(borrowTraitDefinition, 0.6);

  yield* beginSlide("borrow_explanation");

  nextSubtitleA = "very similar to AsRef<T>, but has more semantics"

  yield* borrowCodeExample().code("", 0.8, easeInOutBack);

  yield* typewriter(textFieldRefs.a, nextSubtitleA, 1.5);

  yield* beginSlide("borrow_explanation_cont");

  nextSubtitleA = "Eq, Ord and Hash must be equivalent for borrowed and owned values";
  nextSubtitleB = "x.borrow() == y.borrow() should be the same as x == y";

  yield* chain(
    erase(textFieldRefs.a, 1),
    typewriter(textFieldRefs.a, nextSubtitleA, 2, easeInOutQuad),
    waitFor(1),
    typewriter(textFieldRefs.b, nextSubtitleB, 2, easeInOutQuad),
  );

  yield* beginSlide("summary_borrowing");

  codeLayout().removeChildren();

  nextTitle = "Summary: Borrowing";

  yield* all(
    ...[textFieldRefs.a, textFieldRefs.b, textFieldRefs.c].reverse().map(
      (ref, i) => erase(ref, 1 + i * 0.25, false, easeInOutQuad)
    ),
  );

  yield* chain(
    title().fontSize(rem(4), 0.8, easeInOutBack),
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  codeLayout().fontSize(rem(3));

  const traitCodeBlocks = createRefMap<Code>();

  codeLayout().add(
    <>
      <Code
        ref={traitCodeBlocks.deref}
        code={''}
      />
      <Code
        ref={traitCodeBlocks.asref}
        code={''}
      />
      <Code
        ref={traitCodeBlocks.borrow}
        code={''}
      />
    </>
  );

  yield* all(
    chain(
      waitFor(0),
      traitCodeBlocks.deref().code("Deref", 0.8, easeInOutBack),
    ),
    chain(
      waitFor(0.15),
      traitCodeBlocks.asref().code("AsRef<T>", 0.8, easeInOutBack),
    ),
    chain(
      waitFor(0.3),
      traitCodeBlocks.borrow().code("Borrow<T>", 0.8, easeInOutBack),
    ),
  );

  yield* beginSlide("mut_trait_variants");

  yield* all(
    chain(
      waitFor(0),
      traitCodeBlocks.deref().code("Deref => DerefMut", 0.8, easeInOutBack),
    ),

    chain(
      waitFor(0.15),
      traitCodeBlocks.asref().code("AsRef<T> => AsMut<T>", 0.8, easeInOutBack),
    ),

    chain(
      waitFor(0.3),
      traitCodeBlocks.borrow().code("Borrow<T> => BorrowMut<T>", 0.8, easeInOutBack),
    ),
  );

  yield* beginSlide("chapter_clone");

  yield* all(
    chain(
      waitFor(0),
      traitCodeBlocks.deref().code(" ", 0.8, easeInOutBack),
    ),

    chain(
      waitFor(0.15),
      traitCodeBlocks.asref().code(" ", 0.8, easeInOutBack),
    ),

    chain(
      waitFor(0.3),
      traitCodeBlocks.borrow().code(" ", 0.8, easeInOutBack),
    ),
  );

  nextTitle = "The Clone Trait";

  yield* chain(
    title().text(nextTitle, 0.8, easeInOutQuad),
    title().fontSize(rem(6), 0.6, easeInOutBack),
  );

  yield* beginSlide("clone_continued");

  nextTitle = "Clone";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);

  codeLayout().removeChildren();

  const cloneCodeExample = createRef<Code>();

  codeLayout().add(
    <Code
      ref={cloneCodeExample}
      code={''}
    />
  );

  codeLayout().fontSize(rem(2));

  const cloneTraitDefinition = CODE`\
pub trait Clone: Sized {
    // Required method
    fn clone(&self) -> Self;

    // Provided method
    fn clone_from(&mut self, source: &Self) { ... }
}`;

  yield* cloneCodeExample().code(cloneTraitDefinition, 0.8, easeInOutBack);

  yield* beginSlide("clone_explained");

  nextSubtitleA = "used to clone data";

  yield* chain(
    cloneCodeExample().code(" ", 0.8, easeInOutBack),
    typewriter(textFieldRefs.a, nextSubtitleA, 1.5),
  );

  nextSubtitleA = "used to clone data, duh";

  yield* chain(
    waitFor(1),
    textFieldRefs.a().text(nextSubtitleA, 2),
  );

  yield* beginSlide("clone_explained_ownership");

  nextSubtitleA = "used to clone data";
  nextSubtitleB = "but doesn't have to *actually* clone it";
  nextSubtitleC = "merely providing ownership is enough";

  yield* all(
    textFieldRefs.a().text(nextSubtitleA, 0.5),
    chain(
      typewriter(textFieldRefs.b, nextSubtitleB, 1.5),
      typewriter(textFieldRefs.c, nextSubtitleC, 1.5),
    ),
  );

  yield* beginSlide("chapter_toowned");

  yield* all(
    ...[textFieldRefs.a, textFieldRefs.b, textFieldRefs.c].reverse().map(
      (ref, i) => erase(ref, 1 + i * 0.25, false, easeInOutQuad)
    ),
  );

  nextTitle = "The ToOwned Trait";

  yield* chain(
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  yield* beginSlide("toowned_continued");

  nextTitle = "ToOwned";

  yield* chain(
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  codeLayout().removeChildren();

  const toOwnedCodeExample = createRef<Code>();

  codeLayout().add(
    <Code
      ref={toOwnedCodeExample}
      code={''}
    />
  );


  const toOwnedTraitDefinition = CODE`\
pub trait ToOwned {
    type Owned: Borrow<Self>;

    // Required method
    fn to_owned(&self) -> Self::Owned;

    // Provided method
    fn clone_into(&self, target: &mut Self::Owned) { ... }
}`;

  yield* chain(
    toOwnedCodeExample().code(toOwnedTraitDefinition, 0.8, easeInOutBack),
    codeLayout().fontSize(rem(1.75), 0.6, easeInOutBack),
  );

  yield* beginSlide("toowned_example_clone");

  const toOwnedExampleClone = CODE`\
fn main() {
    let owned = String::from("Hier könnte Ihre Werbung stehen!");

    let borrowed = &*owned;

    let cloned = borrowed.clone();

    println!("{cloned}");
}`;

  yield* chain(
    title().fontSize(rem(3), 0.6, easeInOutQuad),
    toOwnedCodeExample().code(toOwnedExampleClone, 0.6, easeInOutQuad),
  );

  yield* beginSlide("toowned_example_clone_reveal");

  const toOwnedExampleCloneReveal = CODE`\
fn main() {
    let owned = String::from("Hier könnte Ihre Werbung stehen!");

    let borrowed = &*owned;

    let cloned = borrowed.clone(); // Clones the reference!

    println!("{cloned}");
}`;

  yield* toOwnedCodeExample().code(toOwnedExampleCloneReveal, 0.6, easeInOutQuad);

  yield* beginSlide("toowned_example_actual");

  const toOwnedExampleActual = CODE`\
fn main() {
    let owned = String::from("Hier könnte Ihre Werbung stehen!");

    let borrowed = &*owned;

    let cloned = borrowed.to_owned();

    println!("{cloned}");
}`;

  yield* toOwnedCodeExample().code(toOwnedExampleActual, 0.6, easeInOutQuad);

  yield* beginSlide("toowned_explained");

  nextSubtitleA = "generalises Clone to borrowed data";

  yield* chain(
    toOwnedCodeExample().code(" ", 0.8, easeInOutBack),
    title().fontSize(rem(6), 0.8, easeInOutBack),
    typewriter(textFieldRefs.a, nextSubtitleA, 1),
  );

  yield* beginSlide("toowned_explained_cont");

  nextSubtitleB = "Clone only works for &T -> T";

  yield* typewriter(textFieldRefs.b, nextSubtitleB, 1);

  yield* beginSlide("toowned_explained_cont_cont");

  nextSubtitleC = "ToOwned can construct owned data from any borrow";

  yield* typewriter(textFieldRefs.c, nextSubtitleC, 1);

  yield* beginSlide("summary_owning");

  codeLayout().removeChildren();

  nextTitle = "Summary: Acquiring Ownership";

  nextSubtitleA = "ToOwned generalises Clone to borrowed data";
  nextSubtitleB = "Clone only works for &T -> T";
  nextSubtitleC = "ToOwned can construct owned data from any borrow, unlike Clone";

  yield* chain(
    title().fontSize(rem(4), 0.8, easeInOutBack),
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  yield* all(
    textFieldRefs.a().text(nextSubtitleA, 1, easeInOutQuad),
    textFieldRefs.b().text(nextSubtitleB, 1, easeInOutQuad),
    textFieldRefs.c().text(nextSubtitleC, 1, easeInOutQuad),
  );

  yield* beginSlide("summary_owning_end");


  yield* all(
    ...[title, textFieldRefs.a, textFieldRefs.b, textFieldRefs.c].reverse().map(
      (ref, i) => {
        ref().minHeight(ref().height());

        return chain(
          ref().text(ref().text().replace(/\S/g, "_"), 0.5 + i * 0.125, easeOutQuad),
          ref().text(NOBREAK_SPACE, 0.5 + i * 0.125, easeOutQuad),
        );
      }
    ),
  );

  [title, textFieldRefs.a, textFieldRefs.b, textFieldRefs.c].map(
    ref => ref().minHeight(DEFAULT)
  );

  yield* beginSlide("chapter_cow");

  codeLayout().removeChildren();
  title().fontSize(rem(6));

  nextTitle = "The Cow<'a, B> Type";

  yield* typewriter(title, nextTitle, 1, easeInOutQuad);

  yield* beginSlide("cow_continued");

  nextTitle = "Cow<'a, B>";

  yield* title().text(nextTitle, 0.8, easeInOutQuad);


  const cowCodeExample = createRef<Code>();

  codeLayout().add(
    <Code
      ref={cowCodeExample}
      code={''}
    />
  );

  codeLayout().fontSize(rem(2));

  const cowTypeDefinition = CODE`\
pub enum Cow<'a, B>
where
    B: 'a + ToOwned + ?Sized,
{
    Borrowed(&'a B),
    Owned(<B as ToOwned>::Owned),
}`;

  yield* cowCodeExample().code(cowTypeDefinition, 0.8, easeInOutBack);

  yield* beginSlide("cow_example_cstr");

  const cowExampleCstr = CODE`\
fn validate_ffi_str(input: &CStr) -> Cow<CStr> {
    if let Err(_utf8err) = input.to_str() {
        let ret = handle_non_utf8(input); 
        
        return Cow::Owned(ret);
    }
    
    Cow::Borrowed(input)
}`;

  yield* chain(
    title().fontSize(rem(3), 0.8, easeInOutBack),
    cowCodeExample().code(cowExampleCstr, 0.8, easeInOutBack),
  );

  yield* beginSlide("cow_example_cstr_highlight")

  yield* chain(
    cowCodeExample().selection(
      cowCodeExample().findAllRanges(/cow\S* ?/gi), 0.8, easeInOutBack
    ),
  );

  yield* beginSlide("cow_example_cstr_unhighlight")

  yield* chain(
    cowCodeExample().selection(DEFAULT, 0.8, easeInOutBack),
  );

  yield* beginSlide("cow_example_mut_param");

  const cowExampleMutParam = CODE`\



fn adjust_file_ending(path: &mut Cow<Path>) {
    if let Some(ext) = path.extension() {
        let Some(parsed_ext) = ext.to_str() else {
            return;
        };

        match parsed_ext {
            "jpeg" => {
                path.to_mut().set_extension("jpg");
            }
            // [...]
            &_ => {
                // [...]
            }
        };
    }
}`;

  yield* chain(
    codeLayout().fontSize(rem(1.5), 0.8, easeInOutBack),
    cowCodeExample().code(cowExampleMutParam, 0.8, easeInOutBack),
  );

  yield* beginSlide("cow_example_mut_param_highlight");

  yield* chain(
    cowCodeExample().selection(
      cowCodeExample().findAllRanges(/&mut cow\S*>/gi), 0.8, easeInOutBack
    ),
  );

  yield* beginSlide("cow_example_mut_param_highlight_mut");

  yield* chain(
    cowCodeExample().selection(
      cowCodeExample().findAllRanges(/\.to_mut\(\)/gi), 0.8, easeInOutBack
    ),
  );

  yield* beginSlide("cow_example_mut_param_unhighlight");

  yield* chain(
    cowCodeExample().selection(DEFAULT, 0.8, easeInOutBack),
  );

  yield* beginSlide("cow_explained");

  nextSubtitleA = "clones lazily on mutation";

  yield* chain(
    cowCodeExample().code(" ", 0.8, easeInOutBack),
    title().fontSize(rem(6), 0.8, easeInOutBack),
    typewriter(textFieldRefs.a, nextSubtitleA, 1.5),
  );

  yield* beginSlide("cow_explained_cont");

  nextSubtitleB = "implements Deref and is thus a smart pointer";

  yield* typewriter(textFieldRefs.b, nextSubtitleB, 1.5);

  yield* beginSlide("cow_explained_cont_cont");

  nextSubtitleC = "can be used with custom owning and borrowing types";

  yield* typewriter(textFieldRefs.c, nextSubtitleC, 1.5);

  yield* beginSlide("cow_honorable_mentions");

  [title, textFieldRefs.a, textFieldRefs.b, textFieldRefs.c].map(
    ref => ref().minHeight(ref().height())
  );

  yield* all(
    erase(textFieldRefs.b, 1.5),
    erase(textFieldRefs.c, 1.5),
  );

  yield* textFieldRefs.a().text("Rc::make_mut and Arc::make_mut work in a similar way!", 1.5);


  yield* beginSlide("questions");

  nextTitle = "Questions?";

  yield* chain(
    erase(textFieldRefs.a, 1.5),
    title().text(nextTitle, 0.8, easeInOutQuad),
  );

  yield* beginSlide("next_scene");


  yield* all(
    ...[...textFieldRefs.mapRefs(ref => ref)]
      .reverse()
      .map(
        (ref, i) => chain(
          ref.text(ref.text().replace(/\S/g, "_"), 0.25 + i * 0.125, easeOutQuad),
          ref.text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
        )
      ),
  );
});

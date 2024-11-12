import { Layout, Txt } from "@motion-canvas/2d";
import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
  DEFAULT,
  beginSlide,
  createRef,
  easeInQuad,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeOutQuad,
  easeInOutQuad,
  createRefArray,
  range,
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

export default makeScene2D(function* (view) {
  const [vw, vh, vmin, vmax] = make_viewport_unit_functions(view);

  view.fill(DEFAULT_COLOR_BACKGROUND);
  view.fontFamily(DEFAULT_FONT);

  yield* beginSlide("chapter_who_cares");

  let titleLayout = createRef<Layout>();
  let descLayout = createRef<Layout>();
  let firstColumn = createRef<Layout>();
  let secondColumn = createRef<Layout>();

  const title = createRef<Txt>();
  const firstDescColRows = createRefArray<Txt>();
  const secondDescColRows = createRefArray<Txt>();

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
      <Layout
        direction={"column"}
        width={"100%"}
        rowGap={"20%"}
        textWrap
        layout
      >
        <Txt
          ref={title}
          fontSize={rem(6)}
          width={"100%"}
          fill={"white"}
          text={" "}
        />
      </Layout>

      <Layout ref={descLayout} direction={"row"} columnGap={vw(5)} layout>
        <Layout
          ref={firstColumn}
          direction={"column"}
          rowGap={vh(5)}
          layout
        >
          {range(5).map(() => (
            <Txt
              ref={firstDescColRows}
              fill={"white"}
              text={" "}
              fontSize={rem(1.75)}
            />
          ))}
        </Layout>
        <Layout
          ref={secondColumn}
          direction={"column"}
          rowGap={vh(5)}
          layout
        >
          {range(5).map(() => (
            <Txt
              ref={secondDescColRows}
              fill={"white"}
              text={" "}
              fontSize={rem(1.75)}
            />
          ))}
        </Layout>
      </Layout>
    </>,
  );

  yield* all(relTypewriterTransition(title().text, "Who cares?"));

  let companyName = firstDescColRows[0];
  let companyQuote = firstDescColRows[1];
  let companySource = firstDescColRows[2];

  companyName.fontSize(rem(3));
  companyQuote.fontSize(rem(3));
  companyQuote.padding([0, rem(2)]);
  companySource.fontSize(rem(1.25));

  const resetCompany = () => all(
    companyName.text(NOBREAK_SPACE, 1),
    companyQuote.text(NOBREAK_SPACE, 1),
    companySource.text(NOBREAK_SPACE, 1),
  );

  yield* beginSlide("company_meta_quote");

  yield* chain(title().fontSize(rem(4), 0.75, easeInOutBack));

  yield* chain(
    companyName.text("Meta", 1),
    companyQuote.text(
      '"For performance-sensitive\nback-end services, we\nencourage C++ and Rust."',
      2,
    ),
    companySource.text("- Programming languages endorsed for server-side use at Meta, Engineering at Meta, 2022", 1),
  );

  companyName.size(companyName.size());

  yield* beginSlide("company_meta_quote_2");

  yield* chain(
    companyQuote.text('"..."', 0.5),
    companyQuote.text('"For CLI tools, we recommend Rust."', 1),
  );

  yield* beginSlide("company_google_quote");

  yield* chain(
    resetCompany(),
    companyName.text("Google", 1),
    companyQuote.text('"Based on our studies, more than\n2/3 of respondents are confident\nin contributing to a Rust codebase\nwithin two months or less\nwhen learning Rust."', 3),
    companySource.text("- Rust fact vs. fiction: 5 Insights from Google's Rust journey in 2022,\nGoogle Open Source Blog, 2023", 1),
  );

  yield* beginSlide("company_google_quote_2");

  yield* chain(
    companyQuote.text('"..."', 1.5),
    companyQuote.text('"Further, a third of respondents\nbecome as productive using Rust\nas other languages in two months\nor less."', 2),
  );

  yield* beginSlide("company_google_quote_3");

  yield* chain(
    companyQuote.text('"..."', 1),
    companyQuote.text('"The respondents said that\nthe quality of the Rust code\nis high — 77% of developers\nwere satisfied with\nthe quality of Rust code."', 2),
  );

  yield* beginSlide("company_google_quote_4");

  yield* chain(
    companyQuote.text('"..."', 1),
    companyQuote.text('"More than half of respondents\nsay that Rust code is\nincredibly easy to review."', 1),
  );

  yield* beginSlide("company_discord_quote");

  yield* chain(
    resetCompany(),
    companyName.text("Discord", 1),
    companyQuote.text('"[...] we have drastically improved\nthe performance of a service\nby switching its implementation\nfrom Go to Rust."', 2),
    companySource.text("- Why Discord is switching from Go to Rust, Discord Blog, 2020", 1),
  );

  yield* beginSlide("honorable_mentions");

  yield* chain(
    resetCompany(),
  );

  companyQuote.padding([0, 0]);

  firstDescColRows.map(txt => txt.fontSize(rem(3)));
  secondDescColRows.map(txt => txt.fontSize(rem(3)));

  firstColumn().width("50%");
  secondColumn().width("50%");

  yield* beginSlide("mention_linux_kernel");

  yield* all(
    firstDescColRows[0].text("Linux Kernel", 1),
  );

  yield* beginSlide("mention_windows_kernel");

  yield* all(
    firstDescColRows[1].text("Windows Kernel", 1),
  );

  yield* beginSlide("mention_asahi_linux");

  yield* all(
    firstDescColRows[2].text("Asahi Linux", 1),
  );

  yield* beginSlide("mention_deno");

  yield* all(
    firstDescColRows[3].text("Deno", 1),
  );

  yield* beginSlide("mention_typst");

  yield* all(
    firstDescColRows[4].text("Typst", 1),
  );

  yield* beginSlide("mention_rustpython");

  yield* all(
    secondDescColRows[0].text("RustPython", 1),
  );

  yield* beginSlide("mention_gleam");

  yield* all(
    secondDescColRows[1].text("Gleam", 1),
  );

  yield* beginSlide("mention_roc");

  yield* all(
    secondDescColRows[2].text("Roc", 1),
  );

  yield* beginSlide("mention_sway");

  yield* all(
    secondDescColRows[3].text("Sway", 1),
  );

  yield* beginSlide("mention_swc");

  yield* all(
    secondDescColRows[4].text("SWC", 1),
  );

  yield* beginSlide("next_scene");

  title().minHeight(title().height());
  firstColumn().size(firstColumn().size());
  secondColumn().size(secondColumn().size());

  yield* all(
    all(
      ...firstDescColRows
        .reverse()
        .map((txt, i) =>
          chain(
            txt.text(
              txt.text().replace(/\S/g, "_"),
              0.25 + i * 0.125,
              easeOutQuad,
            ),
            txt.text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
          ),
        ),
      ...secondDescColRows
        .reverse()
        .map((txt, i) =>
          chain(
            txt.text(
              txt.text().replace(/\S/g, "_"),
              0.25 + i * 0.125,
              easeOutQuad,
            ),
            txt.text(NOBREAK_SPACE, 0.25 + i * 0.125, easeOutQuad),
          ),
        ),
      chain(
        waitFor(0.75),
        title().text(title().text().replace(/\S/g, "_"), 0.5, easeOutQuad),
        title().text(NOBREAK_SPACE, 0.5, easeOutQuad),
      ),
    ),
  );
});

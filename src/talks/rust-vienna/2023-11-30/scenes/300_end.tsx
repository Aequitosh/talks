import { Img, Layout, Txt } from "@motion-canvas/2d";
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
import { all, chain } from "@motion-canvas/core/lib/flow";
import { DEFAULT_COLOR_BACKGROUND } from "./defaults";
import repoQRCode from "../assets/repo_qr_code.png";

export default makeScene2D(function* (view) {
  view.fill(DEFAULT_COLOR_BACKGROUND);

  yield* beginSlide("closing_thoughts");

  let titleLayout = createRef<Layout>();
  const titleRows = createRefArray<Txt>();
  const middleRowFields = createRefArray<Txt>();
  const usernameRow = createRefArray<Txt>();

  view.add(
    <Layout ref={titleLayout} direction={"column"} alignSelf={"center"} layout>
      <Txt
        ref={titleRows}
        fontFamily={"JetBrains Mono"}
        fontSize={92}
        fill={"white"}
        justifyContent={"center"}
      />
      <Txt
        ref={titleRows}
        fontFamily={"JetBrains Mono"}
        fontSize={92}
        fill={"white"}
        justifyContent={"center"}
      />
      <Layout
        direction={"row"}
        alignSelf={"center"}
        paddingTop={75}
        gap={75}
        layout
      >
        <Txt
          ref={middleRowFields}
          fontFamily={"JetBrains Mono"}
          fill={"white"}
          justifyContent={"center"}
        />
        <Txt
          ref={middleRowFields}
          fontFamily={"JetBrains Mono"}
          fill={"white"}
          justifyContent={"center"}
        />
      </Layout>
      <Txt
        ref={usernameRow}
        paddingTop={15}
        fontFamily={"JetBrains Mono"}
        fill={"white"}
        justifyContent={"center"}
      />
    </Layout>,
  );

  const titleRowsTo = ["Thank you", "for your attention"];
  const middleRowFieldsTo = ["Max R. Carrara", "Proxmox"];
  const lastRowTo = "@aequitosh";

  yield* all(
    titleLayout().opacity(0, 0).to(1, 1),
    ...range(titleRowsTo.length).map((i) =>
      titleRows[i]
        .text("_".repeat(titleRowsTo[i].length), 1 + i * 0.5)
        .to(titleRowsTo[i], 1.5 + i * 0.55),
    ),
    ...range(middleRowFieldsTo.length).map((i) =>
      middleRowFields[i].text(
        "_".repeat(middleRowFieldsTo[i].length),
        1 + i * 0.5,
      ),
    ),
    usernameRow[0].text("_".repeat(lastRowTo.length), 1.25),
  );

  yield* chain(
    ...range(middleRowFieldsTo.length).map((i) =>
      middleRowFields[i].text(middleRowFieldsTo[i], 1 + i * 0.5),
    ),
    usernameRow[0].text(lastRowTo, 1.75),
  );

  yield* beginSlide("end");
  yield* chain(
    ...titleRows.reverse().map((row, i) => row.text("", 1.5 + i, easeOutQuad)),
    ...middleRowFields.map((row) => row.text("", 1.5, easeOutQuad)),
    usernameRow().text("Made with Motion Canvas.\n", 1.5),
  );

  const qr = createRef<Img>();

  titleLayout().add(
    <Img ref={qr} src={repoQRCode} size={0} alignSelf={"center"} opacity={0} />,
  );

  yield* all(qr().size(500, 2), qr().opacity(1, 1.5));
});

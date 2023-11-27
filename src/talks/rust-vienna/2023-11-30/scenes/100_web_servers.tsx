import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import { all, DEFAULT, Direction, slideTransition } from "@motion-canvas/core";
import { beginSlide, createRef } from "@motion-canvas/core/lib/utils";
import {
  CodeBlock,
  insert,
  lines,
  range,
  remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";

import { DEFAULT_COLOR_BACKGROUND } from "./defaults";
import { Layout } from "@motion-canvas/2d";

export default makeScene2D(function* (view) {
  view.fill(DEFAULT_COLOR_BACKGROUND);

  let floatingTitle = createRef<CodeBlock>();

  view.add(
    <CodeBlock
      ref={floatingTitle}
      fontFamily={"JetBrains Mono"}
      code={"a simple web server"}
    />,
  );

  // TODO: Title

  yield* slideTransition(Direction.Left, 1);
  yield* beginSlide("bad_code");

  // 1. show bad example - not leveraging concurreny

  let floatingCode = createRef<CodeBlock>();

  view.add(
    <Layout>
      <CodeBlock
        ref={floatingCode}
        fontFamily={"JetBrains Mono"}
        fontSize={22}
        opacity={0}
        language={"rust"}
        code={`use std::convert::Infallible;
use std::net::SocketAddr;

use anyhow::Result;

use http_body_util::Full;

use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};

use hyper_util::rt::TokioIo;

use tokio::net::TcpListener;

async fn hello(_: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    Ok(Response::new(Full::new(Bytes::from("Hello, world!"))))
}

#[tokio::main]
async fn main() -> Result<()> {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));

    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _peer) = listener.accept().await?;
        let io = TokioIo::new(stream);

        let http = http1::Builder::new();
        let connection = http.serve_connection(io, service_fn(hello));

        if let Err(err) = connection.await {
            println!("Error serving connection: {err:?}");
        }
    }
}`}
      />
    </Layout>,
  );

  yield* all(floatingTitle().opacity(0, 1), floatingCode().opacity(1, 2.0));

  yield* beginSlide("bad_code_clean");

  yield* all(
    floatingCode().edit(1.5, false)`${remove(`use std::convert::Infallible;
use std::net::SocketAddr;

use anyhow::Result;

use http_body_util::Full;

use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::\{Request, Response\};

use hyper_util::rt::TokioIo;

use tokio::net::TcpListener;

`)}async fn hello(_: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    Ok(Response::new(Full::new(Bytes::from("Hello, world!"))))
}

#[tokio::main]
async fn main() -> Result<()> {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));

    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _peer) = listener.accept().await?;
        let io = TokioIo::new(stream);

        let http = http1::Builder::new();
        let connection = http.serve_connection(io, service_fn(hello));

        if let Err(err) = connection.await {
            println!("Error serving connection: {err:?}");
        }
    }
}`,
  );

  yield* floatingCode().fontSize(30, 0.85);

  yield* beginSlide("tokio_main");
  yield* floatingCode().selection(lines(4), 1);

  yield* beginSlide("listener");
  yield* floatingCode().selection(lines(6, 8), 1);

  yield* beginSlide("loop");
  yield* floatingCode().selection(lines(10, 20), 1);

  const serviceFnRange = range(15, 51, 15, 68);

  yield* beginSlide("service_fn");
  yield* floatingCode().selection(serviceFnRange, 1);

  yield* beginSlide("service_fn_hello");
  yield* floatingCode().selection([...lines(0, 2), ...serviceFnRange], 1);

  yield* beginSlide("explanation");
  yield* floatingCode().selection(DEFAULT, 1);

  yield* beginSlide("benchmark");
  yield* floatingCode().opacity(0, 1.5);

  let benchmarkBadServer = createRef<CodeBlock>();
  let benchmarkBadServerResults = createRef<CodeBlock>();

  view.add(
    <Layout direction={"column"} alignSelf={"center"} gap={50} layout>
      <CodeBlock
        ref={benchmarkBadServer}
        opacity={0}
        language={"bash"}
        code={`$ cargo run --release --example bad_server`}
        fontFamily={"JetBrains Mono"}
        fontSize={45}
      />
      <CodeBlock
        ref={benchmarkBadServerResults}
        opacity={0}
        language={"bash"}
        code={`$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/`}
        fontFamily={"JetBrains Mono"}
        fontSize={45}
      />
    </Layout>,
  );

  yield* benchmarkBadServer().opacity(1, 1);

  yield* beginSlide("benchmark_results_tease");
  yield* benchmarkBadServerResults().opacity(1, 1);

  yield* beginSlide("benchmark_results");
  yield* benchmarkBadServerResults().edit(
    2,
    false,
  )`$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/${insert(`
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    23.03us    3.94us   1.50ms   84.81%
    Req/Sec    41.66k     1.91k   45.12k    70.67%
  2487129 requests in 1.00m, 211.10MB read
Requests/sec:  41423.86
Transfer/sec:      3.52MB`)}`;

  // 2. show good example - leveraging concurrency
  yield* beginSlide("good_server");
  yield* all(
    benchmarkBadServer().opacity(0, 1),
    benchmarkBadServerResults().opacity(0, 1),
    floatingCode().opacity(1, 1.5),
  );

  yield* beginSlide("good_server_reveal");
  yield* floatingCode().edit(
    0.85,
    false,
  )`async fn hello(_: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    Ok(Response::new(Full::new(Bytes::from("Hello, world!"))))
}

#[tokio::main]
async fn main() -> Result<()> {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));

    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _peer) = listener.accept().await?;
        let io = TokioIo::new(stream);
        ${insert(`
        tokio::task::spawn(async move {`)}
        let http = http1::Builder::new();
        let connection = http.serve_connection(io, service_fn(hello));

        if let Err(err) = connection.await {
            println!("Error serving connection: {err:?}");
        }${insert(`
        }`)}
    }
}`;
  yield* floatingCode().edit(
    0.85,
    false,
  )`async fn hello(_: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    Ok(Response::new(Full::new(Bytes::from("Hello, world!"))))
}

#[tokio::main]
async fn main() -> Result<()> {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));

    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _peer) = listener.accept().await?;
        let io = TokioIo::new(stream);

        tokio::task::spawn(async move {
        ${insert(`    `)}let http = http1::Builder::new();
        ${insert(
          `    `,
        )}let connection = http.serve_connection(io, service_fn(hello));

        ${insert(`    `)}if let Err(err) = connection.await {
            ${insert(`    `)}println!("Error serving connection: {err:?}");
        ${insert(`    `)}}
        }
    }
}`;

  yield* beginSlide("good_server_highlight");
  yield* floatingCode().selection(lines(13, 21), 1);

  // 3. show good example being ruined by blocking code
  //    - also explain how blocking code affects runtime etc.

  // 4. show how to handle blocking code in ruined example
});

import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
  all,
  chain,
  createRefArray,
  DEFAULT,
  Direction,
  slideTransition,
  waitFor,
} from "@motion-canvas/core";
import { beginSlide, createRef } from "@motion-canvas/core/lib/utils";
import {
  CodeBlock,
  insert,
  lines,
  range,
  remove,
  edit,
} from "@motion-canvas/2d/lib/components/CodeBlock";

import { Layout, Txt } from "@motion-canvas/2d";

import { DEFAULT_COLOR_BACKGROUND } from "./defaults";
import { zip } from "../util/functions";

export default makeScene2D(function*(view) {
  view.fill(DEFAULT_COLOR_BACKGROUND);

  let titleLayout = createRef<Layout>();
  const titleRows = createRefArray<Txt>();

  view.add(
    <Layout
      ref={titleLayout}
      direction={"column"}
      alignSelf={"center"}
      layout
    />,
  );

  yield* slideTransition(Direction.Left, 1);

  const titleParts = ["async in action:", "a simple web server"];

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

  yield* beginSlide("bad_code");

  // 1. show bad example - not leveraging concurreny

  const floatingCode = createRef<CodeBlock>();

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

  yield* all(
    ...titleRows.map((t) => t.text("", 1)),
    ...titleRows.map((t) => t.opacity(0, 1)),
    floatingCode().opacity(1, 2.0),
  );

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
  yield* floatingCode().selection(DEFAULT, 2);

  const machineSpecs = createRef<Layout>();
  const machineFields = createRefArray<Txt>();

  const machineFieldContents = [
    "OS:     EndeavourOS GNU/Linux",
    "Kernel: 6.6.2-1-clear",
    "CPU:    AMD Ryzen 7 3700X (8c/16t)",
    "RAM:    64 GiB (3200 MT/s)",
  ];

  view.add(
    <Layout
      ref={machineSpecs}
      direction={"column"}
      alignSelf={"center"}
      alignContent={"start"}
      gap={50}
      layout
    />,
  );

  machineSpecs().add(
    machineFieldContents.map((contents) => (
      <Txt
        ref={machineFields}
        fill={"white"}
        fontFamily={"JetBrains Mono"}
        text={contents}
        opacity={0}
      />
    )),
  );

  yield* beginSlide("machine_specs");
  yield* floatingCode().opacity(0, 1);
  yield* chain(...machineFields.map((field) => field.opacity(1, 0.5)));

  yield* beginSlide("benchmark");
  yield* all(...machineFields.map((field) => field.opacity(0, 0.75)))

  let benchmarkCargoCmd = createRef<CodeBlock>();
  let benchmarkResults = createRef<CodeBlock>();

  view.add(
    <Layout
      direction={"column"}
      alignSelf={"center"}
      gap={25}
      size={"100%"}
      padding={[250, 30, 0, 30]}
      layout
    >
      <CodeBlock
        ref={benchmarkCargoCmd}
        opacity={0}
        language={"bash"}
        code={`$ cargo run --release --example bad_server`}
        fontFamily={"JetBrains Mono"}
        fontSize={45}
      />
      <CodeBlock
        ref={benchmarkResults}
        opacity={0}
        language={"bash"}
        code={`$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/`}
        fontFamily={"JetBrains Mono"}
        fontSize={45}
      />
    </Layout>,
  );

  yield* benchmarkCargoCmd().opacity(1, 1);

  yield* beginSlide("bad_server_benchmark_tease");
  yield* benchmarkResults().opacity(1, 1);

  yield* beginSlide("bad_server_benchmark_results");
  yield* benchmarkResults().edit(
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
    benchmarkCargoCmd().opacity(0, 1),
    benchmarkResults().opacity(0, 1),
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

  yield* beginSlide("good_server_benchmark");
  yield* all(
    floatingCode().selection(DEFAULT, 1),
    floatingCode().opacity(0, 1),
    benchmarkResults().selection(DEFAULT, 1),
  );

  // Reset CodeBoxes here or otherwise it glitches out smh
  yield benchmarkCargoCmd().code(`$ cargo run --release --example good_server`);
  yield benchmarkResults().code(
    `$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/`,
  );

  yield* benchmarkCargoCmd().opacity(1, 1);

  yield* beginSlide("good_server_benchmark_tease");
  yield* benchmarkResults().opacity(1, 1);

  yield* beginSlide("good_server_benchmark_results");
  yield* benchmarkResults().edit(
    2,
    false,
  )`$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/${insert(`
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.79ms    1.29ms  23.05ms   82.19%
    Req/Sec    68.03k     7.68k   82.97k    64.98%
  32489434 requests in 1.00m, 2.69GB read
Requests/sec: 540820.54
Transfer/sec:     45.90MB`)}`;

  yield* beginSlide("good_server_benchmark_highlight");
  yield* benchmarkResults().selection(lines(7, 7), 1);

  yield* beginSlide("better_server_reveal");
  yield* all(benchmarkResults().opacity(0, 1), benchmarkCargoCmd().opacity(0, 1));

  yield floatingCode().code(`async fn spawn_listener(addr: SocketAddr) -> Result<mpsc::Receiver<(TcpStream, SocketAddr)>> {
    let (sender, receiver) = mpsc::channel(1024);

    tokio::task::spawn(async move {
        let listener = TcpListener::bind(addr)
            .await
            .expect("Failed to bind to TCP socket. Is the port perhaps already in use?");

        loop {
            match listener.accept().await {
                Ok(incoming) => {
                    if let Err(err) = sender.send(incoming).await {
                        println!("Error while sending incoming TcpStream: {err:?}");
                        break;
                    }
                }
                Err(err) => println!("Error while accepting connection: {err:?}"),
            };
        }
    });

    Ok(receiver)
}`
  );

  yield* all(
    floatingCode().opacity(1, 1),
  );

  yield* beginSlide("better_server_reveal_main");
  yield* all(
    floatingCode().edit(2, false)`${edit(`async fn spawn_listener(addr: SocketAddr) -> Result<mpsc::Receiver<(TcpStream, SocketAddr)>> {
    let (sender, receiver) = mpsc::channel(1024);

    tokio::task::spawn(async move {
        let listener = TcpListener::bind(addr)
            .await
            .expect("Failed to bind to TCP socket. Is the port perhaps already in use?");

        loop {
            match listener.accept().await {
                Ok(incoming) => {
                    if let Err(err) = sender.send(incoming).await {
                        println!("Error while sending incoming TcpStream: {err:?}");
                        break;
                    }
                }
                Err(err) => println!("Error while accepting connection: {err:?}"),
            };
        }
    });

    Ok(receiver)
}`, `#[tokio::main]
async fn main() -> Result<()> {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));

    let mut receiver = spawn_listener(addr).await?;

    loop {
        if let Some((stream, _peer)) = receiver.recv().await {
            let io = TokioIo::new(stream);

            tokio::task::spawn(async move {
                let http = http1::Builder::new();
                let connection = http.serve_connection(io, service_fn(hello));

                if let Err(err) = connection.await {
                    println!("Error serving connection: {err:?}");
                }
            });
        } else {
            println!("Channel closed.");
            return Ok(());
        }
    }
}`)}`,
  );

  yield* beginSlide("better_server_benchmark");
  yield* all(
    floatingCode().selection(DEFAULT, 1),
    floatingCode().opacity(0, 1),
    benchmarkResults().selection(DEFAULT, 1),
  );

  // Reset CodeBoxes here or otherwise it glitches out smh
  yield benchmarkCargoCmd().code(`$ cargo run --release --example good_server_mk2`);
  yield benchmarkResults().code(
    `$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/`,
  );

  yield* benchmarkCargoCmd().opacity(1, 1);

  yield* beginSlide("better_server_benchmark_tease");
  yield* benchmarkResults().opacity(1, 1);

  yield* beginSlide("better_server_benchmark_results");
  yield* benchmarkResults().edit(
    2,
    false,
  )`$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/${insert(`
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.45ms    1.41ms  33.80ms   91.17%
    Req/Sec    89.61k     8.58k  114.63k    67.93%
  42800552 requests in 1.00m, 3.55GB read
Requests/sec: 712323.96
Transfer/sec:     60.46MB`)}`;

  yield* beginSlide("better_server_benchmark_highlight");
  yield* benchmarkResults().selection(lines(7, 7), 1);


  yield* beginSlide("even_better_server_reveal");
  yield* all(benchmarkResults().opacity(0, 1), benchmarkCargoCmd().opacity(0, 1));

  yield floatingCode().code(`async fn spawn_handler(mut receiver: mpsc::Receiver<(TcpStream, SocketAddr)>) -> Result<JoinHandle<()>> {
    let handle = tokio::task::spawn(async move {
        loop {
            if let Some((stream, _peer)) = receiver.recv().await {
                let io = TokioIo::new(stream);

                tokio::task::spawn(async move {
                    let http = http1::Builder::new();
                    let connection = http.serve_connection(io, service_fn(hello));

                    if let Err(err) = connection.await {
                        println!("Error serving connection: {err:?}");
                    }
                });
            } else {
                println!("Channel closed.");
            }
        }
    });

    Ok(handle)
}`
  );

  yield* all(
    floatingCode().opacity(1, 1),
  );

  yield* beginSlide("even_better_server_reveal_main");
  yield* all(
    floatingCode().edit(2, false)`${edit(`async fn spawn_handler(mut receiver: mpsc::Receiver<(TcpStream, SocketAddr)>) -> Result<JoinHandle<()>> {
    let handle = tokio::task::spawn(async move {
        loop {
            if let Some((stream, _peer)) = receiver.recv().await {
                let io = TokioIo::new(stream);

                tokio::task::spawn(async move {
                    let http = http1::Builder::new();
                    let connection = http.serve_connection(io, service_fn(hello));

                    if let Err(err) = connection.await {
                        println!("Error serving connection: {err:?}");
                    }
                });
            } else {
                println!("Channel closed.");
            }
        }
    });

    Ok(handle)
}`, `#[tokio::main]
async fn main() -> Result<()> {
    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));

    let receiver = spawn_listener(addr).await?;
    let handle = spawn_handler(receiver).await?;
    
    handle.await.map_err(Into::into)
}`)}`,
  );

  yield* beginSlide("sync_work");
  yield* floatingCode().opacity(0, 1);
  yield floatingCode().code(`#[tokio::main]
async fn main() -> Result<()> {
    let mut receiver = spawn_producers(12).await?;

    loop {
        if let Some(job) = receiver.recv().await {
            let t_start = Instant::now();
            let res = job();
            let elapsed = t_start.elapsed();

            println!(" --> {res:10} - completed job in {elapsed:02.02?}");
        } else {
            println!("Channel closed");
            break;
        }
    }

    Ok(())
}`);
  yield* floatingCode().opacity(1, 1);

  yield* beginSlide("sync_work_spawn_blocking");
  yield* floatingCode().edit(1, false)`#[tokio::main]
async fn main() -> Result<()> {
    let mut receiver = spawn_producers(12).await?;

    loop {
        if let Some(job) = receiver.recv().await {${insert(`
            tokio::task::spawn_blocking(move || \{)`)}
            ${insert(`    `)}let t_start = Instant::now();
            ${insert(`    `)}let res = job();
            ${insert(`    `)}let elapsed = t_start.elapsed();

            ${insert(`    `)}println!(" --> {res:10} - completed job in {elapsed:02.02?}");${insert(`
            });`)}
        } else {
            println!("Channel closed");
            break;
        }
    }

    Ok(())
}`;

  yield* beginSlide("sync_work_intro");

  yield* floatingCode().opacity(0, 1);
  yield floatingCode().code(`type SyncTask = Box<dyn Fn() -> Result<()> + Send + Sync>;

struct WorkerThread {
    handle: Option<std::thread::JoinHandle<()>>,
    sender: Option<mpsc::Sender<SyncTask>>,
    error: Arc<Mutex<Option<Error>>>,
}`);
  yield* floatingCode().opacity(1, 1);
  yield* floatingCode().fontSize(46, 1);


  yield* beginSlide("sync_work_sequential_worker");
  yield* floatingCode().opacity(0, 1);
  yield floatingCode().fontSize(25);
  yield floatingCode().code(`impl WorkerThread {
    pub fn new() -> Self {
        const QUEUE_SIZE: usize = 1024;

        let (sender, mut receiver) = mpsc::channel::<SyncTask>(QUEUE_SIZE);
        let error: Arc<Mutex<Option<Error>>> = Arc::new(Mutex::new(None));

        let handle = std::thread::spawn({
            let error = Arc::clone(&error);
            move || {
                while let Some(task) = receiver.blocking_recv() {
                    match task() {
                        Ok(()) => {}
                        Err(err) => {
                            let mut guard = error.lock().unwrap();
                            let _ = guard.replace(err);
                            break;
                        }
                    };
                }
            }
        });

        Self {
            handle: Some(handle),
            sender: Some(sender),
            error,
        }
    }

    // ...
}`);
  yield* floatingCode().opacity(1, 1);

  yield* beginSlide("sync_work_seq_worker_impl");
  yield* floatingCode().opacity(0, 1);
  yield floatingCode().code(`impl WorkerThread {
    async fn send(&self, task: SyncTask) -> Result<()> {
        if let Some(ref sender) = self.sender {
            sender.send(task).await?;
        }

        Ok(())
    }

    fn clone_err(&self) -> Arc<Mutex<Option<Error>>> {
        Arc::clone(&self.error)
    }
}`);
  yield* floatingCode().opacity(1, 1);
  yield* floatingCode().fontSize(46, 1);

  yield* beginSlide("sync_work_seq_worker_drop");
  yield* floatingCode().opacity(0, 1);
  yield floatingCode().fontSize(36, 1);
  yield floatingCode().code(`impl Drop for WorkerThread {
    fn drop(&mut self) {
        drop(self.sender.take());

        let _ = self.handle.take().map(|handle| {
            handle
                .join()
                .map_err(|err| println!("Error while joining worker thread: {err:?}"))
        });
    }
}`)
  yield* floatingCode().opacity(1, 1);

  yield* beginSlide("sync_work_seq_worker_main");

  yield* floatingCode().opacity(0, 1);
  yield floatingCode().fontSize(25);
  yield floatingCode().code(`#[tokio::main]
async fn main() -> Result<()> {
    let mut receiver = spawn_producers(12).await?;

    let worker = WorkerThread::new();

    loop {
        if let Some(job) = receiver.recv().await {
            let task = move || {
                let t_start = Instant::now();
                let res = job();
                let elapsed = t_start.elapsed();

                println!(" --> {res:10} - completed job in {elapsed:02.02?}");

                Ok(())
            };

            if let Err(err) = worker.send(Box::new(task)).await {
                println!("Error while sending task: {err:?}");

                if let Some(err) = worker.clone_err().lock().unwrap().take() {
                    println!("Error within sync worker: {err:?}");
                }
            }
        } else {
            println!("Channel closed");
            break;
        }
    }

    Ok(())
}`);

  yield* floatingCode().opacity(1, 1);

  yield* beginSlide("next_scene");
  yield* all(
    floatingCode().opacity(0, 1),
  )
});

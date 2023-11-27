use std::convert::Infallible;
use std::net::SocketAddr;
use std::time::Duration;

use anyhow::Result;

use http_body_util::Full;

use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};

use hyper_util::rt::TokioIo;

use tokio::net::TcpListener;

async fn hello(_: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    let sleep_duration = Duration::from_millis(500);
    std::thread::sleep(sleep_duration);

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
            let http = http1::Builder::new();
            let connection = http.serve_connection(io, service_fn(hello));

            if let Err(err) = connection.await {
                println!("Error serving connection: {err:?}");
            }
        });
    }
}

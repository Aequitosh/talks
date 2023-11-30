use std::convert::Infallible;
use std::net::SocketAddr;

use anyhow::Result;

use http_body_util::Full;

use hyper::body::Bytes;
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{Request, Response};

use hyper_util::rt::TokioIo;

use tokio::net::{TcpListener, TcpStream};
use tokio::sync::mpsc;

async fn hello(_: Request<hyper::body::Incoming>) -> Result<Response<Full<Bytes>>, Infallible> {
    Ok(Response::new(Full::new(Bytes::from("Hello, world!"))))
}

async fn spawn_listener(addr: SocketAddr) -> Result<mpsc::Receiver<(TcpStream, SocketAddr)>> {
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
}

#[tokio::main]
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
}

use std::time::{Duration, Instant};

use anyhow::{bail, Result};
use rand::Rng;
use tokio::sync::mpsc;

fn fib(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        n => fib(n - 1) + fib(n - 2),
    }
}

async fn spawn_producers(count: usize) -> Result<mpsc::Receiver<impl Fn() -> u64>> {
    if count == 0 {
        bail!("count must be > 0");
    }

    let (sender, receiver) = mpsc::channel(1024);
    let mut count_spawned: usize = 0;

    loop {
        tokio::task::spawn({
            let sender = sender.clone();
            let producer_id = count_spawned;

            let work_amount = rand::thread_rng().gen_range(35..=45);
            let sleep_amount = 1 + work_amount % 10;

            async move {
                loop {
                    let job = move || fib(work_amount);

                    if let Err(err) = sender.send(job).await {
                        println!(
                            "[{producer_id:02}] Error while sending \
                            job worth {work_amount} work: {err:?}"
                        );
                        return;
                    }

                    println!(
                        "[{producer_id:02}] Sent job worth {work_amount}; \
                        proceeding to sleep for {sleep_amount:02} seconds."
                    );
                    tokio::time::sleep(Duration::from_secs(sleep_amount)).await;
                }
            }
        });

        count_spawned += 1;

        if count_spawned == count {
            break;
        }
    }

    Ok(receiver)
}

#[tokio::main]
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
}

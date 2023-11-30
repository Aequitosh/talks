use std::{
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};

use anyhow::{bail, Error, Result};
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

type SyncTask = Box<dyn Fn() -> Result<()> + Send + Sync>;

struct WorkerThread {
    handle: Option<std::thread::JoinHandle<()>>,
    sender: Option<mpsc::Sender<SyncTask>>,
    error: Arc<Mutex<Option<Error>>>,
}

impl WorkerThread {
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

    async fn send(&self, task: SyncTask) -> Result<()> {
        if let Some(ref sender) = self.sender {
            sender.send(task).await?;
        }

        Ok(())
    }

    fn clone_err(&self) -> Arc<Mutex<Option<Error>>> {
        Arc::clone(&self.error)
    }
}

impl Drop for WorkerThread {
    fn drop(&mut self) {
        drop(self.sender.take());

        let _ = self.handle.take().map(|handle| {
            handle
                .join()
                .map_err(|err| println!("Error while joining worker thread: {err:?}"))
        });
    }
}

#[tokio::main]
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
}

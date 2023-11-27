# Benchmark Results

**NOTE:** These results aren't really that representative of real-world
applications and just serve as a means to underline the difference between the
examples shown in the talk.

## Kernel

```bash
$ uname -srvmo
Linux 6.6.2-1-clear #1 SMP Fri, 24 Nov 2023 19:11:35 +0000 x86_64 GNU/Linux
```

## Hardware

```bash
$ sudo inxi -Cm
Memory:
  System RAM: total: 64 GiB available: 62.72 GiB used: 17.22 GiB (27.5%)
  Array-1: capacity: 128 GiB slots: 4 modules: 4 EC: None
  Device-1: DIMM 0 type: DDR4 size: 16 GiB speed: 3200 MT/s
  Device-2: DIMM 1 type: DDR4 size: 16 GiB speed: 3200 MT/s
  Device-3: DIMM 0 type: DDR4 size: 16 GiB speed: 3200 MT/s
  Device-4: DIMM 1 type: DDR4 size: 16 GiB speed: 3200 MT/s
CPU:
  Info: 8-core model: AMD Ryzen 7 3700X bits: 64 type: MT MCP cache: L2: 4 MiB
  Speed (MHz): avg: 3600 min/max: 2200/4426 cores: 1: 3600 2: 3600 3: 3600
    4: 3600 5: 3600 6: 3600 7: 3600 8: 3600 9: 3600 10: 3600 11: 3600 12: 3600
    13: 3600 14: 3600 15: 3600 16: 3600
```

## Results

### `examples/bad_server.rs`

```bash
$ cargo run --release --example bad_server
```

```bash
$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    23.03us    3.94us   1.50ms   84.81%
    Req/Sec    41.66k     1.91k   45.12k    70.67%
  2487129 requests in 1.00m, 211.10MB read
Requests/sec:  41423.86
Transfer/sec:      3.52MB
```


### `examples/good_server.rs`

```bash
$ cargo run --release --example good_server
```

```bash
$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.79ms    1.29ms  23.05ms   82.19%
    Req/Sec    68.03k     7.68k   82.97k    64.98%
  32489434 requests in 1.00m, 2.69GB read
Requests/sec: 540820.54
Transfer/sec:     45.90MB
```


### `examples/good_server_blocking.rs`

```bash
$ cargo run --release --example good_server_blocking
```

```bash
$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.21s   495.06ms   2.00s    63.64%
    Req/Sec     4.09      5.39   141.00     96.41%
  1919 requests in 1.00m, 166.79KB read
  Socket errors: connect 0, read 0, write 0, timeout 1831
Requests/sec:     31.93
Transfer/sec:      2.78KB
```


### `examples/good_server_blocking_task.rs`

```bash
$ cargo run --release --example good_server_blocking_task
```

```bash
$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   972.77ms  109.85ms   1.02s    94.52%
    Req/Sec   210.59    225.79     1.03k    80.12%
  61440 requests in 1.00m, 5.21MB read
Requests/sec:   1022.62
Transfer/sec:     88.88KB
```


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


### `examples/good_server_mk2.rs`

```bash
$ cargo run --release --example good_server_mk2
```

```bash
$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.45ms    1.41ms  33.80ms   91.17%
    Req/Sec    89.61k     8.58k  114.63k    67.93%
  42800552 requests in 1.00m, 3.55GB read
Requests/sec: 712323.96
Transfer/sec:     60.46MB
```


### `examples/good_server_mk3.rs`

```bash
$ cargo run --release --example good_server_mk3
```

```bash
$ wrk -t $(( $(nproc) / 2 )) -d 60s -c 1000 http://127.0.0.1:8080/
Running 1m test @ http://127.0.0.1:8080/
  8 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.44ms    1.43ms  33.59ms   91.36%
    Req/Sec    90.29k     9.36k  124.71k    68.42%
  43118137 requests in 1.00m, 3.57GB read
Requests/sec: 717609.84
Transfer/sec:     60.91MB
```


# Talks

Collections of talks / presentations I held or will hold. Thanks for checking
this out!

As of right now, this repository only consists of a single [Motion Canvas](https://github.com/motion-canvas/motion-canvas)
project.

## Usage

### Local

You use this essentially as every other [Motion Canvas](https://github.com/motion-canvas/motion-canvas)
project.

1. Make sure you have [Node.js](https://nodejs.org) >= 16.0 as well as `npm` installed
2. `npm install`
3. `npm run serve`
4. Have fun!

### Docker

For your convenience, this also comes with a handy [`Dockerfile`](./Dockerfile)
that you can use to run [Motion Canvas](https://github.com/motion-canvas/motion-canvas)
in a containerized environment.

1. Make sure you have [Docker](https://docker.com) installed.
2. `docker build -t motion-canvas .`
3. `docker run --rm -d -p 9000:9000 --name motion-canvas motion-canvas:latest`
4. Have fun!

#### Notes

* Rendering with `ffmpeg` inside the Docker container is not supported yet.
  If you try to render something, the container will crash.
* The container doesn't have any mount points at the moment, which means that
  `src/` directory is baked directly into the image. This is somewhat suboptimal,
  but I haven't bothered to update the [`Dockerfile`](./Dockerfile) yet.
* The talks `rust-vienna/2023-11-30` and `rust-vienna/2024-04-05` have been made
  with the assumption that they'll run on 1080p screens, so you'll have to
  change the resolution in `project.meta` accordingly. Newer talks are made with
  4K resolution by default.


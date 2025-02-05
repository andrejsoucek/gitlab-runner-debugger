# Gitlab Local Runner

This is a simple tool that simulates a Docker executor run locally. It is intended to be used for testing purposes. Entrypoints might not be fully supported.

## Usage
1. Download `glr` binary
1. Run `./glr -h` in your terminal to see the available commands
   1. If you want to pass env variables to the container,
      simply run the command with the env vars set: `MY_VAR=foo ./glr run-job <yaml-path> <job-name>`

## Development

To install dependencies:

```bash
bun install
```

To run locally:

```bash
bun run index.ts
```

To compile:

```bash
bun run compile
```

This project was created using `bun init` in bun v1.0.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

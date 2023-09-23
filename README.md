# Gitlab Local Runner

This is a simple tool that simulates a docker-in-docker run locally. It is intended to be used for testing purposes.

## Usage
1. Download `glr` binary
1. Run `./glr -h` in your terminal to see the available commands

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

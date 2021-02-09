# tachiyomi-backup-models
Manipulate Tachiyomi backup models directly from sources

A protobuf output is available by default, but you can build your own adapter

## Example
```sh
git clone https://github.com/tachiyomiorg/tachiyomi.git
deno run --allow-read --allow-write mod.ts tachiyomi.proto
```

> The out file doesn't work with `protoc` but work with [`protobuf.js`](https://github.com/protobufjs/protobuf.js)

## Usage
```
deno run --allow-read [--allow-write] mod.ts [--adapter <adapter.ts>] [--models <models dir>] [output-file]

argument:
  output-file:              The output file (stdout if not provided or set to "-")
  --adapter <adapter_file>: use a custom adapter (use protobuf by default)
  --models <models dir>:    Path to tachiyomi backup models (default to ./tachiyomi/app/src/main/java/eu/kanade/tachiyomi/data/backup/full/models/)

Permission:
  --allow-read  required to read models
  --allow-write required when writing to a file
```

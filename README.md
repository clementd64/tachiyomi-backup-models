# tachiyomi-backup-models
Manipulate Tachiyomi backup models directly from sources

It automaticaly download backup models from github, or use your local clone  
A protobuf output is available by default, but you can build your own adapter

## Example
```sh
deno run --allow-net --allow-write mod.ts tachiyomi.proto
```

## Use local models
```sh
git clone https://github.com/tachiyomiorg/tachiyomi.git
deno run --allow-read --allow-write mod.ts tachiyomi.proto --models ./tachiyomi/app/src/main/java/eu/kanade/tachiyomi/data/backup/full/models/
```

## Usage
```
deno run [permission] mod.ts [options] [output-file]

argument:
  output-file:            The output file (stdout if not provided or set to "-")
  --ref <repo refs>:      Reference of the remote repo to use (default to master)
  --models <models dir>:  Path to tachiyomi backup models (priority over --ref)
  --add-invalid           Add invalid type, for backup before v0.12.2, but break protoc compatibility (default false)

Permission:
  --allow-net   required to download models from github
  --allow-read  required to use local models
  --allow-write required when writing to a file
```

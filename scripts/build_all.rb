#!/usr/bin/env ruby

`rm -rf ./dist/`
`mkdir ./dist/`
`./scripts/build_entries.rb`
`./scripts/build_index.rb`

#!/usr/bin/env ruby

`rm -rf ./dist/`
`mkdir ./dist/`
`./bin/build_entries.rb`
`./bin/build_index.rb`

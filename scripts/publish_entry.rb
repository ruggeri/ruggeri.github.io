#!/usr/bin/env ruby

require 'yaml'

entry_dirname = ARGV.shift
raise "WTF" unless entry_dirname

meta_path = Dir["#{entry_dirname}/*yaml"][0]
raise "WTF" unless meta_path

meta = YAML.load(File.read(meta_path))

raise "FILE IS ALREADY PUBLISHED" if meta["is_published"]

meta["is_published"] = true
meta["publication_time"] = Time.now

File.open(meta_path, "w") { |f| f.puts meta.to_yaml }

# Because why force me to rebuild manually
`./scripts/build_all.rb`

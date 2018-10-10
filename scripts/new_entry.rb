#!/usr/bin/env ruby

require 'yaml'

ENTRIES_DIR = "./entries"

basename = ARGV.shift
date_string = Time.now.strftime("%Y-%m-%d")
# If no basename is given that's okay.
basename ||= date_string
entry_dir = "#{ENTRIES_DIR}/#{date_string}"

slim_fname = "#{entry_dir}/#{basename}.slim"
yaml_fname = "#{entry_dir}/#{basename}.yaml"
if File.exist?(slim_fname) || File.exist?(yaml_fname)
  raise "WTF"
end

`mkdir -p #{entry_dir}`
File.open(slim_fname, "w") do |f|
  f.puts "h1 HELLO WORLD"
end
File.open(yaml_fname, "w") do |f|
  f.puts ({
            "title" => basename,
            "is_published" => false,
            "publication_time" => nil,
          }).to_yaml
end

`touch #{entry_dir}/#{basename}.yaml`

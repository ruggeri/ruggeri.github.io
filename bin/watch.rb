#!/usr/bin/env ruby

require 'open3'
require_relative '../src/entry'

`./bin/build_all.rb`
Open3.popen3("fswatch ./entries ./templates") do |stdin, stdout, stderr, status, thread|
  while changed_fname = stdout.gets
    puts "Changed: #{changed_fname}"
    if /.*\/templates/.match(changed_fname)
      puts "Rebuilding all..."
      `./bin/build_all.rb`
    elsif res = /.*\/entries\/(.*)\.(yaml|slim)/.match(changed_fname)
      yaml_file = "./entries/#{res[1]}.yaml"
      puts "Rebuilding one..."
      Entry.new(yaml_file).build!
      puts "Rebuilding index..."
      `./bin/build_index.rb`
    end
  end
end

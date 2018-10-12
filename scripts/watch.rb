#!/usr/bin/env ruby

require 'open3'

`./scripts/build_all.rb`
Open3.popen3("fswatch ./entries ./templates") do |stdin, stdout, stderr, status, thread|
  while changed_fname = stdout.gets
    puts "Changed: #{changed_fname}"
    `./scripts/build_all.rb`
  end
end

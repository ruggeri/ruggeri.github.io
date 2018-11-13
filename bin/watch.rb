#!/usr/bin/env ruby

require 'open3'

`./bin/build_all.rb`
Open3.popen3("fswatch ./entries ./templates") do |stdin, stdout, stderr, status, thread|
  while changed_fname = stdout.gets
    puts "Changed: #{changed_fname}"
    `./bin/build_all.rb`
  end
end

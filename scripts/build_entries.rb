#!/usr/bin/env ruby

require_relative '../src/entry'

Entry.published.each do |e|
  puts "Building: #{e.full_target_path}"
  e.build!
end

#!/usr/bin/env ruby

require_relative '../src/entry'

Entry.all.each do |e|
  # Even build the unpublished ones (so I can see them as I write).

  puts "Building: #{e.full_target_path}"
  e.build!
end

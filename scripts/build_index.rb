#!/usr/bin/env ruby

require 'slim'
require_relative '../src/entry'

def main
  source = File.read("./entries/index.slim")
  content = Slim::Template.new { source }.render nil, ({ published_entries: Entry.published })
  File.open("./dist/index.html", "w") { |f| f.puts content }
end

main

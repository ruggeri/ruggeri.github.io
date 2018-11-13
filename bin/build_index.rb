#!/usr/bin/env ruby

require 'slim'
require_relative '../src/entry'

def main
  source = File.read("./entries/index.slim")
  published_entries = Entry.published.sort_by { |e| e.meta. publication_time }.reverse
  content = Slim::Template.new { source }.render nil, ({ published_entries: published_entries })
  File.open("./index.html", "w") { |f| f.puts content }

  # Render login page.
  source = File.read("./entries/login.slim")
  content = Slim::Template.new { source }.render
  File.open("./login.html", "w") { |f| f.puts content }
end

main

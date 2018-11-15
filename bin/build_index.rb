#!/usr/bin/env ruby

require 'slim'
require_relative '../src/entry'

def main
  source = File.read("./entries/index.slim")
  head_source = File.read("./templates/head.slim")
  head_content = Slim::Template.new { head_source }.render

  published_entries = Entry.published.sort_by do |e|
    e.meta.publication_time
  end.reverse
  content = Slim::Template.new { source }.render(
    nil, { head_content: head_content,
           published_entries: published_entries }
  )

  File.open("./index.html", "w") { |f| f.puts content }

  # Render login page.
  source = File.read("./entries/login.slim")
  content = Slim::Template.new { source }.render
  File.open("./login.html", "w") { |f| f.puts content }
end

main

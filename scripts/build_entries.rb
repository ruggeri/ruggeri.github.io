#!/usr/bin/env ruby

# must brew install pandoc for markdown
require 'pathname'
require 'slim'

ENTRY_DIR = "./entries"

class Entry
  attr_reader :content_path, :meta_path

  def initialize(meta_path)
    raise "WTF" unless meta_path =~ /\.yaml$/
    @meta_path = meta_path
    @content_path = meta_path.gsub(/\.yaml$/, ".slim")
  end

  def content
    source = File.read(content_path)
    content = Slim::Template.new { source }.render
    content
  end

  def write_out_to_file!(file)
    file.puts content
  end

  def content_basename
    Pathname.new(content_path).basename.to_s
  end

  def content_dirname
    Pathname.new(content_path).dirname
  end

  def target_basename
    content_basename.gsub(/\.slim$/, ".html")
  end

  def target_dirname
    content_relative_dirname = content_dirname.to_s.gsub(
      ENTRY_DIR + "/", ""
    )
    "./dist/" + content_relative_dirname
  end

  def target_path
    target_dirname + "/" + target_basename
  end

  def touch_target_dirname
    `mkdir -p #{target_dirname}`
  end

  def build!
    puts "Building: #{content_dirname}"
    touch_target_dirname
    File.open(target_path, "w") { |f| write_out_to_file! f }
  end
end

Dir["#{ENTRY_DIR}/*/*yaml"].each do |meta_path|
  Entry.new(meta_path).build!
end

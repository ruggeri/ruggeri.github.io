# must brew install pandoc for markdown
require 'pathname'
require 'slim'
require 'yaml'

class EntryMeta
  attr_reader :payload
  def initialize(meta_yaml_payload)
    @payload = meta_yaml_payload
  end

  def is_published?
    @payload["is_published"]
  end

  def publication_time
    @payload["publication_time"]
  end

  def title
    @payload["title"]
  end
end

class Entry
  ENTRIES_DIR = "./entries"

  def self.all
    Dir["#{ENTRIES_DIR}/*/*yaml"].map { |mp| Entry.new mp }
  end

  def self.published
    all.select { |e| e.meta.is_published? }
  end

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

  def meta
    return @meta if @meta
    @meta = EntryMeta.new YAML.load(File.read(meta_path))
    @meta
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

  def relative_dirname
    content_dirname.to_s.gsub(/^#{ENTRIES_DIR}\//, "")
  end

  def target_basename
    content_basename.gsub(/\.slim$/, ".html")
  end

  def target_dirname
    "./dist/" + relative_dirname
  end

  def full_target_path
    target_dirname + "/" + target_basename
  end

  def relative_target_path
    relative_dirname + "/" + target_basename
  end

  def touch_target_dirname
    `mkdir -p #{target_dirname}`
  end

  def build!
    touch_target_dirname
    File.open(full_target_path, "w") { |f| write_out_to_file! f }
  end
end

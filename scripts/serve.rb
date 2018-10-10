#!/usr/bin/env ruby

require 'webrick'

s = WEBrick::HTTPServer.new(:Port => 3000,  :DocumentRoot => ".")

trap("INT") {
  s.shutdown
}

s.start

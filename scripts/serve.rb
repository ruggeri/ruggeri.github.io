#!/usr/bin/env ruby

require 'webrick'

server = WEBrick::HTTPServer.new(:Port => 3000)

server.mount '/', WEBrick::HTTPServlet::FileHandler, './'

trap("INT") {
  server.shutdown
}

server.start

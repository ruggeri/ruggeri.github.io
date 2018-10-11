#!/usr/bin/env ruby

require 'webrick'

server = WEBrick::HTTPServer.new(:Port => 3000)

server.mount '/blog2', WEBrick::HTTPServlet::FileHandler, './'

trap("INT") {
  server.shutdown
}

server.start

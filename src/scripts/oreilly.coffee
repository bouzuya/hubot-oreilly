# Description
#   A Hubot script that returns oreilly books
#
# Configuration:
#   None
#
# Commands:
#   hubot oreilly - returns oreilly books
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  request = require 'request-b'
  cheerio = require 'cheerio'
  URL = require 'url'

  robot.respond /oreilly$/i, (res) ->
    baseUrl = 'http://www.oreilly.co.jp'
    catalogUrl = baseUrl + '/catalog/'
    request(catalogUrl).then (r) ->
      $ = cheerio.load r.body
      books = []
      $('#bookTable tr').each ->
        e = $ @
        isbn = e.find('td:nth-child(1)').text()
        title = e.find('td.title').text()
        id = e.find('td.title').attr('id')
        url = "#{baseUrl}/books/#{id}"
        img = "#{baseUrl}/books/images/picture#{isbn}.gif"
        books.push { isbn, title, url, img }
      book = res.random(books)
      res.send """
        #{book.img}
        #{book.title}
        #{book.url}
      """

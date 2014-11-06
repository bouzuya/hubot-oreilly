// Description
//   A Hubot script that returns oreilly books
//
// Configuration:
//   None
//
// Commands:
//   hubot oreilly - returns oreilly books
//
// Author:
//   bouzuya <m@bouzuya.net>
//
module.exports = function(robot) {
  var URL, cheerio, request;
  request = require('request-b');
  cheerio = require('cheerio');
  URL = require('url');
  return robot.respond(/oreilly$/i, function(res) {
    var baseUrl, catalogUrl;
    baseUrl = 'http://www.oreilly.co.jp';
    catalogUrl = baseUrl + '/catalog/';
    return request(catalogUrl).then(function(r) {
      var $, book, books;
      $ = cheerio.load(r.body);
      books = [];
      $('#bookTable tr').each(function() {
        var e, id, img, isbn, title, url;
        e = $(this);
        isbn = e.find('td:nth-child(1)').text();
        title = e.find('td.title').text();
        id = e.find('td.title').attr('id');
        url = "" + baseUrl + "/books/" + id;
        img = "" + baseUrl + "/books/images/picture" + isbn + ".gif";
        return books.push({
          isbn: isbn,
          title: title,
          url: url,
          img: img
        });
      });
      book = res.random(books);
      return res.send("" + book.img + "\n" + book.title + "\n" + book.url);
    });
  });
};

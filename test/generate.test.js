const superagent = require('superagent');
const expect = require('chai').expect;
var fs = require('fs');

let host = 'http://localhost:3000';
let urlAPI = '/api/generate/'

describe('API generate --> /api/generate/', function() {

  let app = require('../src/app.js');
  let instance;

  before(function() {
    instance = app.listen(3000);
  });
  after(function() {
    instance.close();
  });

  describe('GET', function() {
    it(`GIVEN ${urlAPI}
        WHEN send GET request
        THEN should return 200`, function(done) {
      superagent.get(`${host}${urlAPI}`)
        .end(function(e, res) {
          expect(res.status).to.eql(200)
          done()
        })
    })
  })

  describe('GET', function() {
    it(`GIVEN ${urlAPI} with parameters ext=asciidoc and template=basic
       WHEN send GET request
       THEN should return the readme write in asciicode for a basic project`, function(done) {

      superagent.get(`${host}${urlAPI}?ext=asciidoc&template=basic`)
        .end(function(e, res) {

          fs.readFile('src/templates/asciidoc/basic.asciidoc', function(err, data) {

            resultat = JSON.parse(res.text);

            expect(res.status).to.eql(200)
            expect(resultat).to.eql({
              ext : 'asciidoc',
              template : 'basic',
              file : data.toString()
            })
            done()

          });

        })

    })
  })


})

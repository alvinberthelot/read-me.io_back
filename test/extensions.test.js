const superagent = require('superagent');
const expect = require('chai').expect;

let host = 'http://localhost:3000';
let urlAPI = '/api/extensions'

describe('Project Root --> /', function() {

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
        THEN should return a JSON object with a list of available `, function(done) {
      superagent.get(`${host}${urlAPI}`)
        .end(function(e, res) {
          expect(res.status).to.eql(200)
          expect(JSON.parse(res.text)).to.eql({extensions:['asciidoc','markdown','txt']})
          done()
        })
    })
  })

})

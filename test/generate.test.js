const superagent = require('superagent');
const expect = require('chai').expect;
const before  = require('mocha').before;
const after  = require('mocha').after;
const describe  = require('mocha').describe;
const it = require('mocha').it;

var fs = require('fs');

const host = 'http://localhost:3000';
const urlAPI = '/api/generate';

describe('API generate', function() {

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
        THEN should return 200`,
      function(done) {
        superagent.get(`${host}${urlAPI}`)
          .end(function(e, res) {
            expect(res.status).to.eql(200);
            done();
          });
      });

    it(`GIVEN ${urlAPI}
        WHEN send GET request with parameters ext=asciidoc and template=basic
        THEN should fetch the readme in asciidoc format for a basic project`,
      function(done) {
        superagent.get(`${host}${urlAPI}?ext=asciidoc&template=basic`)
          .end(function(e, res) {
            fs.readFile('src/templates/asciidoc/basic.asciidoc', function(err, data) {
              var resultat = JSON.parse(res.text);
              expect(res.status).to.eql(200);
              expect(resultat).to.eql({
                ext: 'asciidoc',
                template: 'basic',
                file: data.toString()
              });
              done();
            });
          });
      });

    it(`GIVEN ${urlAPI}
        WHEN send GET request with parameters ext=xxxx and template=basic
        THEN should return a 400`,
      function(done) {
        superagent.get(`${host}${urlAPI}?ext=xxxx&template=basic`)
          .end(function(e, res) {
            expect(res.status).to.eql(400);
            expect(JSON.parse(res.text)).to.eql({
              err:'Value submitted for parameter extension is not recognized, the value should be one these : asciidoc,markdown,txt'
            });
            done();
          });
      }
    );

    it(`GIVEN ${urlAPI}
        WHEN send GET request with parameters ext=asciidoc and template=xxxx
        THEN should return a 400`,
      function(done) {
        superagent.get(`${host}${urlAPI}?ext=asciidoc&template=xxxx`)
          .end(function(e, res) {
            expect(res.status).to.eql(400);
            expect(JSON.parse(res.text)).to.eql({err:'Value submitted for parameter template is not recognized, the value should be one these : basic,csharp,java,node,python'});
            done();
          });
      });

      it(`GIVEN ${urlAPI}
          WHEN send GET request with one parameters ext=asciidoc
          THEN should return an asciidoc\\basic template`,
        function(done) {
          superagent.get(`${host}${urlAPI}?ext=asciidoc`)
            .end(function(e, res) {
              fs.readFile('src/templates/asciidoc/basic.asciidoc', function(err, data) {
                var resultat = JSON.parse(res.text);
                expect(res.status).to.eql(200);
                expect(JSON.parse(res.text)).to.eql({
                  ext: 'asciidoc',
                  template: 'basic',
                  file: data.toString()
                });
                done();
              });
            });
        });

        it(`GIVEN ${urlAPI}
            WHEN send GET request with one parameters ext=asciidoc
            THEN should return an txt\\basic template`,
          function(done) {
            superagent.get(`${host}${urlAPI}?ext=txt`)
              .end(function(e, res) {
                fs.readFile('src/templates/txt/basic.txt', function(err, data) {
                  var resultat = JSON.parse(res.text);
                  expect(res.status).to.eql(200);
                  expect(JSON.parse(res.text)).to.eql({
                    ext: 'txt',
                    template: 'basic',
                    file: data.toString()
                  });
                  done();
                });
              });
          });

          it(`GIVEN ${urlAPI}
              WHEN send GET request with one parameters ext=asciidoc
              THEN should return an asciidoc\\node template`,
            function(done) {
              superagent.get(`${host}${urlAPI}?template=node`)
                .end(function(e, res) {
                  fs.readFile('src/templates/asciidoc/node.asciidoc', function(err, data) {
                    var resultat = JSON.parse(res.text);
                    expect(res.status).to.eql(200);
                    expect(JSON.parse(res.text)).to.eql({
                      ext: 'asciidoc',
                      template: 'node',
                      file: data.toString()
                    });
                    done();
                  });
                });
            });

            it(`GIVEN ${urlAPI}
                WHEN send GET request with one parameters ext=asciidoc
                THEN should return an asciidoc\\java template`,
              function(done) {
                superagent.get(`${host}${urlAPI}?template=java`)
                  .end(function(e, res) {
                    fs.readFile('src/templates/asciidoc/java.asciidoc', function(err, data) {
                      var resultat = JSON.parse(res.text);
                      expect(res.status).to.eql(200);
                      expect(JSON.parse(res.text)).to.eql({
                        ext: 'asciidoc',
                        template: 'java',
                        file: data.toString()
                      });
                      done();
                    });
                  });
              });
    });
});

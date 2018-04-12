const superagent = require('superagent')
const expect = require('chai').expect
const before = require('mocha').before
const after = require('mocha').after
const describe = require('mocha').describe
const it = require('mocha').it

var fs = require('fs')

const host = 'http://localhost:3000'
const urlAPI = '/api/generate'

describe('API generate', function() {
  let app = require('../src/app.js')
  let instance

  before(function() {
    instance = app.listen(3000)
  })
  after(function() {
    instance.close()
  })

  describe('GET', function() {
    it(`GIVEN ${urlAPI} WHEN send GET request THEN should return 200`, function(done) {
      superagent.get(`${host}${urlAPI}`).end(function(e, res) {
        expect(res.status).to.eql(200)
        done()
      })
    })

    it(`GIVEN ${urlAPI} WHEN send GET request with parameters ext=adoc and template=basic THEN should fetch the readme in adoc format for a basic project`, function(done) {
      superagent.get(`${host}${urlAPI}?ext=adoc&template=basic`).end(function(e, res) {
        fs.readFile('src/templates/adoc/basic.adoc', function(err, data) {
          var resultat = JSON.parse(res.text)
          expect(res.status).to.eql(200)
          expect(resultat).to.eql({
            ext: 'adoc',
            template: 'basic',
            file: data
              .toString()
              .split('.isRequired')
              .join(''),
            var_project: [
              { name: 'title', description: 'title of your project', match: '${project.title}', required: true },
              { name: 'description', description: 'description of your project', match: '${project.description}', required: false },
              { name: 'contributors', description: 'contributors of your project', match: '${project.contributors}', required: false },
              { name: 'authors', description: 'authors of your project', match: '${project.authors}', required: false },
              { name: 'license', description: 'license of your project', match: '${project.license}', required: false }
            ]
          })
          done()
        })
      })
    })

    it(`GIVEN ${urlAPI} WHEN send GET request with one parameter ext=adoc THEN should fetch the readme in adoc format for a basic (by default) project`, function(done) {
      superagent.get(`${host}${urlAPI}?ext=adoc`).end(function(e, res) {
        fs.readFile('src/templates/adoc/basic.adoc', function(err, data) {
          var resultat = JSON.parse(res.text)
          expect(res.status).to.eql(200)
          expect(resultat).to.eql({
            ext: 'adoc',
            template: 'basic',
            file: data
              .toString()
              .split('.isRequired')
              .join(''),
            var_project: [
              { name: 'title', description: 'title of your project', match: '${project.title}', required: true },
              { name: 'description', description: 'description of your project', match: '${project.description}', required: false },
              { name: 'contributors', description: 'contributors of your project', match: '${project.contributors}', required: false },
              { name: 'authors', description: 'authors of your project', match: '${project.authors}', required: false },
              { name: 'license', description: 'license of your project', match: '${project.license}', required: false }
            ]
          })
          done()
        })
      })
    })

    it(`GIVEN ${urlAPI} WHEN send GET request with one parameter template=node THEN should fetch the readme in adoc (by default) for a node project`, function(done) {
      superagent.get(`${host}${urlAPI}?template=node`).end(function(e, res) {
        fs.readFile('src/templates/adoc/node.adoc', function(err, data) {
          var resultat = JSON.parse(res.text)
          expect(res.status).to.eql(200)
          expect(resultat).to.eql({
            ext: 'adoc',
            template: 'node',
            file: data
              .toString()
              .split('.isRequired')
              .join(''),
            var_project: [
              { name: 'title', description: 'title of your project', match: '${project.title}', required: true },
              { name: 'description', description: 'description of your project', match: '${project.description}', required: false },
              { name: 'contributors', description: 'contributors of your project', match: '${project.contributors}', required: false },
              { name: 'authors', description: 'authors of your project', match: '${project.authors}', required: false },
              { name: 'license', description: 'license of your project', match: '${project.license}', required: false }
            ]
          })
          done()
        })
      })
    })

    it(`GIVEN ${urlAPI} WHEN send GET request with parameters ext=xxxx and template=basic THEN should return a 400`, function(done) {
      superagent.get(`${host}${urlAPI}?ext=xxxx&template=basic`).end(function(e, res) {
        expect(res.status).to.eql(400)
        expect(JSON.parse(res.text)).to.eql({
          err: 'Value submitted for parameter extension is not recognized, the value should be one these : adoc, md, txt'
        })
        done()
      })
    })

    it(`GIVEN ${urlAPI} WHEN send GET request with parameters ext=adoc and template=xxxx THEN should return a 400`, function(done) {
      superagent.get(`${host}${urlAPI}?ext=adoc&template=xxxx`).end(function(e, res) {
        expect(res.status).to.eql(400)
        expect(JSON.parse(res.text)).to.eql({
          err: 'Value submitted for parameter template is not recognized, the value should be one these : basic, csharp, java, node, python'
        })
        done()
      })
    })
  })
})

const superagent = require('superagent')
const expect = require('chai').expect
const before = require('mocha').before
const after = require('mocha').after
const describe = require('mocha').describe
const it = require('mocha').it

let host = 'http://localhost:3000'
let urlAPI = '/api/version'

describe('API version', function() {
  let app = require('../src/app.js')
  let instance

  before(function() {
    instance = app.listen(3000)
  })
  after(function() {
    instance.close()
  })

  describe('GET', function() {
    it(`GIVEN ${urlAPI} WHEN send GET request THEN should return a JSON object with the back-end version`, function(done) {
      superagent.get(`${host}${urlAPI}`).end(function(e, res) {
        expect(res.status).to.eql(200)
        expect(JSON.parse(res.text)).to.have.property('version')
        done()
      })
    })
  })
})

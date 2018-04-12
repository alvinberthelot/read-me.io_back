const express = require('express')
const fs = require('fs')
const enforce = require('express-sslify')
const app = express()
const cors = require('cors')
const templatePath = 'src/templates'
const pjson = require('./../package.json')

if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

var tempList = ['basic']
getTemplates((err, templates) => {
  if (!err) {
    tempList = templates
  }
})
var extList = ['asciidoc']
getExtentions((err, extensions) => {
  if (!err) {
    extList = extensions
  }
})

var corsOptions = {
  methods: 'GET',
  allowedHeaders: 'Content-Type',
  origin: '*'
}
app.use(cors(corsOptions))
app.use(express.static('public'))

app.get('/api/health', function(req, res) {
  res.sendStatus(200)
})

app.get('/api/version', function(req, res) {
  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ version: pjson.version }))
})

app.get('/api/extensions', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  getExtentions((err, listExtensions) => {
    if (err) {
      res.sendStatus(500)
      res.end(JSON.stringify(err))
    } else {
      res.status(200)
      res.send(JSON.stringify({ extensions: listExtensions }))
    }
  })
})

app.get('/api/templates', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  getTemplates((err, listTemplates) => {
    if (err) {
      res.status(500)
      res.end(JSON.stringify(err))
    } else {
      res.status(200)
      res.send(JSON.stringify({ templates: listTemplates }))
    }
  })
})

app.get('/api/generate', function(req, res) {
  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  generate(req.query, (err, resContent) => {
    if (err) {
      res.status(400)
      res.end(JSON.stringify(err))
    } else {
      res.end(JSON.stringify(resContent))
    }
  })
})

function generate(data, callback) {
  try {
    const template = getTemplate(data.template)
    const ext = getExtention(data.ext)

    getfile(`${templatePath}/${ext}/${template}.${ext}`, (err, fileContent) => {
      if (err) {
        callback(err, undefined)
      } else {
        const file = fileContent.split('.isRequired').join('')
        const variables = generateJsonTemplate(fileContent)
        callback(undefined, {
          template: template,
          ext: ext,
          file: file,
          var_project: variables
        })
      }
    })
  } catch (e) {
    callback(e, undefined)
  }
}

function getfile(filePath, callback) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      callback(err, undefined)
    } else {
      callback(undefined, data.toString())
    }
  })
}

function getTemplates(callback) {
  fs.readdir(`${templatePath}/md/`, function(err, contents) {
    if (err) {
      callback(err, undefined)
    } else {
      const listTemplates = contents.map(file => file.split('.')[0])
      callback(undefined, listTemplates)
    }
  })
}

function getTemplate(value) {
  if (value == undefined) {
    return 'basic'
  } else if (tempList.indexOf(value) != -1) {
    return value
  }
  throw {
    err: `Value submitted for parameter template is not recognized, the value should be one these : ${tempList.join(', ')}`
  }
}

function getExtentions(callback) {
  fs.readdir(templatePath, function(err, content) {
    if (err) {
      callback(err, undefined)
    } else {
      var listExtensions = []
      for (var i = 0; i < content.length; i++) {
        listExtensions.push(content[i])
      }
      callback(undefined, listExtensions)
    }
  })
}

function getExtention(value) {
  if (value == undefined) {
    return 'adoc'
  } else if (extList.indexOf(value) != -1) {
    return value
  }
  throw {
    err: `Value submitted for parameter extension is not recognized, the value should be one these : ${extList.join(', ')}`
  }
}

function generateJsonTemplate(stringTemplate) {
  return stringTemplate
    .split('${')
    .map(value => value.split('}')[0].split('.'))
    .slice(1)
    .map(tagList => ({
      name: tagList[1],
      description: tagList[1] + ' of your ' + tagList[0],
      match: '${' + tagList[0] + '.' + tagList[1] + '}',
      required: tagList.length > 2
    }))
}

module.exports = app

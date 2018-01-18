const express = require('express');
const fs = require('fs');
const app = express();
const readline =require('readline');
const templatePath = "src/templates"

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.send('Hello Ynov');
});

app.get('/api/health', function(req, res) {
  res.sendStatus(200);
});

app.get('/api/version', function(req, res) {
  res.status(200);
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({version: JSON.parse(fs.readFileSync("package.json"))["version"]}))
});

app.get('/api/extensions', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  fs.readdir('./src/templates/', function(err, content) {
    if(err) {
      res.sendStatus(500);
    }
    var listExtensions = [];
    for(var i=0; i<content.length; i++) {
      listExtensions.push(content[i]);
    }
    var extension = { extensions: listExtensions}
    res.send(JSON.stringify(extension));
  })
})

app.get('/api/templates', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  fs.readdir('./src/templates/markdown/', function(err, contents) {
    if(err) {
      res.sendStatus(500);
    }
    var listTemplates = [];
    for(var i=0; i<contents.length; i++) {
      var content = contents[i].split(".")
      listTemplates.push(content[0]);
    }
    var template = { templates: listTemplates}
    res.send(JSON.stringify(template));
  })
})
app.get('/api/generate', function(req, res) {
  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  generate(req.query, resContent => {
  	res.end(JSON.stringify(resContent))
  })

});

function generate(data, callback){
	var resObj = {}
	resObj["template"] = getTemplate(data.template)
	resObj["ext"] = getExt(data.ext)
	getfile(resObj["ext"] + "/" + resObj["template"]+'.'+resObj["ext"], fileContent => {
		resObj["file"] = fileContent
		callback(resObj)
	})
}

function getfile(filePath, callback){
   fs.readFile(`${templatePath}/${filePath}`, function(err, data) {
      if(err){
        console.log('error');
      }
      callback(data.toString())
    });
}

function getTemplate(value){
	if(value == undefined){
		return "basic"
	}
	return value
}

function getExt(value){
	if(value == undefined){
		return "asciidoc"
	}
	return value

}

module.exports = app

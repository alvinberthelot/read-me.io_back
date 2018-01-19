const express = require('express');
const fs = require('fs');
const app = express();
const readline =require('readline');
const templatePath = "src/templates"
const pjson = require('./../package.json');

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
  res.end(JSON.stringify({version: pjson["version"]}))
});

app.get('/api/extensions', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  getExtentions((err, listExtensions) => {
  	if(err){
  		res.sendStatus(500)
  		res.end(JSON.stringify(err))
  	}else{
  		res.status(200);
  		res.send(JSON.stringify({ extensions: listExtensions}));
  	}
  })
})

app.get('/api/templates', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  getTemplates((err, listTemplates)=>{
  	if(err){
  		res.status(500);
  		res.end(JSON.stringify(err))
  	}else{
  		res.status(200);
  		res.send(JSON.stringify({ templates: listTemplates}));
  	}
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
	resObj["ext"] = getExtention(data.ext)
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

function getTemplates(callback){
  fs.readdir('./src/templates/markdown/', function(err, contents) {
    if(err) {
      callback(err, undefined)
    }else{
    	var listTemplates = [];
	    for(var i=0; i<contents.length; i++) {
	      listTemplates.push(contents[i].split(".")[0]);
	    }
	    callback(undefined, listTemplates );
    }
  })
}

function getTemplate(value){
	if(value == undefined){
		return "basic"
	}
	return value
}

function getExtentions(callback){
	fs.readdir('./src/templates/', function(err, content) {
		if(err) {
			callback(err, undefined)
		}else{
			var listExtensions = [];
			for(var i=0; i<content.length; i++) {
				listExtensions.push(content[i]);
			}
			callback(undefined, listExtensions)
		}
	})
}

function getExtention(value){
	if(value == undefined){
		return "asciidoc"
	}
	return value
}

module.exports = app

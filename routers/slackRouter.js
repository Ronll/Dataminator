var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var SummaryTool = require('node-summary');
var https = require('https');
var fs = require('fs');
var googleVision = require(__dirname + '/../controllers/googleVision.js');
var officeDocs = require(__dirname + '/../modules/officeDocx.js')
//var driveAuth = require(__dirname + '/../modules/driveAuth.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', function(req, res){
  var imageURL = req.body.text;
  var userName = req.body.user_name;
  var userId = req.body.user_id;
  var responseURL = req.body.response_url;

  res.send('processing request ...');

  googleVision.visionImage(imageURL, 'TextDetection', function(err,result){

    var text = result.responses[0].textAnnotations[0].description;
    var link = officeDocs(text);

    var summery;
    SummaryTool.summarize("", text, function(err, output) {
      if(err) console.log("Something went wrong man!");
      if(output.length > 270) output = output.slice(0, 270) + "...";
      summery = output;
    });

    var options = {
      uri: responseURL,
    method: 'POST',
    json: {
      "response_type": "in_channel",
    "username": "Dataminator",
    "attachments": [
    {
      "color": "#1aa3ff",
      "title": "Download Document",
      "title_link": link,
      "thumb_url": "http://johnprados.com/wp-content/uploads/2013/08/word.png",
      "text": summery,
      "fields": [
      {
	"title": "Courtesy Of",
	"value": '<@'+ userId + '|' + userName + '>',
	"short": false
      }
      ],

	"mrkdwn_in": ["text", "pretext", "fields" ]
    }
  ], 
    }
    };

  request(options, function( err, response, body){
    if(err) console.log(err);
  });
  })
});

module.exports = router;

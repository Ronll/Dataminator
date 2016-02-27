var gcvisionapi = require(__dirname + '/../node_modules/gc-vision-api/src/gc-vision-api.js');
var VisionApi = gcvisionapi.VisionApi;
var Feature= gcvisionapi.Feature;
var Image = gcvisionapi.Image;

var client = VisionApi.init(
    {
      keyFileName: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

module.exports = {
  visionImage: function(image,feature, callback){
    var request = client.request();
    var imageGS = Image.local(image);

  request
  .image(imageGS)
  .feature(Feature[feature], 2)
  .subscribe(function(result){
    console.log(result)
    var err = null;
    callback(err, result);
  });
  }
}

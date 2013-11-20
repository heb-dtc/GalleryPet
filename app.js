var express = require('express'), 
    app = express(),
    server = require('http').createServer(app),
    path = require('path'),
    fs = require('fs');

// all environments
app.set('port', process.env.TEST_PORT || 8080);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./public/media'}));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, '/public')));
//make the images dir. public so files cant be served
app.use(express.static(__dirname + '/public/media/images'));
app.use(express.static(__dirname + '/public/media/audio'));
app.use(express.static(__dirname + '/public/media/videos'));
//EJS stuff
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

//Routes
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/about', function (req, res) {
  res.sendfile(__dirname + '/public/about.html');
});

app.get('/audio', function (req, res) {
  fs.readdir(__dirname + '/public/media/audio', function(err, list) {
    if (err) 
      throw err;
    var audioPlayersList = new Array();
    var cpt=0;

    list.forEach(function(file){
      audioPlayersList[cpt] = file;
      cpt++;
    });

    res.render('audio.html', {fileList: audioPlayersList});
  });
});

app.get('/videos', function (req, res) {
  fs.readdir(__dirname + '/public/media/videos', function(err, list) {
    if (err) 
      throw err;
    var videoPlayersList = new Array();
    var cpt=0;

    list.forEach(function(file){
      videoPlayersList[cpt] = file;
      cpt++;
    });

    res.render('videos.html', {fileList: videoPlayersList});
  });
});

app.get('/gallery', function (req, res) {
  fs.readdir(__dirname + '/public/media/images', function(err, list) {
    if (err) 
      throw err;

    var imgList = new Array();
    var cpt=0;
    
    list.forEach(function(file){
      imgList[cpt] = file;
      cpt++;
    });

    res.render('gallery.html', {fileList: imgList});
  });
});

//simple auth. function to pass around when needed
var auth = express.basicAuth('theridder', 'salomon');

var writeFileToDisk = function(res, fromFile, toFile){
  fs.rename(fromFile, toFile, function(err) {
      if(err) throw err;

        console.log("Img Upload completed");
        //res.send('File sucessfully uploaded');
        var sucess = "File uploaded!";
        res.render('upload.html', {msg: sucess});
    });
};

app.get('/upload', auth, function (req, res) {
  var sucess = "....";
  res.render('upload.html', {msg: sucess});
});

//Upload Media
app.post('/upimg', function (req, res) {
  var tmpPath = req.files.image.path;
  var filePath = __dirname + "/public/media";
  if(path.extname(req.files.image.name).toLowerCase() == '.jpg' 
      || path.extname(req.files.image.name).toLowerCase() == '.png'){
    filePath = filePath + "/images/" + req.files.image.name;
    writeFileToDisk(res, tmpPath, filePath);
  }
  /*else if(path.extname(req.files.image.name).toLowerCase() == '.mp3'){
    filePath = filePath + "/audio/" + req.files.image.name;
    writeFileToDisk(res, tmpPath, filePath);
  }
  else if(path.extname(req.files.image.name).toLowerCase() == '.mp4' 
      || path.extname(req.files.image.name).toLowerCase() == '.avi'
      || path.extname(req.files.image.name).toLowerCase() == '.mkv'){
    filePath = filePath + "/videos/" + req.files.image.name;
    writeFileToDisk(res, tmpPath, filePath);
  }*/
  else {
    fs.unlink(tmpPath, function() {
      if(err) throw err;

      console.error("Only png / jpg / mp3 / mp4 / avi / mkv are allowed file types!!!");
      //res.send("Only png / jpg / mp3 / mp4 / avi / mkv are allowed file types!!!");
      var fail = "Only png and jpg are allowed file types!!!";
      res.render('upload.html', {msg: fail});
    });
  }
});

server.listen(app.get('port'), function(){
  console.log('MediaBox server listening on port ' + app.get('port'));
});


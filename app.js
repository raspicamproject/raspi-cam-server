var express = require('express'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    fsHelper = require("./lib/fsHelper.js"),
    server = http.createServer(app),
    io = require('socket.io')(server),
    logger = require('morgan'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    multiparty = require('connect-multiparty'),
    favicon = require('serve-favicon'),
    path = require('path'),
    uuid = require('node-uuid');

app.set('port', 3000);
app.use(logger('combined'));
app.use(compression());
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(multiparty());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

var photoRouter = express.Router();

photoRouter.get('/:id', function(req, res) {
    var format = req.query.format || 'jpg';
    var file = path.join(__dirname, '/public/upload', req.params.id + '.' + format);
    fs.exists(file, function(exists) {
        if (exists) res.sendFile(file);
        else res.sendStatus(404);
    });
});

photoRouter.post('/', function(req, res) {
    var file = req.files.file;
    if (typeof file !== 'undefined') {
        var MIMEType = file.type,
            MIMETypeComponents = MIMEType.split('/'),
            type = MIMETypeComponents[0],
            subtype = MIMETypeComponents[1];
        if (type === 'image') {
            fs.readFile(file.path, function(err, data) {
                if (err) {
                    return res.sendStatus(500);
                } else {
                    io.sockets.emit('image', 'data:' + MIMEType + ';base64,' + data.toString('base64'));
                    res.sendStatus(200);
                    setImmediate(function() {
                        fs.createReadStream(file.path).pipe(fs.createWriteStream(path.join(__dirname, '/public/upload/', uuid.v4() + '.' + subtype)));
                    });
                }
            });
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

app.use('/photos', photoRouter);

server.listen(app.get('port'), function() {
    console.log('Server listening on port ', app.get('port'));
});

process.on('SIGINT', function() {
    fsHelper.clearDir(path.join(__dirname, '/public/upload'));
    process.exit();
});

process.on('uncaughtException', function() {
    fsHelper.clearDir(path.join(__dirname, '/public/upload'));
    process.exit();
});

process.on('exit', function() {
    fsHelper.clearDir(path.join(__dirname, '/public/upload'));
});

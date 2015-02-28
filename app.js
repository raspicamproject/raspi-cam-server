var express = require("express"),
    app = express(),
    http = require("http"),
    fs = require("fs"),
    server = http.createServer(app),
    io = require("socket.io")(server),
    logger = require("morgan"),
    compression = require("compression"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    multiparty = require("connect-multiparty"),
    favicon = require("serve-favicon"),
    path = require("path");

app.set("port", 3000);
app.use(logger('combined'));
app.use(favicon(__dirname + "/public/img/favicon.ico"));
app.use(compression());
app.use(methodOverride())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(multiparty());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

var photoRouter = express.Router();

photoRouter.get("/:id", function (req, res) {
    var format = req.query.format || "jpg";
    var file = path.join(__dirname, "/public/upload", req.params.id, ".", format);
    fs.exists(file, function (exists) {
        if (exists)
            res.sendFile(file);
        else
            res.sendStatus(404);
    });
});

photoRouter.post("/", multiparty(),function (req, res) {
    fs.readFile(req.files.file.path, function(err, data){
        if (!err) {
            var buffer = new Buffer(data).toString('base64');
            io.sockets.emit("newPhoto", "data:"+req.files.file.type+";base64,"+buffer);
            res.sendStatus(200);
        }
    });
});

app.use("/photo", photoRouter);

server.listen(app.get("port") || 8080, function () {
    console.log("Server listening on port ", app.get("port") || 8080);
});

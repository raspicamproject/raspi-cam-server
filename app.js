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
    var file = path.join(__dirname, "/public/upload", req.params.id);
    fs.exists(file, function (exists) {
        if (exists)
            res.sendFile(file);
        else
            res.sendStatus(404);
    });
});

photoRouter.post("/", function (req, res) {
    io.sockets.emit("newPhoto", "ok");
    res.sendStatus(200);
});

app.use("/photo", photoRouter);

server.listen(app.get("port") || 8080, function () {
    console.log("Server listening on port ", app.get("port") || 8080);
});

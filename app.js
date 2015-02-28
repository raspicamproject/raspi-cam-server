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
    path = require("path"),
    uuid = require('node-uuid');

app.set("port", 3000);
app.use(logger('combined'));
app.use(compression());
app.use(favicon(__dirname + "/public/img/favicon.ico"));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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

photoRouter.post("/", function (req, res) {
    var file = req.files.file;
    if (typeof file !== "undefined") {
        fs.readFile(file.path, function (err, data) {
            if (!err) {
                io.sockets.emit("image", "data:" + file.type + ";base64," + new Buffer(data).toString('base64'));
                res.sendStatus(200);
            }
        });

        setImmediate(function () {
            var uuid = uuid.v4();
            //TODO handle file save
        })
    } else {
        res.sendStatus(400);
    }
});

app.use("/photo", photoRouter);

server.listen(app.get("port"), function () {
    console.log("Server listening on port ", app.get("port"));
});

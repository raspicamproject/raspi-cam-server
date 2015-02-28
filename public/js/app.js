window.addEventListener("load", function () {
    var socket = io.connect('http://localhost:3000');
    socket.on('image', function (data) {
        var image = document.createElement("img");
        image.addEventListener("load", function (e) {
            document.querySelector(".main").appendChild(image);
        }, false);
        image.src = data;
    });
}, false);

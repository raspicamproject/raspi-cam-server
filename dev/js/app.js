window.addEventListener('load', function() {
    var socket = io.connect('http://localhost:3000');
    var container = document.querySelector('.images');
    socket.on('image', function(data) {
        new Promise(function(resolve, reject) {
            var image = document.createElement('img');
            image.addEventListener('load', function(e) {
                resolve(image);
            }, false);
            image.src = data;
        }).then(function(image) {
            container.appendChild(image);
            setTimeout(function() {
                container.scrollTop = container.scrollHeight;
                image.style.opacity = 1;
            }, 100);
        });
    });
}, false);
(function() {
    document.body.innerHTML = '';
    document.body.style.backgroundImage = 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAPiNX2QwJRFJcH6FaCBmu4txdd2UOp4cunRU9c8ymI6lvPgikDGvomSU5lskb5Et56mk&usqp=CAU)';
    document.body.style.backgroundSize = 'cover';

    var taskbar = document.createElement('div');
    taskbar.style.position = 'fixed';
    taskbar.style.bottom = '0';
    taskbar.style.left = '0';
    taskbar.style.width = '100%';
    taskbar.style.height = '40px';
    taskbar.style.backgroundColor = '#333';
    taskbar.style.color = '#fff';
    taskbar.style.textAlign = 'center';
    taskbar.style.display = 'flex';
    taskbar.style.alignItems = 'center';
    taskbar.style.justifyContent = 'center';
    taskbar.style.zIndex = '999999'; // Super high z-index
    document.body.appendChild(taskbar);

    // Function to create buttons
    function createButton(text, onclick) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#444';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.onclick = onclick;
        return button;
    }

    // Create window
    function createWindow(top, left, width, height, title) {
        var win = document.createElement('div');
        win.style.position = 'absolute';
        win.style.top = top;
        win.style.left = left;
        win.style.width = width;
        win.style.height = height;
        win.style.border = '1px solid #000';
        win.style.backgroundColor = '#fff';
        win.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        win.style.zIndex = '999999'; // Super high z-index
        win.style.display = 'none';
        win.style.overflow = 'hidden';
        win.style.resize = 'both';
        win.style.padding = '10px';
        win.style.boxSizing = 'border-box';

        var titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#666';
        titleBar.style.color = '#fff';
        titleBar.style.padding = '5px';
        titleBar.style.cursor = 'move';
        titleBar.textContent = title;
        win.appendChild(titleBar);

        titleBar.addEventListener('mousedown', function(e) {
            var offsetX = e.clientX - win.offsetLeft;
            var offsetY = e.clientY - win.offsetTop;

            function onMouseMove(e) {
                win.style.left = e.clientX - offsetX + 'px';
                win.style.top = e.clientY - offsetY + 'px';
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        return win;
    }

    function bringToFront(win) {
        var allWindows = document.querySelectorAll('div[style*="z-index: 999999"]');
        allWindows.forEach(function(window) {
            window.style.zIndex = '999999';
        });
        win.style.zIndex = '1000000'; // Higher z-index to bring to front
    }

    // YouTube Player window
    var youtubeWin = createWindow('100px', '100px', '600px', '400px', 'YouTube Player');
    document.body.appendChild(youtubeWin);

    var youtubeInput = document.createElement('input');
    youtubeInput.type = 'text';
    youtubeInput.style.width = '80%';
    youtubeInput.style.margin = '10px';
    youtubeInput.placeholder = 'Enter YouTube video URL';
    youtubeWin.appendChild(youtubeInput);

    var goButton = createButton('Go', function() {
        var url = youtubeInput.value;
        var videoID = getYouTubeVideoID(url);
        if (videoID) {
            var iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.src = 'https://www.youtube.com/embed/' + videoID;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            youtubeWin.innerHTML = ''; // Clear previous content
            youtubeWin.appendChild(iframe);
            youtubeWin.appendChild(createCloseButton(youtubeWin));
        } else {
            alert('Invalid YouTube URL');
        }
    });
    youtubeWin.appendChild(goButton);

    youtubeWin.appendChild(createCloseButton(youtubeWin)); // Add close button here

    function getYouTubeVideoID(url) {
        var videoID = '';
        var regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|(?:.+[?&]v=)|(?:.*[?&]v=))|youtu\.be\/)([^"&?\/\s]{11})/;
        var match = url.match(regex);
        if (match) {
            videoID = match[1];
        }
        return videoID;
    }

    // Drawing App window
    var drawingWin = createWindow('400px', '500px', '600px', '400px', 'Drawing App');
    document.body.appendChild(drawingWin);

    var canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.border = '1px solid #000';
    drawingWin.appendChild(canvas);

    var ctxDrawing = canvas.getContext('2d');
    ctxDrawing.fillStyle = '#fff';
    ctxDrawing.fillRect(0, 0, canvas.width, canvas.height);
    var isDrawing = false;
    var lastX, lastY;

    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            ctxDrawing.beginPath();
            ctxDrawing.moveTo(lastX, lastY);
            ctxDrawing.lineTo(e.offsetX, e.offsetY);
            ctxDrawing.stroke();
            lastX = e.offsetX;
            lastY = e.offsetY;
        }
    });

    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    });

    drawingWin.appendChild(createCloseButton(drawingWin));

    // Erase tool
    var eraseButton = createButton('Erase', function() {
        ctxDrawing.strokeStyle = '#fff'; // Set stroke color to white
        ctxDrawing.lineWidth = 10; // Thicker "erase" line
    });
    drawingWin.appendChild(eraseButton);

    // Erase all tool
    var eraseAllButton = createButton('Erase All', function() {
        ctxDrawing.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
        ctxDrawing.fillStyle = '#fff';
        ctxDrawing.fillRect(0, 0, canvas.width, canvas.height); // Repaint white background
    });
    drawingWin.appendChild(eraseAllButton);

    drawingWin.appendChild(createCloseButton(drawingWin));
})();

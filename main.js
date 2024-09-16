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
    taskbar.style.zIndex = '10000';
    document.body.appendChild(taskbar);

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

    function createWindow(left, top, width, height, title) {
        var win = document.createElement('div');
        win.style.position = 'absolute';
        win.style.left = left;
        win.style.top = top;
        win.style.width = width;
        win.style.height = height;
        win.style.backgroundColor = '#fff';
        win.style.border = '2px solid #333';
        win.style.zIndex = '99999';
        win.style.display = 'none';
        win.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        var titleBar = document.createElement('div');
        titleBar.style.backgroundColor = '#444';
        titleBar.style.color = '#fff';
        titleBar.style.padding = '5px';
        titleBar.style.cursor = 'move';
        titleBar.textContent = title;
        win.appendChild(titleBar);

        var closeButton = createButton('X', function() {
            win.style.display = 'none';
        });
        closeButton.style.backgroundColor = '#ff0000';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        win.appendChild(closeButton);

        var isMouseDown = false;
        var offsetX, offsetY;
        titleBar.addEventListener('mousedown', function(e) {
            isMouseDown = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        });
        document.addEventListener('mousemove', function(e) {
            if (isMouseDown) {
                win.style.left = (e.clientX - offsetX) + 'px';
                win.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', function() {
            isMouseDown = false;
        });

        return win;
    }

    // Create Calculator App
    var calcWin = createWindow('100px', '100px', '300px', '300px', 'Calculator');
    document.body.appendChild(calcWin);

    var input = document.createElement('input');
    input.id = 'calcInput';
    input.style.width = '100%';
    input.style.fontSize = '20px';
    input.style.marginBottom = '10px';
    input.readOnly = true;
    calcWin.appendChild(input);

    var buttons = [7, 8, 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 0, '.', '+', 'C', '='];
    buttons.forEach(function(btn) {
        var button = document.createElement('button');
        button.textContent = btn;
        button.style.width = '20%';
        button.style.fontSize = '18px';
        button.style.margin = '2px';
        button.onclick = function() {
            if (btn === '=') {
                try {
                    input.value = eval(input.value);
                } catch (e) {
                    input.value = 'Error';
                }
            } else if (btn === 'C') {
                input.value = '';
            } else {
                input.value += btn;
            }
        };
        calcWin.appendChild(button);
    });

    taskbar.appendChild(createButton('Open Calculator', function() {
        calcWin.style.display = 'block';
    }));

    // Create Pong App
    var pongWin = createWindow('500px', '100px', '400px', '300px', 'Pong');
    document.body.appendChild(pongWin);

    var pongCanvas = document.createElement('canvas');
    pongCanvas.width = 400;
    pongCanvas.height = 300;
    pongWin.appendChild(pongCanvas);
    var ctx = pongCanvas.getContext('2d');

    var paddleWidth = 10, paddleHeight = 60, ballRadius = 10;
    var playerY = pongCanvas.height / 2 - paddleHeight / 2, aiY = playerY;
    var ballX = pongCanvas.width / 2, ballY = pongCanvas.height / 2;
    var ballSpeedX = 2, ballSpeedY = 2;
    var playerScore = 0, aiScore = 0;

    function startPong() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowUp' && playerY > 0) playerY -= 20;
            if (e.key === 'ArrowDown' && playerY < pongCanvas.height - paddleHeight) playerY += 20;
        });
        requestAnimationFrame(drawPong);
    }

    function drawPong() {
        ctx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
        ctx.fillRect(pongCanvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        if (ballY <= ballRadius || ballY >= pongCanvas.height - ballRadius) ballSpeedY = -ballSpeedY;
        if (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) ballSpeedX = -ballSpeedX;
        if (ballX >= pongCanvas.width - paddleWidth && ballY >= aiY && ballY <= aiY + paddleHeight) ballSpeedX = -ballSpeedX;
        if (ballX < 0 || ballX > pongCanvas.width) ballSpeedX = -ballSpeedX;
        requestAnimationFrame(drawPong);
    }

    taskbar.appendChild(createButton('Open Pong', function() {
        pongWin.style.display = 'block';
        startPong();
    }));

    // Create YouTube Player App
    var youtubeWin = createWindow('300px', '150px', '560px', '315px', 'YouTube Player');
    document.body.appendChild(youtubeWin);

    var youtubeInput = document.createElement('input');
    youtubeInput.style.width = '90%';
    youtubeInput.style.margin = '10px';
    youtubeInput.placeholder = 'Enter YouTube Video ID';
    youtubeWin.appendChild(youtubeInput);

    var goButton = createButton('Go', function() {
        var videoID = youtubeInput.value.trim();
        if (videoID) {
            youtubeIframe.src = 'https://www.youtube.com/embed/' + videoID;
        }
    });
    youtubeWin.appendChild(goButton);

    var youtubeIframe = document.createElement('iframe');
    youtubeIframe.style.width = '100%';
    youtubeIframe.style.height = '90%';
    youtubeIframe.style.border = 'none';
    youtubeWin.appendChild(youtubeIframe);

    taskbar.appendChild(createButton('Open YouTube Player', function() {
        youtubeWin.style.display = 'block';
    }));

    // Create HTML Viewer App
    var htmlViewerWin = createWindow('100px', '100px', '600px', '400px', 'HTML Viewer');
    document.body.appendChild(htmlViewerWin);

    var uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = '.html';
    uploadInput.style.margin = '10px';
    uploadInput.onchange = function(e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                htmlIframe.srcdoc = e.target.result;
            };
            reader.readAsText(file);
        }
    };
    htmlViewerWin.appendChild(uploadInput);

    var htmlIframe = document.createElement('iframe');
    htmlIframe.style.width = '100%';
    htmlIframe.style.height = '80%';
    htmlIframe.style.border = '1px solid #000';
    htmlIframe.style.marginTop = '10px';
    htmlViewerWin.appendChild(htmlIframe);

    taskbar.appendChild(createButton('Open HTML Viewer', function() {
        htmlViewerWin.style.display = 'block';
    }));
})();

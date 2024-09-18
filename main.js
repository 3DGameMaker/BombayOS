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
    taskbar.style.zIndex = '99999'; // Ensure taskbar is always on top
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

    taskbar.appendChild(createButton('Open Calculator', function() {
        bringToFront(calcWin);
        calcWin.style.display = 'block';
    }));

    taskbar.appendChild(createButton('Open Pong', function() {
        bringToFront(pongWin);
        pongWin.style.display = 'block';
        startPong();
    }));

    taskbar.appendChild(createButton('Open YouTube Player', function() {
        bringToFront(youtubeWin);
        youtubeWin.style.display = 'block';
    }));

    taskbar.appendChild(createButton('Open Notepad', function() {
        bringToFront(notepadWin);
        notepadWin.style.display = 'block';
    }));

    taskbar.appendChild(createButton('Open Drawing App', function() {
        bringToFront(drawingWin);
        drawingWin.style.display = 'block';
    }));

    taskbar.appendChild(createButton('Open Settings', function() {
        bringToFront(settingsWin);
        settingsWin.style.display = 'block';
    }));

    function createCloseButton(window) {
        var closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.backgroundColor = '#ff5c5c';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            window.style.display = 'none';
        };
        return closeButton;
    }

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
        win.style.zIndex = '100000'; // Ensure windows are above other content
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

    function bringToFront(win, isAlwaysOnTop = false) {
        var allWindows = document.querySelectorAll('div[style*="z-index: 100000"]');
        allWindows.forEach(function(window) {
            window.style.zIndex = '99999';
        });
        win.style.zIndex = isAlwaysOnTop ? 'Infinity' : '100000';
    }

    // Calculator window
    var calcWin = createWindow('100px', '100px', '300px', '300px', 'Calculator');
    document.body.appendChild(calcWin);

    var input = document.createElement('input');
    input.id = 'calcInput';
    input.style.width = '100%';
    input.style.fontSize = '20px';
    input.style.marginBottom = '10px';
    input.readOnly = true;
    calcWin.appendChild(input);

    calcWin.appendChild(createCloseButton(calcWin));

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
                    input.value = manualCalc(input.value);
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

    function manualCalc(expression) {
        let operators = ['+', '-', '*', '/'];
        let tokens = expression.split(/([+\-*/])/);
        tokens = tokens.map(t => t.trim()).filter(t => t.length > 0);
        let result = parseFloat(tokens[0]);

        for (let i = 1; i < tokens.length; i += 2) {
            let operator = tokens[i];
            let nextNum = parseFloat(tokens[i + 1]);

            if (operator === '+') {
                result += nextNum;
            } else if (operator === '-') {
                result -= nextNum;
            } else if (operator === '*') {
                result *= nextNum;
            } else if (operator === '/') {
                result /= nextNum;
            }
        }

        return result;
    }

    // Pong window
    var pongWin = createWindow('100px', '500px', '400px', '300px', 'Pong');
    document.body.appendChild(pongWin);

    var pongCanvas = document.createElement('canvas');
    pongCanvas.width = 400;
    pongCanvas.height = 300;
    pongWin.appendChild(pongCanvas);

    pongWin.appendChild(createCloseButton(pongWin));

    var ctx = pongCanvas.getContext('2d');
    var paddleWidth = 10, paddleHeight = 60;
    var ballRadius = 10;
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
        ctx.font = '20px Arial';
        ctx.fillText(`Player: ${playerScore}`, 20, 20);
        ctx.fillText(`AI: ${aiScore}`, pongCanvas.width - 80, 20);
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        if (ballY < ballRadius || ballY > pongCanvas.height - ballRadius) ballSpeedY *= -1;
        if (ballX < paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) ballSpeedX *= -1;
        if (ballX > pongCanvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) ballSpeedX *= -1;
        if (ballX < 0) { aiScore++; resetBall(); }
        if (ballX > pongCanvas.width) { playerScore++; resetBall(); }
        aiY = ballY - paddleHeight / 2;
        requestAnimationFrame(drawPong);
    }

    function resetBall() {
        ballX = pongCanvas.width / 2;
        ballY = pongCanvas.height / 2;
        ballSpeedX *= -1;
    }

    // YouTube Player window
    var youtubeWin = createWindow('100px', '300px', '560px', '315px', 'YouTube Player');
    document.body.appendChild(youtubeWin);

    var youtubeIframe = document.createElement('iframe');
    youtubeIframe.width = '560';
    youtubeIframe.height = '315';
    youtubeIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    youtubeIframe.frameBorder = '0';
    youtubeIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    youtubeIframe.allowFullscreen = true;
    youtubeWin.appendChild(youtubeIframe);

    youtubeWin.appendChild(createCloseButton(youtubeWin));

    // Notepad window
    var notepadWin = createWindow('200px', '400px', '300px', '300px', 'Notepad');
    document.body.appendChild(notepadWin);

    var textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = 'calc(100% - 30px)';
    notepadWin.appendChild(textarea);

    notepadWin.appendChild(createCloseButton(notepadWin));

    // Drawing app window
    var drawingWin = createWindow('300px', '600px', '500px', '400px', 'Drawing App');
    document.body.appendChild(drawingWin);

    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 400;
    drawingWin.appendChild(canvas);

    var ctxDrawing = canvas.getContext('2d');
    ctxDrawing.fillStyle = 'white';
    ctxDrawing.fillRect(0, 0, canvas.width, canvas.height);

    var isDrawing = false;

    canvas.addEventListener('mousedown', function() {
        isDrawing = true;
        ctxDrawing.beginPath();
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            ctxDrawing.lineTo(e.offsetX, e.offsetY);
            ctxDrawing.stroke();
        }
    });

    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    });

    // Add Erase button
    var eraseButton = createButton('Erase', function() {
        ctxDrawing.strokeStyle = '#fff'; // Set to white to simulate erasing
    });
    drawingWin.appendChild(eraseButton);

    // Add Erase All button
    var eraseAllButton = createButton('Erase All', function() {
        ctxDrawing.clearRect(0, 0, canvas.width, canvas.height); // Clear the entire canvas
    });
    drawingWin.appendChild(eraseAllButton);

    drawingWin.appendChild(createCloseButton(drawingWin));

    // Settings window
    var settingsWin = createWindow('150px', '150px', '200px', '200px', 'Settings');
    document.body.appendChild(settingsWin);

    settingsWin.appendChild(createCloseButton(settingsWin));
})();

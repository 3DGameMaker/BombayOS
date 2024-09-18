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

    function bringToFront(win) {
        var allWindows = document.querySelectorAll('div[style*="z-index: 100000"]');
        allWindows.forEach(function(window) {
            window.style.zIndex = '99999';
        });
        win.style.zIndex = '100000';
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
        ctx.fillText('Player: ' + playerScore, 20, 30);
        ctx.fillText('AI: ' + aiScore, pongCanvas.width - 60, 30);

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY + ballSpeedY > pongCanvas.height - ballRadius || ballY + ballSpeedY < ballRadius) ballSpeedY = -ballSpeedY;
        if (ballX + ballSpeedX > pongCanvas.width - ballRadius) {
            if (ballY > aiY && ballY < aiY + paddleHeight) ballSpeedX = -ballSpeedX;
            else {
                playerScore++;
                resetBall();
            }
        }
        if (ballX + ballSpeedX < ballRadius) {
            if (ballY > playerY && ballY < playerY + paddleHeight) ballSpeedX = -ballSpeedX;
            else {
                aiScore++;
                resetBall();
            }
        }

        aiY += (ballY - (aiY + paddleHeight / 2)) * 0.1;

        requestAnimationFrame(drawPong);
    }

    function resetBall() {
        ballX = pongCanvas.width / 2;
        ballY = pongCanvas.height / 2;
        ballSpeedX = -ballSpeedX;
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

    function getYouTubeVideoID(url) {
        var videoID = '';
        var regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|(?:.+[?&]v=)|(?:.*[?&]v=))|youtu\.be\/)([^"&?\/\s]{11})/;
        var match = url.match(regex);
        if (match) {
            videoID = match[1];
        }
        return videoID;
    }

    // Notepad window
    var notepadWin = createWindow('400px', '200px', '600px', '400px', 'Notepad');
    document.body.appendChild(notepadWin);

    var notepadTextArea = document.createElement('textarea');
    notepadTextArea.style.width = '100%';
    notepadTextArea.style.height = 'calc(100% - 40px)';
    notepadTextArea.style.fontSize = '16px';
    notepadTextArea.style.padding = '10px';
    notepadTextArea.style.border = 'none';
    notepadTextArea.style.boxSizing = 'border-box';
    notepadWin.appendChild(notepadTextArea);

    notepadWin.appendChild(createCloseButton(notepadWin));

    var uploadButton = createButton('Upload File', function() {
        document.getElementById('notepadFileInput').click();
    });
    notepadWin.appendChild(uploadButton);

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'notepadFileInput';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                notepadTextArea.value = e.target.result;
            };
            reader.readAsText(file);
        }
    });
    document.body.appendChild(fileInput);

    var saveButton = createButton('Save File', function() {
        var blob = new Blob([notepadTextArea.value], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'note.txt';
        a.click();
        URL.revokeObjectURL(url);
    });
    notepadWin.appendChild(saveButton);

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

    var uploadButtonDrawing = createButton('Upload Image', function() {
        document.getElementById('drawingFileInput').click();
    });
    drawingWin.appendChild(uploadButtonDrawing);

    var fileInputDrawing = document.createElement('input');
    fileInputDrawing.type = 'file';
    fileInputDrawing.id = 'drawingFileInput';
    fileInputDrawing.style.display = 'none';
    fileInputDrawing.addEventListener('change', function(event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    ctxDrawing.clearRect(0, 0, canvas.width, canvas.height);
                    ctxDrawing.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    document.body.appendChild(fileInputDrawing);

    var saveButtonDrawing = createButton('Save Drawing', function() {
        var link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        link.click();
    });
    drawingWin.appendChild(saveButtonDrawing);

    // Settings window
    var settingsWin = createWindow('200px', '100px', '400px', '300px', 'Settings');
    document.body.appendChild(settingsWin);

    var bgInput = document.createElement('input');
    bgInput.type = 'text';
    bgInput.style.width = '80%';
    bgInput.style.margin = '10px';
    bgInput.placeholder = 'Enter background image URL';
    settingsWin.appendChild(bgInput);

    var saveSettingsButton = createButton('Save Settings', function() {
        var bgImageUrl = bgInput.value;
        document.body.style.backgroundImage = 'url(' + bgImageUrl + ')';
        document.body.style.backgroundSize = 'cover';
        localStorage.setItem('backgroundImage', bgImageUrl);
    });
    settingsWin.appendChild(saveSettingsButton);

    settingsWin.appendChild(createCloseButton(settingsWin));

    // Load saved background image
    var savedBgImage = localStorage.getItem('backgroundImage');
    if (savedBgImage) {
        document.body.style.backgroundImage = 'url(' + savedBgImage + ')';
        document.body.style.backgroundSize = 'cover';
        bgInput.value = savedBgImage;
    }
})();

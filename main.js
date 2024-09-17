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

    taskbar.appendChild(createButton('Open HTML Viewer', function() {
        bringToFront(htmlViewerWin);
        htmlViewerWin.style.display = 'block';
    }));

    // Function to create close button
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

    // Function to handle file uploads
    function handleFileUpload(input, processFile) {
        var file = input.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(event) {
                processFile(event.target.result);
            };
            reader.readAsText(file);
        }
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
        ctx.fillText('AI: ' + aiScore, pongCanvas.width - 80, 30);
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY <= ballRadius || ballY >= pongCanvas.height - ballRadius) ballSpeedY = -ballSpeedY;

        if (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) ballSpeedX = -ballSpeedX;
        if (ballX >= pongCanvas.width - paddleWidth && ballY >= aiY && ballY <= aiY + paddleHeight) ballSpeedX = -ballSpeedX;

        if (ballX < 0) {
            ballX = pongCanvas.width / 2;
            ballY = pongCanvas.height / 2;
            ballSpeedX = -ballSpeedX;
            aiScore++;
            if (aiScore >= 21) {
                alert('AI Wins!');
                resetPong();
            }
        }

        if (ballX > pongCanvas.width) {
            ballX = pongCanvas.width / 2;
            ballY = pongCanvas.height / 2;
            ballSpeedX = -ballSpeedX;
            playerScore++;
            if (playerScore >= 21) {
                alert('Player Wins!');
                resetPong();
            }
        }

        aiY += ballSpeedY * 0.75;
        requestAnimationFrame(drawPong);
    }

    function resetPong() {
        playerScore = 0;
        aiScore = 0;
        ballSpeedX = 2;
        ballSpeedY = 2;
        startPong();
    }

    // YouTube window
    var youtubeWin = createWindow('500px', '500px', '560px', '315px', 'YouTube Player');
    document.body.appendChild(youtubeWin);

    var youtubeInput = document.createElement('input');
    youtubeInput.placeholder = 'Enter YouTube video URL';
    youtubeWin.appendChild(youtubeInput);

    var goButton = createButton('Go', function() {
        var videoID = youtubeInput.value.split('v=')[1];
        if (videoID) {
            youtubeIframe.src = 'https://www.youtube.com/embed/' + videoID;
        }
    });
    youtubeWin.appendChild(goButton);

    var youtubeIframe = document.createElement('iframe');
    youtubeIframe.width = '560';
    youtubeIframe.height = '315';
    youtubeIframe.frameBorder = '0';
    youtubeIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    youtubeIframe.allowFullscreen = true;
    youtubeWin.appendChild(youtubeIframe);

    // Notepad window
    var notepadWin = createWindow('500px', '100px', '400px', '300px', 'Notepad');
    document.body.appendChild(notepadWin);

    var notepadTextArea = document.createElement('textarea');
    notepadTextArea.style.width = '100%';
    notepadTextArea.style.height = '80%';
    notepadTextArea.placeholder = 'Enter or load text here...';
    notepadWin.appendChild(notepadTextArea);

    var uploadButton = createButton('Upload Text File', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = function() {
            handleFileUpload(input, function(content) {
                notepadTextArea.value = content;
            });
        };
        input.click();
    });
    notepadWin.appendChild(uploadButton);

    notepadWin.appendChild(createCloseButton(notepadWin));

    // Drawing app window
    var drawingWin = createWindow('200px', '500px', '500px', '400px', 'Drawing App');
    document.body.appendChild(drawingWin);

    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 400;
    drawingWin.appendChild(canvas);

    var uploadImageButton = createButton('Upload Image', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function() {
            var file = input.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var img = new Image();
                    img.onload = function() {
                        ctxDrawing.drawImage(img, 0, 0, canvas.width, canvas.height);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
    drawingWin.appendChild(uploadImageButton);

    drawingWin.appendChild(createCloseButton(drawingWin));

    // HTML Viewer window
    var htmlViewerWin = createWindow('600px', '200px', '600px', '400px', 'HTML Viewer');
    document.body.appendChild(htmlViewerWin);

    var htmlTextArea = document.createElement('textarea');
    htmlTextArea.style.width = '100%';
    htmlTextArea.style.height = '40%';
    htmlTextArea.placeholder = 'Enter or load HTML code here...';
    htmlViewerWin.appendChild(htmlTextArea);

    var viewHtmlButton = createButton('View HTML', function() {
        htmlIframe.srcdoc = htmlTextArea.value;
    });
    htmlViewerWin.appendChild(viewHtmlButton);

    var uploadHtmlButton = createButton('Upload HTML File', function() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html';
        input.onchange = function() {
            handleFileUpload(input, function(content) {
                htmlTextArea.value = content;
                htmlIframe.srcdoc = content;
            });
        };
        input.click();
    });
    htmlViewerWin.appendChild(uploadHtmlButton);

    var htmlIframe = document.createElement('iframe');
    htmlIframe.style.width = '100%';
    htmlIframe.style.height = '60%';
    htmlViewerWin.appendChild(htmlIframe);

    htmlViewerWin.appendChild(createCloseButton(htmlViewerWin));

    // Function to bring a window to the front
    function bringToFront(window) {
        var windows = document.querySelectorAll('.window');
        windows.forEach(function(win) {
            win.style.zIndex = '1';
        });
        window.style.zIndex = '100';
    }

    // Function to create resizable window
    function createWindow(left, top, width, height, title) {
        var windowDiv = document.createElement('div');
        windowDiv.classList.add('window');
        windowDiv.style.position = 'absolute';
        windowDiv.style.left = left;
        windowDiv.style.top = top;
        windowDiv.style.width = width;
        windowDiv.style.height = height;
        windowDiv.style.backgroundColor = '#f0f0f0';
        windowDiv.style.border = '1px solid #333';
        windowDiv.style.zIndex = '1';
        windowDiv.style.display = 'none';
        windowDiv.style.resize = 'both'; // Allow resizing
        windowDiv.style.overflow = 'auto'; // Allow content scrolling if resized

        var header = document.createElement('div');
        header.style.backgroundColor = '#333';
        header.style.color = '#fff';
        header.style.padding = '5px';
        header.textContent = title;
        windowDiv.appendChild(header);

        // Attach close button to the window
        var closeButton = createCloseButton(windowDiv);
        windowDiv.appendChild(closeButton);

        // Draggable window functionality
        header.onmousedown = function(e) {
            var offsetX = e.clientX - windowDiv.offsetLeft;
            var offsetY = e.clientY - windowDiv.offsetTop;

            function moveWindow(e) {
                windowDiv.style.left = e.clientX - offsetX + 'px';
                windowDiv.style.top = e.clientY - offsetY + 'px';
            }

            document.addEventListener('mousemove', moveWindow);

            document.onmouseup = function() {
                document.removeEventListener('mousemove', moveWindow);
                document.onmouseup = null;
            };
        };

        return windowDiv;
    }
})();

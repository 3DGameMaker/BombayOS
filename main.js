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
    function handleFileUpload(file, textArea, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            textArea.value = e.target.result;
            if (callback) callback();
        };
        reader.readAsText(file);
    }

    // Notepad window
    var notepadWin = createWindow('500px', '100px', '400px', '300px', 'Notepad');
    document.body.appendChild(notepadWin);

    var notepadTextArea = document.createElement('textarea');
    notepadTextArea.style.width = '100%';
    notepadTextArea.style.height = '80%';
    notepadWin.appendChild(notepadTextArea);

    // File upload button for Notepad
    var fileInputNotepad = document.createElement('input');
    fileInputNotepad.type = 'file';
    fileInputNotepad.accept = '.txt';
    fileInputNotepad.style.width = '100%';
    fileInputNotepad.onchange = function(event) {
        if (event.target.files.length > 0) {
            handleFileUpload(event.target.files[0], notepadTextArea);
        }
    };
    notepadWin.appendChild(fileInputNotepad);

    notepadWin.appendChild(createCloseButton(notepadWin));

    // HTML Viewer window
    var htmlViewerWin = createWindow('600px', '200px', '600px', '400px', 'HTML Viewer');
    document.body.appendChild(htmlViewerWin);

    var htmlTextArea = document.createElement('textarea');
    htmlTextArea.style.width = '100%';
    htmlTextArea.style.height = '50%';
    htmlTextArea.placeholder = 'Enter your HTML code here...';
    htmlViewerWin.appendChild(htmlTextArea);

    var htmlIframe = document.createElement('iframe');
    htmlIframe.style.width = '100%';
    htmlIframe.style.height = '50%';
    htmlViewerWin.appendChild(htmlIframe);

    var viewHtmlButton = createButton('View HTML', function() {
        htmlIframe.srcdoc = htmlTextArea.value; // Set iframe content to HTML entered in textarea
    });
    htmlViewerWin.appendChild(viewHtmlButton);

    // File upload button for HTML Viewer
    var fileInputHtml = document.createElement('input');
    fileInputHtml.type = 'file';
    fileInputHtml.accept = '.html';
    fileInputHtml.style.width = '100%';
    fileInputHtml.onchange = function(event) {
        if (event.target.files.length > 0) {
            handleFileUpload(event.target.files[0], htmlTextArea, function() {
                htmlIframe.srcdoc = htmlTextArea.value; // Update iframe content after loading file
            });
        }
    };
    htmlViewerWin.appendChild(fileInputHtml);

    htmlViewerWin.appendChild(createCloseButton(htmlViewerWin));

    // Drawing app window
    var drawingWin = createWindow('200px', '500px', '500px', '400px', 'Drawing App');
    document.body.appendChild(drawingWin);

    var canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 400;
    drawingWin.appendChild(canvas);

    drawingWin.appendChild(createCloseButton(drawingWin));

    var ctxDrawing = canvas.getContext('2d');
    var drawing = false;
    var eraseMode = false; // Track whether erasing is enabled

    // Set the initial drawing color
    var currentColor = '#000';

    // Add the "Erase" button
    var eraseButton = createButton('Erase', function() {
        eraseMode = !eraseMode;
        if (eraseMode) {
            currentColor = '#f0f0f0'; // Erasing color matches canvas background
            eraseButton.textContent = 'Draw'; // Change button text to "Draw"
        } else {
            currentColor = '#000'; // Back to drawing color
            eraseButton.textContent = 'Erase'; // Change button text to "Erase"
        }
    });
    drawingWin.appendChild(eraseButton);

    // Add the "Clear Canvas" button
    var clearButton = createButton('Clear Canvas', function() {
        ctxDrawing.clearRect(0, 0, canvas.width, canvas.height);
    });
    drawingWin.appendChild(clearButton);

    // File upload button for Drawing App
    var fileInputDrawing = document.createElement('input');
    fileInputDrawing.type = 'file';
    fileInputDrawing.accept = '.png,.jpg,.jpeg';
    fileInputDrawing.style.width = '100%';
    fileInputDrawing.onchange = function(event) {
        if (event.target.files.length > 0) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var img = new Image();
                img.onload = function() {
                    ctxDrawing.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing the image
                    ctxDrawing.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    drawingWin.appendChild(fileInputDrawing);

    // Drawing functionality
    canvas.addEventListener('mousedown', function(e) {
        drawing = true;
        ctxDrawing.beginPath();
        ctxDrawing.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', function(e) {
        if (drawing) {
            ctxDrawing.strokeStyle = currentColor; // Set the current drawing color (either black or erase color)
            ctxDrawing.lineTo(e.offsetX, e.offsetY);
            ctxDrawing.stroke();
        }
    });

    canvas.addEventListener('mouseup', function() {
        drawing = false;
        ctxDrawing.closePath();
    });

    canvas.addEventListener('mouseleave', function() {
        drawing = false;
    });

    // Calculator window
    var calcWin = createWindow('100px', '100px', '300px', '300px', 'Calculator');
    document.body.appendChild(calcWin);

    var input = document.createElement('input');
    input.id = 'calcInput';
    input.style.width = '100%';
    input.style.fontSize = '24px';
    calcWin.appendChild(input);

    var buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+'
    ];

    buttons.forEach(function(value) {
        var button = createButton(value, function() {
            var currentInput = document.getElementById('calcInput');
            if (value === '=') {
                try {
                    currentInput.value = eval(currentInput.value);
                } catch (e) {
                    currentInput.value = 'Error';
                }
            } else {
                currentInput.value += value;
            }
        });
        calcWin.appendChild(button);
    });

    calcWin.appendChild(createCloseButton(calcWin));

    // Pong game window
    var pongWin = createWindow('800px', '100px', '600px', '400px', 'Pong');
    document.body.appendChild(pongWin);

    var canvasPong = document.createElement('canvas');
    canvasPong.width = 600;
    canvasPong.height = 400;
    pongWin.appendChild(canvasPong);

    var ctxPong = canvasPong.getContext('2d');
    var ballRadius = 10;
    var x = canvasPong.width / 2;
    var y = canvasPong.height / 2;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 75;
    var paddleWidth = 10;
    var paddleX = (canvasPong.width - paddleWidth) / 2;
    var paddleY = (canvasPong.height - paddleHeight) / 2;
    var rightPressed = false;
    var leftPressed = false;

    function drawBall() {
        ctxPong.beginPath();
        ctxPong.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctxPong.fillStyle = '#0095DD';
        ctxPong.fill();
        ctxPong.closePath();
    }

    function drawPaddle() {
        ctxPong.beginPath();
        ctxPong.rect(paddleX, paddleY, paddleWidth, paddleHeight);
        ctxPong.fillStyle = '#0095DD';
        ctxPong.fill();
        ctxPong.closePath();
    }

    function draw() {
        ctxPong.clearRect(0, 0, canvasPong.width, canvasPong.height);
        drawBall();
        drawPaddle();

        if (x + dx > canvasPong.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy > canvasPong.height - ballRadius || y + dy < ballRadius) {
            dy = -dy;
        }

        x += dx;
        y += dy;

        if (rightPressed && paddleX < canvasPong.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        requestAnimationFrame(draw);
    }

    function startPong() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                rightPressed = true;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                leftPressed = true;
            }
        });

        document.addEventListener('keyup', function(e) {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
                rightPressed = false;
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
                leftPressed = false;
            }
        });

        draw();
    }

    function bringToFront(window) {
        var windows = document.querySelectorAll('.window');
        windows.forEach(function(win) {
            win.style.zIndex = '1';
        });
        window.style.zIndex = '100';
    }

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

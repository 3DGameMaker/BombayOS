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

    taskbar.appendChild(createButton('Open Calculator', function() {
        calcWin.style.display = 'block';
    }));

    taskbar.appendChild(createButton('Open Pong', function() {
        pongWin.style.display = 'block';
        startPong();
    }));

    taskbar.appendChild(createButton('Open YouTube Player', function() {
        youtubeWin.style.display = 'block';
    }));

    var calcWin = document.createElement('div');
    calcWin.style.position = 'absolute';
    calcWin.style.top = '100px';
    calcWin.style.left = '100px';
    calcWin.style.width = '300px';
    calcWin.style.height = '300px';
    calcWin.style.backgroundColor = '#f0f0f0';
    calcWin.style.border = '2px solid #000';
    calcWin.style.resize = 'both';
    calcWin.style.overflow = 'auto';
    calcWin.style.zIndex = '9999';
    calcWin.style.display = 'none';
    document.body.appendChild(calcWin);

    var closeCalcButton = createButton('X', function() {
        calcWin.style.display = 'none';
    });
    closeCalcButton.style.backgroundColor = '#ff0000';
    closeCalcButton.style.position = 'absolute';
    closeCalcButton.style.top = '5px';
    closeCalcButton.style.right = '5px';
    calcWin.appendChild(closeCalcButton);

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

    var pongWin = document.createElement('div');
    pongWin.style.position = 'absolute';
    pongWin.style.top = '100px';
    pongWin.style.left = '500px';
    pongWin.style.width = '400px';
    pongWin.style.height = '300px';
    pongWin.style.backgroundColor = '#fff';
    pongWin.style.border = '2px solid #000';
    pongWin.style.resize = 'both';
    pongWin.style.overflow = 'auto';
    pongWin.style.zIndex = '9999';
    pongWin.style.display = 'none';
    document.body.appendChild(pongWin);

    var closePongButton = createButton('X', function() {
        pongWin.style.display = 'none';
    });
    closePongButton.style.backgroundColor = '#ff0000';
    closePongButton.style.position = 'absolute';
    closePongButton.style.top = '5px';
    closePongButton.style.right = '5px';
    pongWin.appendChild(closePongButton);

    var pongCanvas = document.createElement('canvas');
    pongCanvas.width = 400;
    pongCanvas.height = 300;
    pongWin.appendChild(pongCanvas);

    var ctx = pongCanvas.getContext('2d');
    var paddleWidth = 10,
        paddleHeight = 60;
    var ballRadius = 10;
    var playerY = pongCanvas.height / 2 - paddleHeight / 2,
        aiY = playerY;
    var ballX = pongCanvas.width / 2,
        ballY = pongCanvas.height / 2;
    var ballSpeedX = 2,
        ballSpeedY = 2;
    var playerScore = 0,
        aiScore = 0;

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
        ballX = pongCanvas.width / 2;
        ballY = pongCanvas.height / 2;
        ballSpeedX = 2;
        ballSpeedY = 2;
    }

    var youtubeWin = document.createElement('div');
    youtubeWin.style.position = 'absolute';
    youtubeWin.style.top = '150px';
    youtubeWin.style.left = '300px';
    youtubeWin.style.width = '560px';
    youtubeWin.style.height = '315px';
    youtubeWin.style.backgroundColor = '#fff';
    youtubeWin.style.border = '2px solid #000';
    youtubeWin.style.resize = 'both';
    youtubeWin.style.overflow = 'auto';
    youtubeWin.style.zIndex = '9999';
    youtubeWin.style.display = 'none';
    document.body.appendChild(youtubeWin);

    var closeYouTubeButton = createButton('X', function() {
        youtubeWin.style.display = 'none';
    });
    closeYouTubeButton.style.backgroundColor = '#ff0000';
    closeYouTubeButton.style.position = 'absolute';
    closeYouTubeButton.style.top = '5px';
    closeYouTubeButton.style.right = '5px';
    youtubeWin.appendChild(closeYouTubeButton);

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
    youtubeIframe.src = '';
    youtubeWin.appendChild(youtubeIframe);
})();

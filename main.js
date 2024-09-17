    aiY += (ballY - (aiY + paddleHeight / 2)) * 0.1;

    requestAnimationFrame(drawPong);
}

function resetPong() {
    playerScore = 0;
    aiScore = 0;
}

// YouTube Player window
var youtubeWin = createWindow('700px', '100px', '500px', '315px', 'YouTube Player');
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

var { uploadButton: notepadUploadButton, fileInput: notepadFileInput } = createFileUploadButton(function(content) {
    notepadTextArea.value = content;
});
notepadWin.appendChild(notepadUploadButton);

var notepadTextArea = document.createElement('textarea');
notepadTextArea.style.width = '100%';
notepadTextArea.style.height = '90%';
notepadTextArea.placeholder = 'Enter text here...';
notepadWin.appendChild(notepadTextArea);

notepadWin.appendChild(createCloseButton(notepadWin));

// Drawing app window
var drawingWin = createWindow('200px', '500px', '500px', '400px', 'Drawing App');
document.body.appendChild(drawingWin);

var { uploadButton: drawingUploadButton, fileInput: drawingFileInput } = createFileUploadButton(function(content) {
    var img = new Image();
    img.src = content;
    img.onload = function() {
        ctxDrawing.drawImage(img, 0, 0);
    };
});
drawingWin.appendChild(drawingUploadButton);

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

// HTML Viewer window
var htmlViewerWin = createWindow('600px', '200px', '600px', '400px', 'HTML Viewer');
document.body.appendChild(htmlViewerWin);

var { uploadButton: htmlUploadButton, fileInput: htmlFileInput } = createFileUploadButton(function(content) {
    htmlTextArea.value = content;
    htmlIframe.srcdoc = content; // Set iframe content to HTML entered in textarea
});
htmlViewerWin.appendChild(htmlUploadButton);

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

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

    // Button to open the HTML Viewer
    var openHTMLViewerButton = createButton('Open HTML Viewer', function() {
        htmlViewerWin.style.display = 'block';
    });
    taskbar.appendChild(openHTMLViewerButton);

    // HTML Viewer Window
    var htmlViewerWin = createWindow('100px', '100px', '600px', '400px', 'HTML Viewer');
    document.body.appendChild(htmlViewerWin);

    // HTML Upload input
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

    // Iframe to display the HTML file
    var htmlIframe = document.createElement('iframe');
    htmlIframe.style.width = '100%';
    htmlIframe.style.height = '80%';
    htmlIframe.style.border = '1px solid #000';
    htmlIframe.style.marginTop = '10px';
    htmlViewerWin.appendChild(htmlIframe);

    // Utility function to create a button
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

    // Create draggable windows
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

        // Dragging functionality
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
})();

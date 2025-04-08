let coverageWidth = 250;
let coverageHeight = 250;

function draw3D(xyTextureCoordinatesArr, canvasImg) {
    const gpu = new GPU();
    const drawRect = gpu.createKernel(function(origin, xyTextArr, canvasImg, coverageWidth, coverageHeight) {
        const x = this.thread.x;
        const y = this.constants.yPixelMax - this.thread.y;

        const pixel = canvasImg[this.thread.y][x];
        if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
            this.color(255, 255, 255, 1);
        } else {
            this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
        }

        const xBound = origin[0] - coverageWidth;
        const yBound = origin[1] - coverageHeight;
        if ((x < origin[0] && x > xBound) && (y < origin[1] && y > yBound) &&
        xyTextArr[y][x] > 0) {
            this.color(1, 0, 0, 1);
        } else if ((y === origin[1] || y === yBound) && (x < origin[0] && x > xBound) ||
        (x === origin[0] || x === xBound) && (y < origin[1] && y > yBound)) {
            this.color(0, 0, 0, 1);
        }
    }, {
        constants: {
            yPixelMax: $(document).height(),
        }
    })
    .setOutput([$(document).width(), $(document).height()])
    .setGraphical(true);
    
    function drawAndAppendCanvas(opts) {
        drawRect(opts.mouseOrigin, xyTextureCoordinatesArr, opts.image, coverageWidth, coverageHeight);
        const squareCanvas = drawRect.canvas;
        squareCanvas.id = "squareCanvas";
        $('#squareCanvas').remove();
        document.body.appendChild(drawRect.canvas);
    }

    function track(e) {
        if (canvasImg) {
            const mouseOrigin = [e.pageX, e.pageY];
            let image = new Image();
            image.src = canvasImg.toDataURL();
            const opts = {
                image: image,
                mouseOrigin: mouseOrigin
            }
            if (image.complete) {
                drawAndAppendCanvas(opts);
            } else {
                image.onload = function () {
                    drawAndAppendCanvas(opts);
                }   
            }     
        }
    }
    
    addEventListener("mousemove", track, false);
    window.addEventListener("wheel", e => {
        const delta = Math.sign(e.deltaY) * -15;
        coverageWidth += delta;
        coverageHeight += delta;
        track(e);
        console.info(delta);
    });
}
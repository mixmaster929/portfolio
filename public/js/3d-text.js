// Settings
const fontName = "Verdana";
const textureFontSize = 95;

// String to show
let string = "Some text\nto sample\nwith Canvas";

// Coordinates data per 2D canvas and 3D scene
let textureCoordinates = [];
let xyTextureCoordinatesArr = [];

// Create 2 canvas: one to draw and sample the text,
// second to show sample coordinates as points
const textCanvas = document.createElement("canvas");
textCanvas.style.zIndex = 2;
const textCtx = textCanvas.getContext("2d");
document.body.appendChild(textCanvas);

const dotsCanvas = document.createElement("canvas");
dotsCanvas.style.zIndex = 2;
const dotsCtx = dotsCanvas.getContext("2d");
document.body.appendChild(dotsCanvas);

const fullPageCanvas = document.createElement("canvas");
fullPageCanvas.style.zIndex = 2;
const fullPageCanvasCtx = fullPageCanvas.getContext("2d");


// ---------------------------------------------------------------

sampleCoordinates();
// drawDots();

// ---------------------------------------------------------------
function sampleCoordinates() {
    // Parse text
    const lines = string.split(`\n`);
    const linesMaxLength = [...lines].sort((a, b) => b.length - a.length)[0]
        .length;
    const wTexture = textureFontSize * 0.7 * linesMaxLength;
    const hTexture = lines.length * textureFontSize;

    // Draw text
    const linesNumber = lines.length;
    textCanvas.width = wTexture;
    textCanvas.height = hTexture;
    textCtx.font = "100 " + textureFontSize + "px " + fontName;
    textCtx.fillStyle = "#2a9d8f";
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    for (let i = 0; i < linesNumber; i++) {
        textCtx.fillText(lines[i], 0, ((i + 0.8) * hTexture) / linesNumber);
    }

    // Sample coordinates
    textureCoordinates = [];
    xyTextureCoordinatesArr = new Array($(document).height());
    for (let i = 0; i < $(document).height(); i++) {
        xyTextureCoordinatesArr[i] = new Array($(document).width()).fill(0);
    }
    const samplingStep = 4;
    if (wTexture > 0) {
        const imageData = textCtx.getImageData(
            0,
            0,
            textCanvas.width,
            textCanvas.height
        );
        for (let i = 0; i < textCanvas.height; i += samplingStep) {
            for (let j = 0; j < textCanvas.width; j += samplingStep) {
                if (imageData.data[(j + i * textCanvas.width) * 4] > 0) {
                    textureCoordinates.push({
                        x: j,
                        y: i
                    });
                    xyTextureCoordinatesArr[i][j] = 1;
                }
            }
        }
    }

    fullPageCanvas.width = $(document).width()
    fullPageCanvas.height = $(document).height();
    fullPageCanvasCtx.drawImage(textCanvas, 0, 0);
    draw3D(xyTextureCoordinatesArr, fullPageCanvas);
}

// ---------------------------------------------------------------

function drawDots() {
    dotsCanvas.width = textCanvas.width;
    dotsCanvas.height = textCanvas.height;
    dotsCtx.fillStyle = "#ff0000";

    dotsCtx.clearRect(0, 0, dotsCanvas.width, dotsCanvas.height);


    // for (let i = 0; i < textureCoordinates.length; i++) {
    //     dotsCtx.beginPath();
    //     dotsCtx.arc(
    //         textureCoordinates[i].x,
    //         textureCoordinates[i].y,
    //         1,
    //         0,
    //         Math.PI * 2,
    //         true
    //     );
    //     dotsCtx.closePath();
    //     dotsCtx.fill();
    // }
}

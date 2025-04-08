import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import GPUtil from './utils/gpu-util';

const PureCanvas = React.forwardRef((props, ref) => <canvas style={props.style} ref={ref} />);

function draw(ctx) {
  // console.log(ctx);
}

function CanvasCircle(text) {
  const circleCanvas = React.useRef(null);
  const numLinesCanvas = React.useRef(null);

  const headRef = React.useRef(null);
  let [radius, setRadius] = React.useState((window.innerHeight - 35) / 2);
  const [numNumbersRef, setNumNumbers] = React.useState(9);
  const [numPetalsRef, setNumPetals] = React.useState(2);
  const [displayNumbers, setDisplayNumbers] = React.useState(false);

  const rotate = function(cx, cy, radius, angle) {
    const radians = angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cx + radius * cos,
    ny = cy - radius * sin
    return [nx, ny];
  };

  const drawCircle = (event) => {
    const ctx = circleCanvas.current.getContext('webgl');
    const gputil = new GPUtil(circleCanvas.current.width, circleCanvas.current.height);
    radius = radius ? Number(radius) : 150;
    let cx = window.innerWidth / 2;
    let cy = (window.innerHeight - headRef.current.offsetHeight - 6) / 2;

    const opts = {
      canvas: circleCanvas.current,
      center: [cx, cy],
      radius: radius,
    };

    gputil.updateCanvas(opts);
  };

  const drawNumbersLines = (event) => {
    const ctx = numLinesCanvas.current.getContext('2d');
    ctx.clearRect(0, 0, numLinesCanvas.current.width, numLinesCanvas.current.height);

    const x = window.innerWidth / 2;
    const y = (window.innerHeight - headRef.current.offsetHeight - 6) / 2;

    const cc = Math.PI * 2;
    radius = radius ? Number(radius) : 150;
    const start = Math.PI / 2 - (Math.PI / radius);
    let xLast, yLast;

    const multiplier = Number(numPetalsRef);

    ctx.beginPath();

    for (let i = 0; i < numNumbersRef; i++) {
      if ((multiplier * i) % numNumbersRef !== i) {
        const x1 = x + radius * Math.sin(i * 2 * Math.PI / numNumbersRef);
        const y1 = y - radius * Math.cos(i * 2 * Math.PI / numNumbersRef);
        const x2 = x + radius * Math.sin(multiplier * i * 2 * Math.PI / numNumbersRef);
        const y2 = y - radius * Math.cos(multiplier * i * 2 * Math.PI / numNumbersRef);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    if (displayNumbers) {
      const fs = 15;
      ctx.font = fs + 'px serif';
      ctx.textAlign = "center";
      for (let i = 1; i <= numNumbersRef; i++) {
        const angle = start - cc * (i / numNumbersRef);
        const rotatedText = rotate(x, y, radius + fs, angle);
        ctx.fillText(i , rotatedText[0], rotatedText[1], fs);
      }
    }
  };

  const drawAll = e => {
    drawNumbersLines(e);
    drawCircle(e);
  }

  React.useEffect(() => {
    window.addEventListener('mousemove', drawNumbersLines);
    window.addEventListener('mousemove', drawCircle);

    return () => window.removeEventListener('mousemove', drawAll);
  });

  React.useEffect(() => {
    const ctxCircle = circleCanvas.current.getContext("webgl");
    requestAnimationFrame(() => draw(ctxCircle));
    const handleWebGlResize = e => {
      ctxCircle.canvas.width = window.innerWidth;
      ctxCircle.canvas.height = window.innerHeight - headRef.current.offsetHeight - 6;
    };

    handleWebGlResize();

    window.addEventListener("resize", handleWebGlResize);

    const ctxNumLines = numLinesCanvas.current.getContext("2d");
    requestAnimationFrame(() => draw(ctxNumLines));
    const handle2dResize = e => {
      ctxNumLines.canvas.width = window.innerWidth;
      ctxNumLines.canvas.height = window.innerHeight - headRef.current.offsetHeight - 6;
    };

    handle2dResize();

    window.addEventListener("resize", handle2dResize);

    const twoResizes = e => {
      handleWebGlResize(e);
      handle2dResize(e);
    }

    drawAll();

    return () => window.removeEventListener("resize", twoResizes);
  }, []);


  const setRadiusDraw = e => {
    setRadius(e.target.value);
    drawAll();
  }

  const setNumNumbersDraw = e => {
    setNumNumbers(e.target.value);
    drawAll();
  }

  const setNumPetalsDraw = e => {
    setNumPetals(e.target.value);
    drawAll();
  }

  const setDisplayNumbersDraw = e => {
    setDisplayNumbers(e.target.checked);
    drawAll();
  }

  return (
    <div>
      <Container  ref={headRef}>
        <Row>
          <Col sm={1}>
            <label>Radius:</label>
          </Col>
          <Col sm={1}>
            <input
              type="number"
              value={radius}
              name="radius"
              step="25"
              min="1"
              onChange={ e =>  setRadiusDraw(e) }
            />
          </Col>
          <Col sm={2}>
            <label>
            <input
              type="checkbox"
              onChange={ e =>  setDisplayNumbersDraw(e) }
            />
            Numbers:</label>
          </Col>
          <Col sm={1}>
            <input
              type="number"
              value={numNumbersRef}
              name="numNumbersRef"
              min="1"
              step="15"
              onChange={ e => setNumNumbersDraw(e) }
            />
          </Col>
          <Col sm={1}>
            <label>Petals:</label>
          </Col>
          <Col sm={1}>
            <input
              type="number"
              value={numPetalsRef}
              name="numPetalsRef"
              min="2"
              onChange={ e => setNumPetalsDraw(e) }
            />
          </Col>
          <Col sm={1}></Col>
        </Row>
      </Container>
      <PureCanvas style={text.style} ref={circleCanvas} />
      <PureCanvas style={text.style} ref={numLinesCanvas} />
    </div>
  );
}

export default CanvasCircle;

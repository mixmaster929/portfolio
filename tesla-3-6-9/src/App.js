// dashboard/src/App.js
import React, { useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CanvasCircle from './CanvasCircle';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import GPUtil from './utils/gpu-util';

function App() {

  return (
    <div className="App">



      <CanvasCircle

        style={{
          zIndex: 0,
          position: "fixed"
        }}
      >
      </CanvasCircle>

    </div>
  );
}
export default App;

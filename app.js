const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/public'));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get("/3d-text", async (req, res) => {
  res.sendFile(path.join(__dirname, '/views/3d-text.html'));
});

// app.get("/resume", async (req, res) => {
//   res.sendFile(path.join(__dirname, '/views/resume.html'));
// });

app.get("/test", (req, res) => {
  res.send("<h1>I SEE YOU TESTING</h1>");
});

const teslaRouter = require('./routes/tesla-3-6-9');
app.use('/tesla-3-6-9', teslaRouter);
app.use(express.static(path.join(__dirname, 'build'))); // new

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
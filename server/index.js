const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readFileSync, writeFileSync } = require('fs');

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.post('/', (request, response) => {
  const p = request.body;
  console.log(p.file);
  if (p.file) {
    const content = readFileSync(p.file).toString();
    const result = content.substring(0, p.start) + content.substring(p.end, content.length);
    console.log(result);
//    writeFileSync(p.file, result);
  }
  response.end();
});

app.listen(8081);


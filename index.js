const app = require('express')();
const { json } = require('express');
const dataEngine = require('./dataEngine');

app.use('/ping', (req, res) => res.send('pong'));

app.use('/data', (req, res) => {
  const result = dataEngine.queryData(req.query);
  return res.json(result);
});

app.listen(8080, () => console.log('server listening. Health status check http://localhost:8080/ping'));

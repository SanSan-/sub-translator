const translate = require('./google-translate');

module.exports = (app) => {

  app.post('/api/translate/google-api', (req, res) => {
    const text = req.body.text && req.body.text.toString().replace(/^./g, '').replace(/.$/g, '').replace(/\\"/gi, '"');
    const opts = JSON.parse(req.body.opts);
    translate(text, opts).then(response => {
      res.status(200);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(response);
    }).catch(err => {
      console.error(err);
      res.status(err.status);
      res.send(err);
    });
  });

  app.post('/api/translate/google-api-multi', (req, res) => {
    const tranObj = req.body.tranObj && JSON.parse(req.body.tranObj);
    const opts = JSON.parse(req.body.opts);
    translate(tranObj, opts).then(response => {
      res.status(200);
      res.setHeader('Content-Type', 'application/json;charset=utf-8');
      res.send(response);
    }).catch(err => {
      console.error(err);
      res.status(err.status);
      res.send(err);
    });
  });

};

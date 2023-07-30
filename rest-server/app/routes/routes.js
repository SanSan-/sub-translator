import createHttpProxyAgent from 'http-proxy-agent';

const translate = require('google-translate-api-x');

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

module.exports = (app) => {

  app.post('/api/translate/google-api', (req, res) => {
    const text = req.body.text && req.body.text.toString().replace(/^./g, '').replace(/.$/g, '').replace(/\\"/gi, '"');
    const { api, ...opts } = JSON.parse(req.body.opts);
    // const agent = createHttpProxyAgent('http://178.128.200.87:80');
    sleep(1500).then(() => {
      try {
        translate(text, { ...opts, forceBatch: false }).then(response => {
          console.log(response);
          res.status(200);
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.send(response);
        }).catch(e => {
          console.error(e);
          res.status(e.status);
          res.send(e);
        });
      } catch (e) {
        console.error(e);
      }
    });
  });

  app.post('/api/translate/google-api-multi', (req, res) => {
    const tranObj = req.body.tranObj && JSON.parse(req.body.tranObj);
    const { api, ...opts } = JSON.parse(req.body.opts);
    const agent = createHttpProxyAgent('http://130.61.34.56:80');
    sleep(1000).then(() => {
      translate(tranObj, { ...opts, forceBatch: false, fetchOptions: { agent } }).then((response) => {
        console.log(response);
        res.status(200);
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.send(response);
      }).catch((e) => {
        console.error(e);
        res.status(e.status);
        res.send(e);
      });
    });
  });

};

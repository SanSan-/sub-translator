const jsonToXls = require('./xls/jsonToXls');
const tagUtils = require('./utils/TagsUtils');
const contentDisposition = require('content-disposition');
const translate = require('translate-google');

module.exports = (app) => {

  app.post('/api/export/excel', (req, res) => {
    const fileName = req.body.fileName.toString().replace(/"/gi, '');
    const type = req.body.type.toString().replace(/"/gi, '');
    const jsonArr = JSON.parse(req.body.json);
    const headers = JSON.parse(req.body.headers);
    const conditionalFormatting = JSON.parse(req.body.conditionalFormatting);
    res.status(200);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', contentDisposition(fileName));
    jsonToXls.convertJsonToXls(type, jsonArr, headers, conditionalFormatting).xlsx.write(res)
      .then(function () {
        res.end();
      });
  });

  app.post('/api/tags/generate', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.send(tagUtils.getTagsCloud(JSON.parse(req.body.map)));
  });

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

};

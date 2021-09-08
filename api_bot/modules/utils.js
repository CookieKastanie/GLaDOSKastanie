const http = require("http");

exports.httpGetJSON = url => {
  return new Promise((resolve, reject) => {
    let req = http.get(url, res => {
      let bodyChunks = new Array();
      res.on('data', chunk => {
        bodyChunks.push(chunk);
      }).on('end', () => {
        let body = Buffer.concat(bodyChunks);
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      })
    });

    req.on('error', e => {
      reject(e);
    });
  });
}

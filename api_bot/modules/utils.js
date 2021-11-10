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

exports.secondsToHms = d => {
    if(d === 0) return '---';

    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);
    const s = Math.floor(d % 3600 % 60);

    const hDisplay = h > 0 ? `${h}h` : '';
    const mDisplay = m > 0 ? `${m}m` : '';
    const sDisplay = s > 0 ? `${s}s` : '';

    return hDisplay + mDisplay + sDisplay; 
}

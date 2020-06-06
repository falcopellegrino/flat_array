var http = require('http');

//https://stackoverflow.com/questions/12006417/node-js-server-that-accepts-post-requests
//https://stackoverflow.com/questions/49084718/how-exactly-add-service-worker-allowed-to-register-service-worker-scope-in-upp/49098917#49098917
//https://stackoverflow.com/questions/13272406/convert-string-with-commas-to-array
//https://stackoverflow.com/questions/5796718/html-entity-decode
//https://stackoverflow.com/questions/4775722/how-to-check-if-an-object-is-an-array
//https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Statements/throw
//https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/Array/flat
const server = http.createServer(function(request, response) {
    console.dir(request.param)
  
    if (request.method == 'POST') {
      console.log('POST')
      var body = ''
      request.on('data', function(data) {
        body += data
        console.log('Partial body: ' + body)
      })
      request.on('end', function() {

        try {
            console.log('Body: ' + body)
            response.writeHead(200, {'Content-Type': 'text/html'})
            var posted = (body.split("=")[1]).trim();
            console.log('posted: ' + posted);
            console.log('Object.prototype.toString.call( posted ): ' + Object.prototype.toString.call( posted ) )
            
            
            var postDecoded = decode(posted.toString());
            var array = JSON.parse(postDecoded);

            
            
            console.log('Object.prototype.toString.call( array ): ' + Object.prototype.toString.call( array ) )
            
            if(!(Object.prototype.toString.call(array)  === '[object Array]' )) throw 'Parameter is not a array!';

            // for (let index = 0; index < array.length; index++) {
            //     const element = array[index];
            //     console.log('element:'+element);
            // }

            var flattedArray = flatArray(array);

            var strResp = `
            <html><body><div>`;
            strResp += "Original Array = " + postDecoded;
            strResp += "<br />Flatted Array = [" + flattedArray.toString() + "]";
            strResp += `
            </div></body></html>`;
            // response.end(decode(posted));

            response.end(strResp);
            
        }
        catch(err) {
            console.log('err: ' + err);
            response.end('you are trying to do something that sounds strange...');

        }


      })
    } else {https:
      console.log('GET')
      //http://localhost:3001
      var html = `
              <html>
                  <body>
                      <form method="post" action="">Paste here your multidimensional array:<br/>
                        e.g.: [[1,2,[3]],4]
                        <input type="text" name="name" />
                        <input type="submit" value="Submit" />
                      </form>
                  </body>
              </html>`
      response.writeHead(200, {'Content-Type': 'text/html'})
      response.end(html)
    }
  });

function decode (str) {
    if(str && typeof str === 'string') {
        str = str.replace(/%5B/g, '[');
        str = str.replace(/%2C/g, ',');
        str = str.replace(/%5D/g, ']');
        str = str.replace(/%20/g, '');
        str = str.replace(/\+/g, '');
        
        return str;
    }
}
function flatArray (arr1) {
    return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatArray(val)) : acc.concat(val), []);
}

//const port = 3001
const port = process.env.PORT || 8080;

//const host = '127.0.0.1'
//server.listen(port, host)
server.listen(port)

//console.log(`Listening at http://${host}:${port}`)
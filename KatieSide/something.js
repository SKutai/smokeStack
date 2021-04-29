// https://www.codecademy.com/learn/introduction-to-javascript/modules/intermediate-javascript-requests/cheatsheet
// https://attacomsian.com/blog/xhr-post-request 

const 
  http = require('http'),
  hostname = '127.0.0.1',
  port = 3000,
  fs = require("fs"),
  { parse } = require('querystring');
  
let 
  item,
  form = "",
  filedata;

// read the data that is currently stored on the server
fs.readFile("./storage.txt", (err, data) => {
  if(err){
    console.log(err);
  }
  else{
    filedata = JSON.parse(data.toString());
    console.log("This is the filedata: "  + JSON.stringify(filedata) + "\ntypeof filedata: " + typeof filedata);
  }
});

// start up the server
const server = http.createServer((req, res) => {

  if(req.method == 'POST'){

    req.on('data', chunk => {
      form += chunk.toString();
    });

    req.on('end', () => {
      console.log("this is the form: " + form);
      item = parse(form);
      form = ""; // reset form so that the data does not pile up
      console.log("this is the item: " + JSON.stringify(item) + "\n" + typeof item);

      updateJSON();
      
      res.end(`<!DOCTYPE html>
        <html>
            <head>
                <style>
                    html, body {
                        outline: 5px solid red;
                        margin: 0;
                        height: 100%;
                    }

                    #threecanvas{
                        outline: 5px solid green;
                        height: 100%;
                        width: 70%;
                    }

                    #sidePanel {
                        outline: 5px solid blue;
                        margin: 5px;
                        float:right;
                    }
                </style>
            </head>

            <body>
                <canvas id="threecanvas"></canvas>

                <form id='sidePanel' action="http://127.0.0.1:3000/" method="POST" >
                    <input type="hidden" id="ID" name="ID" value="ID123">
                    
                    <h2>
                        <label for="title">Title</label>
                    </h2>

                    <input type="text" name="title" id="title">
                    <br>

                    <h2>
                        <label for="description">Description</label>
                    </h2>
                    <textarea rows="7" cols="50" name="description" id="description"></textarea>
                    <br>

                    <h2>
                        <label for="picture">Picture</label>
                    </h2>
                    <img id="picture" src="../../resources/galaxy.jpg" alt="landmark on the smokestack" width="300" height="300"><br>
                    
                    <input type="submit" value="save" name="save" id = save>
                </form>
                
            </body>

        </html>`); // after request is done the response should be the same index.html
    });
  }
  else{
    res.end("Finished");
  }
  
}).listen(port);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
});


// write the new data into the text file that is on the server
function updateJSON(){

  // insert the new item into filedata
  let insertOBJ = {
    "title": item.title.toString(),
    "description": item.description.toString()
  };

  filedata[item.ID.toString()] = insertOBJ;

  console.log("filedata is now: " + JSON.stringify(filedata));

  // delete the text file on the server
  if(fs.existsSync("./storage.txt")){
    fs.unlink("./storage.txt", (err) => {
      if(err){
        console.log(err);
      }
      console.log("file deleted");
    });
  }

  // create a new text file and write the new data into it
  fs.writeFile('./storage.txt', JSON.stringify(filedata), (err) => { 
    // In case of a error throw err exception. 
    if (err){
      console.log(err);
    }
  });
}
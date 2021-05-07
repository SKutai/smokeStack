// https://www.codecademy.com/learn/introduction-to-javascript/modules/intermediate-javascript-requests/cheatsheet
// https://attacomsian.com/blog/xhr-post-request 

const 
  http = require('http'),
  hostname = '127.0.0.1', // 'localhost'
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

  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');
  
	if ( req.method === 'OPTIONS' ) {
		res.writeHead(200);
		res.end();
		return;
	}

  console.log("request made");

  if(req.method == 'POST'){
    item = req.body;
    console.log(item);

    req.on('data', chunk => {
      form += chunk.toString();
    });

    req.on('end', () => {
      console.log("this is the form: " + form);
      item = parse(form);
      form = ""; // reset form so that the data does not pile up
      console.log("this is the item: " + JSON.stringify(item) + "\n" + typeof item);

      updateJSON();
      
      res.write(JSON.stringify(filedata));
      res.statusCode = 200;
      res.end("json sent"); 
    });
  }
  else{
    res.end("finished");
  }
  
});

server.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});

// write the new data into the text file that is on the server
function updateJSON(){

  filedata[item.ID.toString()] = item.data;

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
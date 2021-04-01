// https://www.codecademy.com/learn/introduction-to-javascript/modules/intermediate-javascript-requests/cheatsheet
// https://attacomsian.com/blog/xhr-post-request 

const http = require('http');
//const $ = require( "jquery" );
/*
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
*/

const { parse } = require('querystring');

const 
  hostname = '127.0.0.1',
  port = 3000,
  fs = require("fs"),
  pathToJSONFile = './storage.json', // was .txt
  form = document.querySelector('#tag');

form.addEventListener('submit', (event) => {
  // dont change the screen
  event.preventDefault();

  let data = new FormData(form);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/http://127.0.0.1:3000/');
});





let item,
    store;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  let body = "";

  if(req.method == 'POST'){
    req.on('data', function(chunk)
    {
      body += chunk.toString();
      console.log(body);
      item = parse(body);
    });
  }

  
  /*
  $.getJSON('storage.json', function(info){
    let found = false;
    const len = info.length;
    
    for(let i = 0; i < len; i++){
      if(info[i].title == item.title){
        found = true;
        info[i].title = item.title;
        info[i].description = item.description;
      }
    }

    if(!found){
      info[len] = item;
    }

    store = data;
  });
  */

  //fs.writeFileSync(pathToJSONFile, store);

  res.end('Goodbye.\n');
}).listen(port);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})


/*
function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(event.target);

  title = data.get('title');
  description = data.get('description');
  item = {
    title : title,
    description : description
  };
  
  console.log(title);
  console.log(description);
  console.log(item);

  $.getJSON('storage.json', function(data) {
    let found = false;
    const len = data.length;
    
    for(let i = 0; i < len; i++){
      if(data[i].title == title){
        found = true;
        data[i].title = title;
        data[i].description = description;
      }
    }

    if(!found){
      data[len] = item;
    }

    store = data;

    
  });

}

  
const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);
*/
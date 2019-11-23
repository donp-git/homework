const fs = require('fs');
const http = require('http');
const https = require('https');
const nodemailer = require('nodemailer');

const server = http.createServer(function (request, response) {
  //contacts page
  if (request.url === '/contacts') {
    fs.readFile('./index.html', null, function (error, data) {
      if (error) {
        response.writeHead(404);
        response.write('File not found');
        response.end();
      }
      else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end();
      }
    })
  }
  //about page
  else if (request.url === '/about') {
    response.write('<script>');
    response.write(`console.log("You tried to reach: 127.0.0.1${request.url}");`);
    response.write(`console.log("With request method: ${request.method}")`);
    response.write('</script>');
    console.log(`You are here: 127.0.0.1${request.url} `);
    console.log(`HTTP method: ${request.method} `);
    response.end('Check Node/Browser console please');
  }
  //rate
  else if (request.url === '/rate') {
    let PBrates = new (String);
    https.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=3', function (res) {
      if (res.statusCode !== 200) {
        console.log(res.statusCode)
        // response.write(res.statusCode)
        return;
      }
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', function (chunk) { rawData += chunk; });
      res.on('end', function () {
        try {
          PBrates = JSON.parse(rawData);
          console.log(PBrates);
          //display rates
          let file = '<table align="center" border=2 bgcolor="PaleGreen">';
          for (i in PBrates) {
            file += '<tr>';
            for (u in PBrates[i]) {
              file += '<td>' + PBrates[i][u] + '</td>';
            } file += '</tr>';
          }
          file += '</table>'
          response.write(file);
          response.end();
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', function (e) {
      console.error(`Got error: ${e.message} `);
    });

  }

  //4fun
  else if (request.url === '/money') {
    response.write('<script>');
    response.write('async function money(){')
    response.write(`let respond = await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=3');`);
    response.write('let money = await respond.json();')
    response.write('console.table(money);');
    response.write('} money();')
    response.write('</script>');
    response.end('Check your console');
  }

  // email
  else if (request.url === '/send') {
    let transporter = nodemailer.createTransport({
      service: 'gmoil',
      auth: {
        user: 'user1@gmoil.com',
        pass: 'sedltpvlyntlowml'
      }
    });

    var mailOptions = {
      from: 'user1@gmoil.com',
      to: 'user2@gmoil.com',
      subject: 'Its too cold out here',
      text: 'So buy us some beers!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        response.end(error.errno)
      } else {
        console.log('Email sent: ' + info.response);
        response.end(info.response)
      }
    });

  }

  // plain page
  else {
    response.write(`<button onclick='window.location.href="/index"'>Contacts</button> `);
    response.write(`<button onclick='window.location.href="/about"'>About</button> `);
    response.write(`<button onclick='window.location.href="/rate"'>PB Rates</button> `);
    response.write(`<button onclick='window.location.href="/money"'>Browser only rates</button> `);
    response.write(`<button onclick='window.location.href="/send"'>Email</button><br> `);
    response.end('Hello World!')
  }

})

server.listen(3000, function () { console.log('Server is up') });
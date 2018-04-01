var express = require('express');
var app = express();
var https = require('https');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var concat = require('concat-stream');


app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');


app.get('/news/:count', function (req, res) {
    var errorHandler = function (errorDescription, err) {
        console.log(errorDescription, err); 
        res.statusCode = 500;
        res.send(err);
    }

    https.get('https://www.057.ua/rss', function(resp) {

        resp.on('error', function(err) {
            errorHandler('Error while reading', err);
        });
        parser.on('error', function(err) { 
            errorHandler('Error while parsing', err);
        });


        resp.pipe(concat(function(buffer) {
            var str = buffer.toString();
            parser.parseString(str, function(err, result) {
                res.render('index', { news: result.rss.channel[0].item.slice(0, req.params.count)});
            });
        }));

    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


import express from "express";
var port = 2200
import dotenv from 'dotenv'
dotenv.config();
import fs from 'fs'
import https from 'https'
var app = express();
var server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/marukunserver.ml/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/marukunserver.ml/cert.pem'),
}, app)
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, access_token'
    )

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200)
    } else {
        next()
    }
}
app.use(allowCrossDomain)

app.get('/veeapi', function(req, res) {
    const json = JSON.parse(fs.readFileSync('./res.json', 'utf8'));
    res.json(json)
})

app.get('/', function(req, res) {
    res.send('welcome to veeapi')
})


server.listen(port, function() {
    console.log("http://localhost:" + port + "で起動")
})
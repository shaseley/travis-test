var fetch = require('node-fetch');
var http = require('http')
var createHandler = require('travisci-webhook-handler')

const PORT = 8888

fetch('https://api.travis-ci.org/config')
    .then(function(res) {
        return res.text()
    })
    .then(function(body) {
        travisPubKey = ''
        try {
            j = JSON.parse(body);
            travisPubKey = j.config.notifications.webhook.public_key;
            return travisPubKey
        } catch (e) {
            console.error('Unable to get Travis CI public key. Aborting.');
        }
    }).then(function(key) {
        runServer(key)
    })

function runServer(pubKey) {
    var handler = createHandler({ path: '/webhook', public_key: pubKey })

    handler.on('error', function (err) {
        console.error('Error:', err.message)
    })

    handler.on('success', function (event) {
        console.log('Build %s success for %s branch %s',
        event.payload.number,
        event.payload.repository.name,
        event.payload.branch)
    })

    handler.on('failure', function (event) {
        console.log('Build failed!')
    })

    handler.on('start', function (event) {
        console.log('Build started!')
    })

    http.createServer(function (req, res) {
      handler(req, res, function (err) {
        res.statusCode = 404
        res.end('no such location')
      })
    }).listen(PORT)
}

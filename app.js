let express = require('express')
let path = require('path')
let favicon = require('static-favicon')
let logger = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let fileUpload = require('express-fileupload')
let cors = require('cors')

let app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(favicon())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())

app.use(fileUpload())

app.get('/', (req, res) =>{
  res.status(200).json({"Proyecto":"Servicios", "msg":"File Service"})
})

// Upload Endpoint
app.post('/upload', (req, res) => {
    if (req.files === null || !req.files) {
      return res.status(400).json({ msg: 'No file uploaded' })
    }

    const file = req.files.file
    
    file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
      if (err) {
        console.error(err)
        return res.status(500).send(err)
      }
  
      return res.status(200).json({ fileName: file.name })
    })
})

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})


module.exports = app

'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const { connect } = require('./database')
const routes = require('./routes/')

const app = express()

const port = process.env.PORT || 3000
app.set('port', port)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: false
}))

app.set('view engine', 'pug')

app.use(routes)

connect()
	.then(() => {
		app.listen(port, () => {
			console.log(`Express server listening on port ${port}`)
		})
	})
	.catch(console.error)
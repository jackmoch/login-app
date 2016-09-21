'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const { connect } = require('./database')
const routes = require('./routes/')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const app = express()

const port = process.env.PORT || 3000
app.set('port', port)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: false
}))

app.set('view engine', 'pug')

app.use(session({
	store: new RedisStore(),
	secret: 'superSecretKey'
}))

app.use((req, res, next) => {
	app.locals.email = req.session.email
	next()
})

app.use(routes)

connect()
	.then(() => {
		app.listen(port, () => {
			console.log(`Express server listening on port ${port}`)
		})
	})
	.catch(console.error)
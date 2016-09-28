'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const { connect } = require('./database')
const routes = require('./routes/')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const passport = require('passport')

const app = express()

const port = process.env.PORT || 3000
app.set('port', port)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: false
}))

require('./passport-strategies')
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'pug')

app.use(session({
	store: new RedisStore({
		url: process.env.REDIS_URL || 'redis://localhost:6379'
	}),
	secret: 'superSecretKey'
}))

app.use((req, res, next) => {
	app.locals.email = req.session.email
	next()
})

app.use(routes)

app.use((
    err,
    { method, url, headers: { 'user-agent': agent } },
    res,
    next
  ) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendStatus(err.status || 500)
  } else {
    res.set('Content-Type', 'text/plain').send(err.stack)
  }

  const timeStamp = new Date()
  const statusCode = res.statusCode
  const statusMessage = res.statusMessage

  console.error(
    `[${timeStamp}] "${red(`${method} ${url}`)}" Error (${statusCode}): "${statusMessage}"`
  )
  console.error(err.stack)
})

connect()
	.then(() => {
		app.listen(port, () => {
			console.log(`Express server listening on port ${port}`)
		})
	})
	.catch(console.error)
const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const router = Router()

router.get('/', (req, res) => {
	res.render('home')
})

router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/register', (req, res) => {
	res.render('register')
})

router.post('/login', ({ session, body: { email, password } }, res, err) => {
	User
		.findOne({email})
		.then(user => {
			if(user) {
				return new Promise((resolve, reject) => {
					bcrypt.compare(password, user.password, (err, matches) => {
						if(err) {
							reject(err)
						} else {
							resolve(matches)
						}
					})
				})
			} else {
				res.render('login', { msg: 'Email does not exist in our system' })
			}
		})
		.then(matches => {
			if(matches) {
				session.email = email
				res.redirect('/')
			} else {
				res.render('/login', { msg: 'Password does not match' } )
			}
		})
})

router.post('/register', ({ body: { email, password } }, res, err) => {
	User
		.findOne({email})
		.then(user => {
			if (user) {
				res.render('register', { msg: 'Email is already registered' })
			} else {
				return new Promise((resolve, reject) => {
					bcrypt.hash(password, 15, (err, hash) => {
						if (err) {
							reject(err)
						} else {
							resolve(hash)
						}
					})
				})
			}
		})
		.then(hash => {
			User
				.create({
					email,
					password: hash
				})
		})
		.then(() => res.redirect('/login'))
		.catch(err)
})

module.exports = router
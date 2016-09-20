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

router.post('/register', ({ body: { email, password } }, res, err) => {
	User
		.findOne({email})
		.then(user => {
			if (user) {
				console.log(user)
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
const { Router } = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

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

// router.post('/login', ({ session, body: { email, password } }, res, err) => {
// 	User
// 		.findOne({email})
// 		.then(user => {
// 			if(user) {
// 				return new Promise((resolve, reject) => {
// 					bcrypt.compare(password, user.password, (err, matches) => {
// 						if(err) {
// 							reject(err)
// 						} else {
// 							resolve(matches)
// 						}
// 					})
// 				})
// 			} else {
// 				res.render('login', { msg: 'Email does not exist in our system' })
// 			}
// 		})
// 		.then(matches => {
// 			if(matches) {
// 				session.email = email
// 				res.redirect('/')
// 			} else {
// 				res.render('/login', { msg: 'Password does not match' } )
// 			}
// 		})
// })

router.post('/login', (req, res ,next) => {
	console.log('post route fired')
	passport.authenticate('local', (err, user, msg) => {
	    if (err) { return next(err) }
	    if (!user) { return res.render('login', msg) }

	    req.logIn(user, err => {
	      if (err) { return next(err) }
	      res.redirect('/')
	    })
	  })
	// passport.authenticate('local', (err, user, msg) => {
	// 	console.log('inside authenticate')
	// 	if(err) { return next(err) }
	// 	if(!user) { return res.render('login')}

	// 	req.logIn(user, err => {
	// 		console.log('inside login')
	// 		if(err) {return next(err)}
	// 		res.redirect('/')
	// 	})
	// })
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

router.post('/', (req, res) => {
	req.session.destroy((err) => {
		if(err) throw err
		res.redirect('/login')
	})
})

module.exports = router
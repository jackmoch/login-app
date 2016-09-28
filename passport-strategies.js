'use strict'

const passport = require('passport')
const { Strategy } = require('passport-local')
const bcrypt = require('bcrypt')

const User = require('./models/user')

passport.serializeUser((user, cb) => cb(null, user.id))
passport.deserializeUser((_id, cb) => User.findOne({ _id }, cb))

console.log('Have I been required?')

const localStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (user, password, cb) => {
    console.log('inside Strategy')
    // User.findOne({user})
    //   .then(dbUser => {
    //     console.log('inside user')
    //     if (dbUser) {
    //       return Promise.all([
    //         dbUser,
    //         comparePassword(password, dbUser),
    //       ])
    //     }
    //     cb(null, null, { msg: 'User does not exist in our system' })
    //   })
    //   .then(([dbUser, matches]) => {
    //     if (matches) {
    //       cb(null, dbUser, { msg: 'Successfully logged in' })
    //     } else {
    //       cb(null, null, { msg: 'Password does not match' })
    //     }
    //   })
    //   .catch(cb)
    }
)

let comparePassword = function(password, dbUser) {
  return new Promise((resovle, reject) => {
    dbUser.bcrypt.compare(password, dbUser.password, (matches) => {
      if(matches) {
        resovle(matches)
      } else {
        reject()
      }
    })
  })
}

passport.use(localStrategy)
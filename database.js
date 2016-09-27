'use strict';

const mongoose = require('mongoose')

const MONGODB_URL = 'mongodb://jackmoch:1234@ds041486.mlab.com:41486/login-jackmoch' || 'mongodb://localhost:27017/login'

mongoose.Promise = Promise

module.exports.connect = () => mongoose.connect(MONGODB_URL)
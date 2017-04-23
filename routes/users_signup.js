'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const Joi = require('joi');
const bcrypt = require('bcrypt-as-promised');
const jwt = require('jsonwebtoken');

function usersSignup(req, res) {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.send({ status: 400, errorMessage: 'Email must not be blank' });
  }

  if (!password || password.length < 8) {
    return res.send({ status: 400, errorMessage: 'Password must be at least 8 characters long' });
  }

  knex('users')
    .where('email', email)
    .first()
    .then((user) => {
      const valid = Joi.validate(email, Joi.string().email());
      if (user) {
        res.send({ status: 400, ErrorMessage: 'Email already exists' });
      } else if (valid.error) {
        res.send({ status: 400, ErrorMessage: 'Improper email format' });
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashed_password) => {
      const { first_name, last_name } = req.body;
      const newUser = { first_name, last_name, email, hashed_password };

      return knex('users').insert(newUser, '*');
    })
    .then((users) => {
      const user = users[0];
      const claim = { userId: user.id };
      const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '7 days'
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),  // 7 days
        secure: router.get('env') === 'production'
      });

      delete user.hashed_password;

      res.send(user);
    })
    .catch((err) => {
      res.send({ status: 400, ErrorMessage: err });
    });
}

module.exports = usersSignup;
const express = require('express');
const Router = require('express').Router();
const { connectDB, User } = require('../config/db');
const { getGoals, setGoals, deleteGoals, putGoals } = require('./controllers/getControllers');



Router.get('/', getGoals);

Router.get('/friends/:id', (req, res) => {
      const telegramChatId = req.params.id;
      console.log(telegramChatId)
      User.find({ telegramChatId }, (err, data) => {
            console.log(data)
            if (err) {
                  console.log(err);
            } else {
                  res.send(data);
            }
      });
})

Router.post('/', setGoals);
      
Router.delete('/:id', deleteGoals);

Router.put('/:id', putGoals);


module.exports = Router;
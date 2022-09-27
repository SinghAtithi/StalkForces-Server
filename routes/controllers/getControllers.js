const { connectDB, User } = require('../../config/db');


const getGoals = (req, res) => {
      res.send('Hello get!');
}

const setGoals = async (req, res) => {
      req.body.userName = req.body.userName.toLowerCase();
      const user = new User(req.body);
      const userName = req.body.userName;
      const userExists = await User.findOne({ userName, telegramChatId: req.body.telegramChatId });
      console.log(req.body);
      if (userExists) {
            return res.status(400).send('User already exists');
      }
      try {
            console.log("step 2");

            await user.save();
            res.status(200).send(user);
      } catch (error) {
            res.status(500).send(error);
      }
}

const deleteGoals = (req, res) => {
      res.send(`Hello delete! ${req.params.id}`);
}

const putGoals = (req, res) => {
      res.send(`Hello put! ${req.params.id}`);
}

module.exports = {
      getGoals, setGoals, deleteGoals, putGoals
}

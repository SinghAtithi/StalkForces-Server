const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { Telegraf } = require("telegraf");
const app = express();
const { connectDB, User } = require("./config/db");
const dotenv = require("dotenv").config();
const { connect } = require("./routes/getRoutes");
app.use(cors());

process.on('uncaughtException', function (err) {
      // console.error(err);
      console.log("Node NOT Exiting...");
});

const PORT = process.env.PORT || 4500;

connectDB();

const bot = new Telegraf("5501445748:AAFmGuVsWo7AELwSB_ElGjBuwyoLdE-Ui1M");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware

app.use("", require("./routes/getRoutes"));

app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
});

bot.start((ctx) =>
      ctx.reply(
            "Hello there!\nI am StalkForces Bot.I can help you to get the information about the users of Codeforces.\n\nType / help to get the list of commands"
      )
);
bot.on("sticker", (ctx) => ctx.reply("👍"));

bot.hears("Hi", (ctx) =>
      ctx.reply(
            "Hello there!\nI am StalkForces Bot. I can help you to get the information about the users of Codeforces. \n\nType /help to get the list of commands"
      )
);

bot.hears("/help", (ctx) =>
      ctx.reply(
            "Here are the list of commands\n\n/users - to get the list of users\n\n/addUser - to add a user\n\n/deleteUser - to delete a user\n\n/getDetails {userName} to get details of a user"
      )
);

bot.hears("/myChatId", (ctx) => {
      ctx.reply(ctx.chat.id);
});

bot.launch();

bot.hears("/users" || "users", (ctx) => {
      let users = ""
      User.find({}, (err, data) => {
            if (err) {
                  console.log(err);
            } else {
                  data.forEach((user) => {
                        if (user.telegramChatId == ctx.message.chat.id) {
                              users += user.userName + "\n";
                        }
                  });
            }
            ctx.reply(users);
      });
});

bot.hears("/addUser", (ctx) => {
      ctx.reply("Enter the username").then(() => {
            bot.on("message", (msg) => {
                  let userName = msg.update.message.text;
                  userName = userName.toLowerCase();
                  const chatId = ctx.message.chat.id;
                  const user = new User({ userName: userName, telegramChatId: chatId });
                  // add user only if user with same userName and chatId is not present
                  User.find({ userName: userName, telegramChatId: chatId }, async (err, data) => {
                        if (err) {
                              console.log(err);
                        } else {
                              if (data.length == 0) {
                                    user.save();
                                    bot.telegram.sendMessage(chatId, "User added successfully");
                                    return;
                              }
                        }
                        bot.telegram.sendMessage(chatId, "User already added");
                  });
            });
      });
})

setInterval(function () { FetchData(); }, 10000);

function FetchData() {
      bot.telegram.sendMessage(2103842476, "--------------------------------")

      User.find({}, (err, data) => {
            if (err) {
                  console.log(err);
            } else {
                  data.forEach((user) => {
                        let userName = user.userName;
                        axios
                              .get(
                                    `https://codeforces.com/api/user.status?handle=${userName}&from=1&count=1`
                              )
                              .then((res) => {
                                    if (res.data.status != "OK") return;
                                    let creationTimeSeconds = res.data.result[0].creationTimeSeconds;
                                    let currTime = Math.floor(Date.now() / 1000);
                                    let diff = currTime - creationTimeSeconds;
                                    bot.telegram.sendMessage(2103842476, diff + " " + userName)
                                    if (diff <= 8) {
                                          if (user.telegramChatId == "6969696969") return;
                                          bot.telegram.sendMessage(
                                                user.telegramChatId,
                                                `${userName} has submitted a solution
                                                      \nhttps://codeforces.com/contest/${res.data.result[0].contestId}/submission/${res.data.result[0].id}
                                                \nName: ${res.data.result[0].problem.name}
                                                \nVerdict: ${res.data.result[0].verdict}
                                                \nRating: ${res.data.result[0].problem.rating}
                                                \nTags: ${res.data.result[0].problem.tags}
                                                `
                                          );
                                    }
                              });
                  });
            }
      });
}

FetchData();

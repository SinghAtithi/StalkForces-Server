const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Schema } = mongoose;

const connectDB = async () => {
      try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
            console.log(error);
      }
};

const schema = new Schema({
      userName: {
            type: String,
            required: true,
      },
      telegramChatId: {
            type: String,
            required: true,
            default: 6969696969,
      },
      profilePic: {
            type: String,
            required: true,
      },
      maxRating: {
            type: Number,
            required: true,
      },
      currRating: {
            type: Number,
            required: true,
      },
      maxRank: {
            type: String,
            required: true,
      },
});

const User = mongoose.model("User", schema);

module.exports = { connectDB, User };

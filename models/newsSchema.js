const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  content: String,
  img_URL: String,
  date: String,
  author: String,
  highlight: false,
});
const NewsModel = mongoose.model("news", newsSchema);

module.exports = NewsModel;

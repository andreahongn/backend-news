const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, min: 5 },
  category: { type: String, required: true, min: 3, max: 20 },
  description: String,
  content: { type: String, required: true },
  img_URL: { type: String, required: true },
  date: String,
  author: String,
  highlight: Boolean,
});
const NewsModel = mongoose.model("news", newsSchema);

module.exports = NewsModel;

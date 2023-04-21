const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true, min: 5 },
  category: { type: String, required: true, min: 3, max: 20 },
  description: String,
  content: { type: String, required: true },
  img_URL: { type: String, required: true },
  avatar_URL: {
    type: String,
    default:
      "https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png",
  },
  date: String,
  author: String,
  highlight: { type: Boolean, default: false },
});
newsSchema.plugin(mongoosePagination);
const NewsModel = mongoose.model("news", newsSchema);

module.exports = NewsModel;

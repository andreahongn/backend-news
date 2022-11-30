const express = require("express");

const router = express();
const { validationResult } = require("express-validator");
const NewsModel = require("../models/newsSchema");

const { body } = require("express-validator");

router
  .post("/load", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      URL_img,
      description,
      date,
      category,
      author,
      content,
      highlight,
    } = req.body;
    const existsNews = await NewsModel.findOne({ title: req.body.title });
    console.log("existsNews", existsNews);

    if (existsNews) {
      res.status(400).json({ msg: "noticia duplicada" });
    }
    try {
      const news1 = new NewsModel(req.body);
      news1.save();
      res.send("ok");
    } catch (error) {
      res.status(500).json({ msg: "ERROR", error });
      console.log("loadRoute", error);
    }
  })

  .get("/newslist", async (req, res) => {
    const noticias = await NewsModel.find();
    res.send(noticias);
  })
  .put("/editnews/:id", async (req, res) => {
    const noticiaEditada = await NewsModel.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title },
      { new: true }
    );
    res.send(noticiaEditada);
  })
  .delete("/deletenews/:id", async (req, res) => {
    try {
      await NewsModel.findOneAndDelete({ _id: req.params.id });
      res.send("Noticia Eliminada");
    } catch (error) {
      console.log("error", error);
    }
  });

module.exports = router;

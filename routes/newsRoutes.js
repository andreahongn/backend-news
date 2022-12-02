const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const NewsModel = require("../models/newsSchema");

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

  .get("/news", async (req, res) => {
    try {
      const allnews = await NewsModel.find();
      res.status(200).send(allnews);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })

  .get("/news/:id", async (req, res) => {
    try {
      // const { id } = req.params;
      const news = await NewsModel.findOne({ _id: req.params.id });
      res.status(200).json(news);
    } catch (error) {
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  })

  .put("/editnews/:id", async (req, res) => {
    const { body } = req;
    try {
      const noticiaEditada = await NewsModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: body.title,
          category: body.category,
          description: body.descrption,
          content: body.content,
          author: body.author,
          date: body.date,
          img_URL: body.img_URL,
          highlight: body.highlight,
        },
        { new: true }
      );
      res.status(200).json(noticiaEditada);
      res.send(noticiaEditada);
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  })

  .delete("/deletenews/:id", async (req, res) => {
    try {
      await NewsModel.findOneAndDelete({ _id: req.params.id });

      res.send("Noticia Eliminada");
    } catch (error) {
      console.log(error);
      res.status(404).json({
        error: true,
        message: error,
      });
    }
  });

module.exports = router;

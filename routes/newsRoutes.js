const router = require("express").Router();
const { body, validationResult, query } = require("express-validator");
const NewsModel = require("../models/newsSchema");

const tokenValidation = require("./tokenValidation");

router
  .post("/load", tokenValidation(process.env.SUPER_USER), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      img_URL,
      description,
      date,
      category,
      author,
      content,
      highlight,
      avatar_URL,
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
  .get(
    "/search",
    tokenValidation([process.env.SUPER_USER, "user"]),
    async (req, res) => {
      try {
        const characters = req.query.characters;
        const news = await NewsModel.find();

        const newsFilter = news.filter((element) => {
          if (
            element.title
              .toUpperCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(characters.toUpperCase()) ||
            element.category
              .toUpperCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(characters.toUpperCase()) ||
            element.description
              .toUpperCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(characters.toUpperCase())
          ) {
            return element;
          }
        });

        res.status(200).send(newsFilter);
      } catch (error) {
        res.status(400).json({ error: true, message: error });
      }
    }
  )
  .get("/highlight", async (req, res) => {
    try {
      const queryHighlight = req.query.highlight;
      const highlight = await NewsModel.find({ highlight: queryHighlight });
      res.status(200).send(highlight);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })

  .get(
    "/news/:id",
    tokenValidation([process.env.SUPER_USER, "user"]),
    async (req, res) => {
      try {
        const news = await NewsModel.findOne({ _id: req.params.id });
        res.status(200).json(news);
      } catch (error) {
        res.status(404).json({
          error: true,
          message: error,
        });
      }
    }
  )
  .get(
    "/category/:category",
    tokenValidation([process.env.SUPER_USER, "user"]),
    async (req, res) => {
      try {
        const news = await NewsModel.find({
          category: req.params.category.replace("-", " "),
        });
        res.status(200).json(news);
      } catch (error) {
        res.status(404).json({
          error: true,
          message: error,
        });
      }
    }
  )

  .put(
    "/editnews/:id",
    tokenValidation(process.env.SUPER_USER),
    async (req, res) => {
      const { body } = req;
      const errorsNews = [];

      const fieldValues = [
        { name: "title", value: body.title },
        { name: "description", value: body.description },
        { name: "author", value: body.author },
        { name: "content", value: body.content },
        { name: "image", value: body.img_URL },
        { name: "category", value: body.category },
      ];

      const validateField = (value, name) => {
        let error;
        if (value.trim() === "") {
          error = `field  ${name} empty`;
        } else if (value.trim().length < 3) {
          error = `The field ${name} must have at least 3 characters`;
        } else {
          error = true;
        }
        return error;
      };

      fieldValues.forEach((element) => {
        if (validateField(element.value, element.name) !== true) {
          errorsNews.push(validateField(element.value, element.name));
        }
      });

      if (
        (body.title.trim() === "",
        body.category.trim() === "",
        body.description.trim() === "",
        body.content.trim() === "",
        body.author.trim() === "",
        body.img_URL.trim() === "")
      ) {
        return res.status(400).json({
          error: true,
          message: "All the fields are empty",
        });
      }

      if (errorsNews.length > 0) {
        return res.status(400).json({
          error: true,
          message: errorsNews.join("; "),
        });
      }

      try {
        const noticiaEditada = await NewsModel.findOneAndUpdate(
          { _id: req.params.id },
          {
            title: body.title,
            category: body.category,
            description: body.description,
            content: body.content,
            author: body.author,
            date: body.date,
            img_URL: body.img_URL,
            avatar_URL: body.avatar_URL,
            highlight: body.highlight,
          },
          { new: true }
        );
        res.status(200).json(noticiaEditada);
      } catch (error) {
        console.log(error);
        res.status(404).json({
          error: true,
          message: error,
        });
      }
    }
  )

  .delete(
    "/deletenews/:id",
    tokenValidation(process.env.SUPER_USER),
    async (req, res) => {
      try {
        const noticiaEliminada = await NewsModel.findOneAndDelete({
          _id: req.params.id,
        });

        res.status(200).json(noticiaEliminada);
      } catch (error) {
        console.log(error);
        res.status(404).json({
          error: true,
          message: error,
        });
      }
    }
  );

module.exports = router;

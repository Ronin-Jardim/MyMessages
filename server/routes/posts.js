
const express = require("express");
const multer = require("multer");

const Post = require("../models-back/post");

const router = express.Router();

// ALLOWING FILE TYPES

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

// STORING FILE UPLOADS

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "server/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

// ADDING POST ROUTE

router.post(
  "/add",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

// UPDATING POST ROUTE

router.put(
  "/update/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

// GETTING ALL POSTS ROUTE

router.get("", (req, res, next) => {
const pageSize = +req.query.pagesize;
const currentPage = +req.query.page;
const postQuery = Post.find();
let fetchedPosts;
if(pageSize && currentPage) {
postQuery
.skip(pageSize * (currentPage - 1))
.limit(pageSize);
}
  postQuery
  .then(documents => {
    fetchedPosts = documents;
return Post.countDocuments();
   
    }).then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
    });
  });
});

// GETTING POST BY ID ROUTE

router.get("/update/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

// DELETING POST BY ID ROUTE

router.delete("/delete/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
   
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;

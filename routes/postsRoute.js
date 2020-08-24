const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload");
const auth = require("../middlewares/authorization");
const PostsController = require("../controllers/postsController");

router.get("/search", PostsController.search);
router.get("/user-posts/:userId", PostsController.getUserPosts);

router.get("/", PostsController.getAll);
router.get("/:postId", PostsController.getOne);

router.post("/", auth, upload.array("images", 5), PostsController.create);
router.put("/:postId", auth, upload.array("images", 5), PostsController.update);
router.patch("/:postId", auth, PostsController.likes);
router.delete("/:postId", auth, PostsController.delete);

module.exports = router;

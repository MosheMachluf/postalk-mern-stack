const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authorization");
const CommentsController = require("../controllers/commentsController");

router.get("/:postId", CommentsController.getCommentsOfPost);
router.post("/:postId", auth, CommentsController.create);
router.patch("/:postId/:commentId", auth, CommentsController.update);
router.delete("/:postId/:commentId", auth, CommentsController.delete);

module.exports = router;

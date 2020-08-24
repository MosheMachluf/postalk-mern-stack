const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authorization");
const UsersController = require("../controllers/usersController");
const { upload } = require("../middlewares/upload");

router.get("/profile/:userId", UsersController.profile);
router.get("/saved-posts", auth, UsersController.getSavedPosts);

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);

router.patch("/logout", auth, UsersController.logout);
router.patch("/save-post", auth, UsersController.savePost);

router.put("/profile", auth, UsersController.edit);
router.patch(
  "/profile/avatar/:userId",
  auth,
  upload.single("avatar"),
  UsersController.updateAvatar
);
router.delete("/", auth, UsersController.delete);

module.exports = router;

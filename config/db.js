const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/social-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connection to MongoDB successful!"))
  .catch(console.log);

module.exports = mongoose;

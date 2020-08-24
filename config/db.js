const mongoose = require("mongoose");
// `mongodb://localhost:27017/social-api`
mongoose
  .connect(
    process.env.MONGO_URI ||
      `mongodb+srv://moshemachluf:wy4P6WGEN8ivMi2@postalk-api.cqdvs.mongodb.net/postalk-api?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("Connection to MongoDB successful!"))
  .catch(console.log);

module.exports = mongoose;

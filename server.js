
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan')
const app = require("./app");

app.use(morgan('dev'));
dotenv.config({ path: './config.env' });

const database = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.set("strictQuery", false);
mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log('Database Connected');
})

const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`app runing on port ${port}`);
})
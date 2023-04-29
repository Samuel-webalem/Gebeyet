const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./model/productmodel');
const User = require('./model/usermodel');
// const Review = require('./models/reviewmodel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected mongoose");
  });

// const reviews = JSON.parse(
//   fs.readFileSync('./dev-data/data/reviews.json', 'utf-8')
// );

const products = JSON.parse(
  fs.readFileSync('products.json', 'utf-8')
);


// const users = JSON.parse(
//   fs.readFileSync('./dev-data/data/users.json', 'utf-8')
// );


const imoporttour = async () => {
    try {
      console.log('importing...')
    await Product.create(products, {
      validateBeforeSave:false
    });
    // await Review.create(reviews);
    // await User.create(users, {
    //   validateBeforeSave:false
    // });
    console.log('data succuessfully imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const deleteall = async () => {
  try {
    await Product.deleteMany();
    //  await Review.deleteMany();
      // await User.deleteMany();
    console.log('data succuess fully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
console.log(process.argv[2]);

if (process.argv[2] === '--import') {
  imoporttour();
} else if (process.argv[2] === '--delete') {
  deleteall();
}

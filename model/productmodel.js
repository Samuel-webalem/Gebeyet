const mongoose = require('mongoose');
const slugify= require('slugify')

const productSchemea = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please insert product title"],
    maxlength: [25, 'The product title have must equal or less than to 25 character'],
  },
  price: {
    type: Number,
    required: [true, "Please insert product price"],
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: String,
    required: [true, "Please insert product category"],
  },
  brand: {
    type: String,
    required:[true,"please insert brand name"]
  },
  description: {
    type: String,
  },
  slug:String
});

productSchemea.pre('save', function (next){
  this.slug = slugify(this.title, { lower: true });
  next();
})



const product = mongoose.model('product', productSchemea);

module.exports = product;
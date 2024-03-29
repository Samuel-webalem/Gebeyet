const mongoose = require('mongoose');
const slugify = require('slugify')

const { Schema } = mongoose;
const productSchemea = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please insert product title"],
      maxlength: [
        25,
        "The product title have must equal or less than to 25 character",
      ],
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
    rating: Number,
    thumbnail: {
      type: String,
      required: [true, "Please insert product category"],
    },
    category: {
      type: String,
      required: [true, "Please insert product category"],
    },
    brand: {
      type: String,
      required: [true, "please insert brand name"],
    },
    description: {
      type: String,
    },
    stock: Number,
    seller: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    discountPercentage: Number,
    slug: String,
    review: {
      type: mongoose.Schema.ObjectId,
      ref:'Review'
    }
  },
  
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchemea.pre('save', function (next){
  this.slug = slugify(this.title, { lower: true });
  next();
})

productSchemea.virtual("Review", {
  ref: "Review",
  foreignField: "product",
  localField:'_id'
});
productSchemea.pre(/^find/, function (next) {
  this.populate({
    path: "seller",
    select: "name phonenumber email",
  });
  next();
});



// productSchemea.pre('save', async function (next) {
//   const sellerpromis = this.seller.map(async id=>await User.findById(id));
//   this.seller =await Promise.all(sellerpromis)
//   next()
// })

const product = mongoose.model('product', productSchemea);

module.exports = product;
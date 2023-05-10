const mongoose = require('mongoose');

const reviewschema = new mongoose.Schema({
    review: {
        type: String,
        require: [true, 'Review can not be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max:5
    },
    createdAt: {
        type: Date,
        default:Date.now
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'product',
        require:[true, 'Review must belong to a product']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require:[true, 'Review must belong to a product']
}
},
    {
        toJSON: { virtuals: true },
        toObject:{virtuals:true}
    }
)

reviewschema.pre(/^find/, function (next) {
    this.populate({
      path: "product",
      select: "title",
    }).populate({
      path: "user",
      select: "name image",
    });
    next();
})

const Review = mongoose.model('Review', reviewschema);

module.exports = Review;

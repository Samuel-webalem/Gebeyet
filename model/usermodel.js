const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')
const crypto  = require('crypto')

const userschema = Schema({
  name: {
    type: String,
    required: [true, "Please provide user name"],
    validate: [validator.isAlpha, "name must contain only character"],
  },
  phonenumber: {
    type: Number,
    required: [true, "Please provide phone number"],
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  password: {
    type: String,
    minlength: [
      8,
      "The product title have must equal or greater than 8 character",
    ],
    required: [true, "Please provide password"],
    select:false
  },
  passwordConfirmation: {
    type: String,
    required: [true, "Please provide confirmation password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password and cornfirmation password are not the same",
    },
    select:false
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Please provide email"],
    validate: [validator.isEmail, "please insert a valid email"],
  },
  role: {
    type: String,
    enum: ['user', 'saler', 'admin'],
    default:'user'
  },
  active: {
    type: Boolean,
    default: true,
    select:false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires:String
});

userschema.pre(/^find/, async function (next) {
  
  this.find({ active: { $ne: false } });
  next();
})

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;
  next();
});
userschema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
})
userschema.methods.correctPassword = (newpassword, oldpassword) => {
  return bcrypt.compare(oldpassword,newpassword)
}

userschema.methods.changedPassword = (jwttimestamp)=>{
  if (this.passwordChangedAt) {
    const changedAtStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return jwttimestamp < changedAtStamp;
  }
  return false;
}

userschema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
}

const User = model("User", userschema);

module.exports = User;

const Product = require("../model/productmodel");
const APIFeatures = require('../util/apiFeatures')

exports.getproduct = async (req, res,next) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .filter()
      .limitFileds()
      .paginate()
      .sort();

    
    const products = await features.query;

    res.status(200).json({
      status: "success",
      result: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};
exports.getsingleproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    console.log(product)
     res.status(200).json({
       status: "succuess",
       data: {
          product
        }
     });
  } catch (error) {
     res.status(404).json({
       status: "failed",
       message: error,
     });
  }
}
exports.createproduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: "succuess",
      requested: req.reqtime,
      data: {
        newProduct,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

exports.updateproduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "succuess",
      requested: req.reqtime,
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

exports.deleteproduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    console.log(req.param.id);
    res.status(200).json({
      status: "succuess",
      requested: req.reqtime,
    });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
};

exports.proudctStatus = async (req, res) => {
  try {
    const status = await Product.aggregate([
      {
        $match: { price: { $gte: 1 } },
      },
      {
        $group: {
          _id: { $toUpper: "$category" },
          sum: { $sum: 1 },
          avg_price: { $avg: '$price' },
          min_price: { $min: '$price' },
          max_price:{$max:'$price'}
        },
      },
    ]);
     res.status(200).json({
       status: "succuess",
       requested: req.reqtime,
       data: {
         status
       }
     });
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: error,
    });
  }
}
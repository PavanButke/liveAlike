const express =  require("express");
const asyncHandler =  require("express-async-handler");
const Product =  require("./../Models/productModel");


const productRoute = express.Router();

//GET ALL PRODUCTS
productRoute.get(
    "/",
    asyncHandler(async (req, res) => {
        const pageSize = 3;
        const page = Number(req.query.pagenumber) || 1;
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            }
            : {};
        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1)).sort({ _id: -1 });
        reson({ products, page, pages: Math.ceil(count / pageSize) });
    })
);

//ONE PRODUCT AT A TIME
productRoute.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            reson(product);
        } else {
            res.status(404);
            throw new Error("Product not Found");
        }
    })
);

module.exports = productRoute;

//export default productRoute;
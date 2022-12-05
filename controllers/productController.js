const Product = require('../models/product');
const { StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');
// const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils')

const createProduct = async (req, res) => {
    console.log(req.body)
   
    req.body.user = req.user.userId;
    console.log(req.body.user);
    const product = await Product.create(req.body);
    console.log(Product)
    res.status(StatusCodes.CREATED).json({product})

}
const getAllProducts = async (req, res) => {
    const products = await Product.find({});

    res.status(StatusCodes.OK).json({products, count: products.length});

}
const getSingleProduct = async (req, res) => {
    const { id: productId} = req.params;
    const product = await Product.findOne({ _id: productId }).populate('reviews')
    if(!product){
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }
        res.status(StatusCodes.OK).json({product});
}
const updateProduct = async (req, res) => {
    const { id: productId} = req.params;

    const product = await Product.findByIdAndUpdate({_id: productId}, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
}
const deleteProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId })

    if (!product) {
        throw new CustomError.NotFoundError(`No product with id: ${productId}`);
    }
await product.remove()

    res.status(StatusCodes.OK).json({ msg: 'Success! Product Removed'});
}
const uploadImage = async (req, res) => {
    if(!req.files){
        throw new CustomError.BadRequestError('No File Uploads')
    }
    const productImage = req.files.image
    if(!productImage.mimetype.startsWith('image')){
throw new CustomError.BadRequestError('Please Upload Image')
    }

const maxSize =1024 * 1024;

if (productImage.size > maxSize){
    throw new CustomError.BadRequestError('Please uploads images smaller than 1MB')
}

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({image: `/uploads/${productImage.name}`})
}
module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage };
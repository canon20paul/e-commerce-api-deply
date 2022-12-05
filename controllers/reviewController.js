const Review = require('../models/review');
const Product = require('../models/product')

const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors')
const{checkPermissions} = require('../utils');


const createReview = async (req, res) => {
    const{product: productId} = req.body;

    req.body.user = req.user.userId
    

    const isValidproduct = await Product.findOne({_id: productId});
    if(!isValidproduct){
        throw new CustomError.NotFoundError(`No Product with id : ${productId}`);
    }

    const alreadySubmitted = await Review.findOne({product: productId, user: req.user.userId})
    if (alreadySubmitted){
        throw new CustomError.BadRequestError('Already submitted review for this Product')
    }
    const review = await Review.create(req.body);

    res.status(StatusCodes.OK).json({review});
};
const getAllReviews = async (req, res) => {

    const review = await Review.find({}).populate({
        path: 'product',
        select: 'name company price',
    })
        .populate({
            path: 'user',
            select: 'name ',
        })
    res.status(StatusCodes.OK).json({review,count: review.length})
};
const getSingleReview = async (req, res) => {
    const {id:reviewId} = req.params;
    const review = await Review.findOne({_id: reviewId})

    if(!review){
        throw new CustomError.BadRequestError(`No review with id ${reviewId}`)
    }

    res.status(StatusCodes.OK).json(review)
};
const updateReview = async (req, res) => {

    const { id: reviewId } = req.params;
    const{rating, title, comment} = req.body
    const review = await Review.findOne({ _id: reviewId })

    if (!review) {
        throw new CustomError.BadRequestError(`No review with id ${reviewId}`)
    }
    checkPermissions(req.user, review.user)
    review.rating = rating;
    review.title = title;
    review.comment = comment
    await review.save()

    res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review.findOne({ _id: reviewId })

    if (!review) {
        throw new CustomError.BadRequestError(`No review with id ${reviewId}`)
    }
    // checkPermissions(req.user, review.user)
    // review.rating = ratings;
    // review.title = title;
    // review.comment = comment

    await review.remove()

    res.status(StatusCodes.OK).json({msg: 'Success, review deleted'});
};
 const getSingleProductReviews = async (req, res) => {
    const {id: productId} = req.params;
    console.log(req.body)
    const reviews = await Review.find({product: productId});
    res.status(StatusCodes.OK).json({reviews, count: reviews.length});
 };

module.exports = { createReview, getAllReviews, getSingleReview, updateReview, deleteReview, getSingleProductReviews }

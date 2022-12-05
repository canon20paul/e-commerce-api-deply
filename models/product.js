const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please provide product name'],
        maxlength: [100, 'Name can not be more than 100 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        default: 0,
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    role: {
        type: String,
        enum: ['admin','user'],
        default: 'user',
    },
    image: {
        type: String,
        default: '/uploads/example.jpeg',
    },
    category: {
            type: String,
            required: [true, 'Please provide product category'],
            enum: ['office','kitchen','bedroom'],
    },
    company: {
        type: String,
        required: [true, 'Please Provide Company'],
        enum: {
            values: ['ikea','liddy','marcos'],
            message: '{VALUE} is not supported',
        },
    },
    colors: {
        type: [String],
        default: ['#222'],
        required: true
    },
    featured: {
        type: Boolean,
        required: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventoryl: {
        type: Number,
         required: true,
         default: 15,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},  { timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true} }
);
ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});
// Usedd to also delete reviews ASSOCIATED with the product being DELETED
ProductSchema.pre('remove', async function(next){
    await this.model('Review').deleteMany({product: this._id});
});

module.exports=mongoose.model('Product', ProductSchema);



// UserSchema.pre('save', async function() {
//     // console.log(this.modifiedPaths());
//     // console.log(this.isModified('name'));
//     if(!this.isModified('password')) return;
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// })
// UserSchema.methods.comparePassword = async function(candidatePassword){
//     const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     return isMatch
// }
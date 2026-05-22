const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems:[
        {
            name: String,
            qty: Number,
            price: Number,
            image: String,
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }
        },
    ],
    shippingAddress:{
        address: String,
        city: String,
        postalCode: String,
        country: String,
    },
    paymentMethod: {type: String, required: true},
    itemsPrice: {type: Number, default: 0},
    taxPrice: {type: Number, default: 0},
    shippingPrice: {type: Number, default: 0},
    totalPrice: {type: Number, default: 0},
    isPaid: {type: Boolean, default: false},
    paidAt: Date,
    isDelivered: {type: Boolean, default: false},
    deliveredAt: Date,
    status: {type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing'},
}, { timestamps: true }
);
module.exports=mongoose.model('Order', orderSchema);
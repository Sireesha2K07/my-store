const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const morgan=require('morgan');
require('dotenv').config();
const connectDB=require('./src/config/db');
const authRoutes=require('./src/routes/authRoutes');
const productRoutes=require('./src/routes/productRoutes');
const orderRoutes=require('./src/routes/orderRoutes');
const app=express();
connectDB();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.get('/',(req,res)=>{
    res.json({message:' Store API is running'});
});
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
const express =  require("express");
const asyncHandler =  require("express-async-handler");
const protect =  require('./../Middleware/AuthMiddleware');
const Order =  require('./../Models/orderModel');

const orderRouter = express.Router();



// LOGIN
orderRouter.post(
    "/",
    protect,
    asyncHandler(async (req, res) => {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if(orderItems && orderItems.length ===0){
            res.status(400)
            throw new  Error("No Order Items")
            return 
        }else{
            const order = new Order({
                orderItems,
                user: req.user_id,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
            })


            const createOrder = await order.save()
            res.status(201).json(createOrder)
        }   

    })
);


//GET ORDER BY ID
orderRouter.get(
    "/:id",
    protect,
    asyncHandler(async (req, res) => {
       const order= await Order.findById(req.params.id).populate(
        "user",
        "name",
        "email"        
       )

        if(order){
            reson(order)
        }else{
                
            res.status(404)
            throw new Error("Order Not Found")
        }   

    })
);


//USER LOGIN ORDERS
orderRouter.get(
    "/",
    protect,
    asyncHandler(async (req, res) => {
       const order= await Order.find({user: req.user_id}).sort({_id:-1});
        if(order){
            reson(order)
        }
    })
);



//ORDER is PAID
orderRouter.put(
    "/:id/pay",
    protect,
    asyncHandler(async (req, res) => {
       const order= await Order.findById(req.params.id)
        if(order){
            order.isPaid = true
            order.paidAt = Date.now();
            
            order.paymentResult ={
                
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
             };
        const updatedOrder = await order.save();
        reson(updatedOrder);

        
        }else{
                
            res.status(404)
            throw new Error("Order Not Found")
        }   

    })
);

module.exports = orderRouter;

//export default orderRouter;
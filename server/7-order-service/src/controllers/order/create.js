import Stripe from 'stripe';
import config from '../../config.js'
import{StatusCodes} from 'http-status-codes';
import{orderSchema} from '../../schemes/order.js'
import { BadRequestError } from '@sachinsingh53/jobber-shared';
import{createOrder} from '../../services/order-service.js'
const stripe = new Stripe(config.STRIPE_API_KEY);

const intent = async (req, res) => {


    const customer = []


    // this search functionality is not available in INDIA
    
    // const customer = await stripe.customers.search({
    //     query: `email:"${req.currentUser?.email}"`
    // });
    let customerId = '';
    if (!customer.data?.length) {
        const createdCustomer = await stripe.customers.create({
            email: req.currentUser?.email,
            metadata: {
                buyerId: `${req.body.buyerId}`
            }
        });
        customerId = createdCustomer.id;
    } else {
        customerId = customer.data[0].id;
    }

    let paymentIntent;

    if (customerId) {
        //the service charge is 5.5% of the purchased amount
        //for purchase under 500 additional 50 rupees will be charged
        const price = parseInt(req.body.price);
        const serviceFee = price<50 ? 5.5*price/100+50 : 5.5*price/100

        paymentIntent = await stripe.paymentIntents.create({
            amount: Math.floor((price+serviceFee)*100),
            customer:customerId,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
            
        });
    }

    res.status(StatusCodes.CREATED).json({
        message:'Order intent created successfully',
        clientSecret: `${paymentIntent?.client_secret}`,
        paymentIntentId: paymentIntent?.id
    })
}

const order = async(req,res)=>{
    // const {error} = orderSchema.validate(req.body);
    // if(error?.details){
    //     throw new BadRequestError(error.details[0].message, ' Create order() method error');
    // }

    const price = parseInt(req.body.price);
    const serviceFee = price<50 ? 5.5*price/100+50 : 5.5*price/100;

    let orderData = req.body;

    // we are calculating the service free and adding it to orderData, If i send the orderFee from frontend it can easily manipulated so i am calculating it in backend
    orderData = {...orderData,serviceFee};

    const order = await createOrder(orderData);

    res.status(StatusCodes.CREATED).json({
        message: 'Order created successfully',
        order
    });
}

export {
    intent,
    order
}
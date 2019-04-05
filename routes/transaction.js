let Transacttion = require('../models/transactions');
let express = require('express');
let router = express.Router();
let paypal = require('paypal-rest-sdk');
let config = require('../configuration/secertkey_config');

paypal.configure({
    mode: "sandbox",
    client_id: config.PAYPAL_CLIENT_ID,
    client_secret: config.PAYPAL_CLIENT_SECRET
});

router.executepayment = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // console.log(req.body);

    let execute_payment_json = {
        payer_id: req.body.data.payerID,
    };

    const payment ={};
    payment.amount=req.body.data.amount;

    const paymentID=req.body.data.paymentID;

    paypal.payment.execute(paymentID, execute_payment_json, function(error, payment) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            // console.log(JSON.stringify(payment.transactions[0].item_list,null,5));
            // console.log(JSON.stringify(payment.transactions.item_list.shipping_phone_number,null,5));
            let trans = new Transacttion({
                customer_id: req.params.customer,
                firstName: payment.payer.payer_info.first_name,
                lastName: payment.payer.payer_info.last_name,
                address: payment.payer.payer_info.shipping_address.line1,
                city: payment.payer.payer_info.shipping_address.city,
                province: payment.payer.payer_info.shipping_address.state,
                country_code: payment.payer.payer_info.shipping_address.country_code,
                postal_code: payment.payer.payer_info.shipping_address.postal_code,
                contact_num: payment.transactions[0].item_list.shipping_phone_number,
                // email: payment.payer.payer_info.transactions.payee.email,
                product_id: payment.transactions[0].description,
                product_name: payment.transactions[0].item_list.items[0].name,
                product_price: parseInt(payment.transactions[0].item_list.items[0].price,10),
                quantity: parseInt(payment.transactions[0].item_list.items[0].quantity,10),
                shipping_price: parseInt(payment.transactions[0].amount.details.shipping,10),
                total: parseInt(payment.transactions[0].amount.total,10),
                currency: payment.transactions[0].amount.currency,
                statue: payment.transactions[0].related_resources[0].sale.state,
                last_edit: Date.now(),
                paymentId: payment.id
            });
            trans.save(function (err) {
                if (err) {
                    res.json({message: 'Transaction not added!', data: null});
                    console.log(err);
                } else {
                    res.json({message: 'Transaction successfully added!', data: payment});
                }
            });
        }
    });
};


module.exports = router;

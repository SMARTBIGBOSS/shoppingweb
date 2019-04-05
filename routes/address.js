let Address = require('../models/addresses');
let express = require('express');
let router = express.Router();

router.add = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let address = new Address();

    if (req.params.customer == null) {
        res.json({ message: 'Customer is unvalidated'});
    } else if (req.body.firstName == null) {
        res.json({ message: 'First name is required'});
    } else if (req.body.lastName == null) {
        res.json({ message: 'Last name is required'});
    } else if (req.body.address == null) {
        res.json({ message: 'Address is required'});
    } else if (req.body.city == null) {
        res.json({ message: 'City/Town is required'});
    } else if (req.body.province == null) {
        res.json({ message: 'Province/Territory/County/State is required'});
    } else if (req.body.country == null) {
        res.json({ message: 'Country is required'});
    } else if (req.body.contact_num == null || req.body.email === null) {
        res.json({ message: 'Contact number and Email are required at lease one'});
    } else if (req.body.post_code == null) {
        res.json({ message: 'Post code is required'});
    } else {
        address.customer_id = req.params.customer;
        address.firstName = req.body.firstName;
        address.lastName = req.body.lastName;
        address.address = req.body.address;
        address.city = req.body.city;
        address.province = req.body.province;
        address.country = req.body.country;
        address.contact_num = req.body.contact_num;
        address.email = req.body.email;
        address.post_code = req.body.post_code;
        address.last_edit = Date.now();

        address.save(function (err) {
            if(err)
                res.json({ message: 'Address not added!', data: null });
            else
                res.json({ message: 'Address successfully added!', data: address });
        });
    }
};

router.edit = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.params.customer == null) {
        res.json({ message: 'Customer is unvalidated'});
    } else if (req.body.firstName == null) {
        res.json({ message: 'First name is required'});
    } else if (req.body.lastName == null) {
        res.json({ message: 'Last name is required'});
    } else if (req.body.address == null) {
        res.json({ message: 'Address is required'});
    } else if (req.body.city == null) {
        res.json({ message: 'City/Town is required'});
    } else if (req.body.province == null) {
        res.json({ message: 'Province/Territory/County/State is required'});
    } else if (req.body.country == null) {
        res.json({ message: 'Country is required'});
    } else if (req.body.contact_num == null || req.body.email === null) {
        res.json({ message: 'Contact number and Email are required at lease one'});
    } else if (req.body.post_code == null) {
        res.json({ message: 'Post code is required'});
    } else {
        Address.updateOne({_id: req.params.id},
            {customer_id: req.params.customer,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                city: req.body.city,
                province: req.body.province,
                country: req.body.country,
                contact_num: req.body.contact_num,
                email: req.body.email,
                post_code: req.body.post_code,
                last_edit: Date.now()}, function (err, address) {
                if (err) {
                    res.json({ message: 'Address edited failed', data: null});
                } else {
                    res.json({ message: 'Address edited successfully', data: address});
                }
            });
    }
};

router.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Address.findOneAndRemove({_id: req.params.id}, function(err, address){
        if (err) {
            res.json({message: 'Address remove failed', data: null});
        } else {
            res.json({message: 'Address remove successfully', data: address});
        }
    });
};


router.getByCustomer = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Address.find({customer_id: req.params.customer}, function(err, addresses){
        if (err){
            res.json({message: 'Addresses not found', data: null});
        } else {
            res.json({data: addresses});
        }
    });
};

router.getOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Address.findById(req.params.id, function(err, address){
        if (err){
            res.json({message: 'Product not found', data: null});
        } else {
            res.json({data: address});
        }
    });
};

module.exports = router;

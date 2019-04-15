let Shipping = require('../models/shippings');
let Transaction = require('../models/transactions');
let config = require('../configuration/secertkey_config');
let express = require('express');
let router = express.Router();

router.listCouriers = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let postData = null;
    let url = 'http://api.trackingmore.com/v2/carriers/';
    sentRes(url,postData,"GET",function(carriers){
        res.send(carriers);
    });
};

router.createATracking = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let postData = {
        "tracking_number": req.body.tracking_number,
        "carrier_code": req.body.carrier_code,
        "lang": "en"
    };
    let url = 'https://api.trackingmore.com/v2/trackings/post';

    sentRes(url,postData,"post",function(tracking){
        let track = JSON.parse(tracking);
        console.log(track.meta);
        if (track.meta.code == 200) {
            console.log(track.data);
            let shipping = new Shipping ({
                tracking_number: postData.tracking_number,
                carrier_code: postData.carrier_code,
                transaction_id: req.body.transaction_id,
                customer_id: req.body.customer_id,
                seller_id: req.body.seller_id,
                last_edit: Date.now()
            });

            shipping.save(function (err) {
                if (err) {
                    res.json({message: 'Shipping created but not save', data: null})
                } else {
                    let transactionID = req.body.transaction_id;
                    Transaction.updateOne({"_id": transactionID},
                        {shipping_statue: 'delivering'},
                        function (err, transaction) {
                            if (err) {
                                res.json({message: 'Transaction not update', data: null})
                            } else {
                                res.json({message: 'Shipping created and Transaction update', data: shipping})
                            }
                    });
                }
            });
        } else {
            res.json({message: 'Bad Request', data: null});
        }
    });
};
//没有时间限制
router.getOneTracking = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Shipping.findOne({transaction_id: req.params.transactionId}, function (err, shipping) {
        if (!shipping) {
            res.json({message: 'Shipping not found', data: null})
        } else {
            let postData = null;
            let url = 'http://api.trackingmore.com/v2/trackings/'+shipping.carrier_code+'/'+shipping.tracking_number+'/en';
            sentRes(url,postData,"GET",function(tracking){
                let tracks = JSON.parse(tracking);
                // tracks = JSON.parse(tracks.data);
                console.log(JSON.stringify(tracks.data.origin_info.trackinfo,null,5));
                res.json({track: tracks.data});
            });
        }
    });
};

router.getARealTimeTracking = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let url = 'http://api.trackingmore.com/v2/trackings/realtime';
    Shipping.findOne({transaction_id: req.params.transactionId}, function (err, shipping) {
        if (!shipping) {
            res.json({message: 'Shipping not found', data: null})
        } else {
            let postData = {
                "tracking_number": shipping.tracking_number,
                "carrier_code":  shipping.carrier_code,
                "lang": "en"
            };
            sentRes(url,postData,"POST",function(tracking){
                let tracks = JSON.parse(tracking);
                // tracks = JSON.parse(tracks.data);
                console.log(tracks.meta);
                res.json({track: tracks.data.items});
            });
        }
    });
};

router.getOneShipping = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Shipping.findOne({transaction_id: req.params.transactionId}, function (err, shipping) {
        if (!shipping) {
            res.json({message: 'Shipping not found', data: null})
        } else {
            res.json({message: 'Shipping found', data: shipping})
        }
    });
};

function sentRes(url,data,method,fn){
    data=data||null;
    if(data==null){
        var content=require('querystring').stringify(data);
    }else{
        var content = JSON.stringify(data,null ,5); //json format
    }

    var parse_u=require('url').parse(url,true);
    var isHttp=parse_u.protocol=='http:';
    var options={
        host:parse_u.hostname,
        port:parse_u.port||(isHttp?80:443),
        path:parse_u.path,
        method:method,
        headers:{
            'Content-Type':'application/json',
            'Content-Length':Buffer.byteLength(content,"utf8"),
            'Trackingmore-Api-Key': config.TRACKINGMORE
        }
    };
    var req = require(isHttp?'http':'https').request(options,function(res){
        var _data='';
        res.on('data', function(chunk){
            _data += chunk;
        });
        res.on('end', function(){
            fn!=undefined && fn(_data);
        });
            return res
    });
    req.write(content);
    req.end();
};

module.exports = router;

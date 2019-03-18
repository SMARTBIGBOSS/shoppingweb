let Classification = require('../models/classification');
let express = require('express');
let router = express.Router();

router.add = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.body.type == null) {
        res.json({ message: 'Type is unvalidated'});
    } else if (req.body.title == null) {
        res.json({ message: 'Title is unvalidated'});
    } else if (req.body.subtitle == null) {
        res.json({ message: 'Subtitle is unvalidated'});
    } else {
        let classification = new Classification();
        classification.admin_id = req.params.admin;
        classification.type = req.body.type;
        classification.title = req.body.title;
        classification.subtitle = req.body.subtitle;
        classification.active = req.body.active;
        classification.last_edit = Date.now();

        classification.save(function (err) {
            if(err)
                res.json({ message: 'Classification not added!', data: null });
            else
                res.json({ message: 'Classification successfully added!', data: classification });
        });
    }
};

router.edit = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.params.admin == null) {
        res.json({ message: 'Administrator is unvalidated'});
    } else if (req.body.type == null) {
        res.json({ message: 'Type is unvalidated'});
    } else if (req.body.title == null) {
        res.json({ message: 'Title is unvalidated'});
    } else if (req.body.subtitle == null) {
        res.json({ message: 'Subtitle is unvalidated'});
    } else {
        Classification.updateOne({_id: req.params.id},
            {admin_id: req.params.admin,
                type: req.body.type,
                title: req.body.title,
                subtitle: req.body.subtitle,
                active: req.body.active,
                last_edit: Date.now()}, function (err, classification) {
                if (err) {
                    res.json({ message: 'Classification edited failed', data: null});
                } else {
                    res.json({ message: 'Classification edited successfully', data: classification});
                }
            });
    }
};

router.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Classification.findOneAndRemove({_id: req.params.id}, function(err, classification){
        if (err) {
            res.json({message: 'Classification remove failed', data: null});
        } else {
            res.json({message: 'Classification remove successfully', data: classification});
        }
    });
};

router.getClassificationByType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Classification.find({type: req.params.type}, function(err, classification){
        if (err){
            res.json({message: 'Classification not found', data: null});
        } else {
            res.json({data: classification});
        }
    });
};

router.getActiveClassificationByType = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Classification.find({type: req.params.type, active: true}, function(err, classification){
        if (err){
            res.json({message: 'Classification not found', data: null});
        } else {
            res.json({data: classification});
        }
    });
};

router.getClassificationByTitle = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Classification.find({title: req.params.title}, function(err, classification){
        if (err){
            res.json({message: 'Classification not found', data: null});
        } else {
            res.json({data: classification});
        }
    });
};

router.getActiveClassificationByTitle = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Classification.find({title: req.params.title, active: true}, function(err, classification){
        if (err){
            res.json({message: 'Classification not found', data: null});
        } else {
            res.json({data: classification});
        }
    });
};

router.getAClassification = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Classification.findById(req.params.id, function (err, classification) {
        if (!classification) {
            res.json({message: 'Classification not found', data: null})
        } else {
            res.json({message: 'Classification exist', data: classification})
        }
    })
};

module.exports = router;

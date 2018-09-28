const db = require("../models");

module.exports = {
    findAll: function(req, res){
        db.Rental
          .find(req.query)
          .sort({date: -1})
          .then(dbModel => res.json(dbModel))
          .catch(err => res.status(422).json(err))
    },
    //posting product
    create: function(req, res){
        db.Rental
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err))
    },
    // remove: function(req, res){
    //     db.Product
    //         .findById ({_id: req.params.id})
    //         .then(dbModel => dbModel.remove())
    //         .then(dbModel => res.json(dbModel))
    //         .catch(err => res.status(422).json(err))
    // },
    // findById: function(req, res){
    //     db.Product
    //         .findById(req.params.id)
    //         .then(dbModel => res.json(dbModel))
    //         .catch(err => res.status(422).json(err));
    // },
    // update: function(req, res){
    //     db.Product
    //         .findOneAndUpdate({_id:req.params.id}, req.body)
    //         .then(dbModel => res.json(dbModel))
    //         .catch(err => res.status(422).json(err));
    // }
    
};
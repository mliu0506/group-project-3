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
    
};
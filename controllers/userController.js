const db = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
  getUser: function (req, res) {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
      db.User.findOne({ _id: req.user._id })
        .then(response => {
          res.json(response);
        });
    } else {
      res.json({ user: null })
    }
  },

  signup: function (req, res) {
    const { username, firstName, lastName, email, province, postalCode, phone} = req.body;

    console.log(phone);
    const filteredPhone = phone.split("").filter(num => /^[0-9]+$/.test(num)).join("");
    console.log("Filtered phone: " + filteredPhone);
    req.body.phone = filteredPhone;

    let postalCodeTest =  /^[a-zA-Z0-9-]+$/.test(postalCode);
    let emailTest = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
    let phoneTest = /^\d{10}/.test(filteredPhone);
    let userTest = /^[a-zA-Z0-9]+$/.test(username);
    let firstTest = /^[a-zA-Z]+$/.test(firstName);
    let lastTest = /^[a-zA-Z]+$/.test(lastName);
    let provinceTest = /^[a-zA-Z]+$/.test(province);


    if (!postalCodeTest || !emailTest || !phoneTest || !userTest || !firstTest || !lastTest || !provinceTest ) {
      console.log(postalCodeTest);
      console.log(emailTest);
      console.log(phoneTest);
      console.log(userTest);
      console.log(firstTest);
      console.log(lastTest);
      return res.json({ error: 'did not validate' });
    }

    // ADD VALIDATION
    db.User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log('User.js post error: ', err)
      } else if (user) {
        res.json({ error: 'username taken' });
      } else {
        db.User.findOne({ email: email }, (err, nextUser) => {
          if (err) {
            console.log('User.js post error: ', err)
          } else if (nextUser) {
            res.json({ error: 'email taken' })
          }
          else {
            const newUser = new db.User(req.body)
            newUser.save((err, savedUser) => {
              if (err) return res.json(err)
              console.log("User returned from login:");
              console.log(savedUser);
              console.log("User from req.user");
              console.log(req.user);

              db.ShoppingCart.create({
                customerId: savedUser._id
              })

              res.json(savedUser)
            })
          }
        })
      }
    })
  },

  updateUserInfo: function (req, res) {
    const { username, firstName, lastName, email, province, postalCode, phone } = req.body;

    let postalCodeTest;
    postalCode !== undefined ? postalCodeTest = /^[a-zA-Z0-9-]+$/.test(postalCode) : postalCodeTest = true;

    let emailTest;
    email !== undefined ? emailTest = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email) : emailTest = true;

    let phoneTest;
    phone !== undefined ? phoneTest = /^\d{3}[\-]\d{3}[\-]\d{4}/.test(phone) || /^\d{10}/.test(phone) : phoneTest = true;

    let userTest;
    username !== undefined ? userTest = /^[a-zA-Z0-9]+$/.test(username) : userTest = true;

    let firstTest;
    firstName !== undefined ? firstTest = /^[a-zA-Z]+$/.test(firstName) : firstTest = true;

    let lastTest;
    lastName !== undefined ? lastTest = /^[a-zA-Z]+$/.test(lastName) : lastTest = true;

    let provinceTest;
    province !== undefined ? provinceTest = /^[a-zA-Z]+$/.test(province) : provinceTest = true;

  
    if (!postalCodeTest || !emailTest || !phoneTest || !userTest || !firstTest || !lastTest ) {
      return res.json({ error: 'did not validate' });
    }

    // ADD VALIDATION
    db.User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log('User.js post error: ', err)
      } else if (user) {
        res.json({ error: 'username taken' });
      } else {
        db.User.findOne({ email: email }, (err, nextUser) => {
          if (err) {
            console.log('User.js post error: ', err)
          } else if (nextUser) {
            res.json({ error: 'email taken' })
          }
          else {
            db.User.findOneAndUpdate({ _id: req.user._id }, req.body)
              .then(response => res.json(response))
              .catch(err => res.json(err));
          }
        })
      }
    })
  },

  getUserProfileData: function (req, res) {
    if (req.user) {
      db.User.findOne({ _id: req.user._id })
        .populate("reservations")
        .populate("pastRentals")
        .populate("purchases")
        .sort({ "date.from": -1 })
        .then(response => {
          const userObject = {
            reservations: response.reservations,
            pastRentals: response.pastRentals,
            purchases: response.purchases,
            username: response.username,
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            street: response.street,
            city: response.city,
            province: response.province,
            postalCode: response.postalCode,
            phone: response.phone,
            photo: response.photo
          }
          res.json(userObject);
        });
    } else {
      res.json({ user: null })
    }
  },

  login: function (req, res) {
    const { username } = req.body;

    db.User.findOne({ username: username }, (err, user) => {
      if (err) {
        console.log("Stupid!");
        res.json(err);
      } else {
        res.json(user);
      }
    });
  },

  logout: function (req, res) {
    console.log("Hi! Here's your user: ");
    console.log(req.user);
    if (req.user) {
      req.session.destroy();
      res.send({ msg: 'logging out' })
    } else {
      res.send({ msg: 'no user to log out' })
    }
  },

  changePw: function (req, res) {
    console.log(req.body);
    const isMatch = bcrypt.compareSync(req.body.currentPassword, req.user.password);
    if (isMatch) {
      const pw = bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(10), null);
      db.User.findOneAndUpdate(
        { _id: req.user._id },
        {
          password: pw,
          pwChangeAttempts: 0
        }
      )
        .then(response => {
          console.log("Check pw response:");
          console.log(response);
          res.json(response);
        })
    } else {
      db.User.findOneAndUpdate(
        { _id: req.user._id },
        { $inc: { pwChangeAttempts: 1 } }
      )
        .then(response => {
          console.log(response);
          if (response.pwChangeAttempts === 2) {
            const pw = bcrypt.hashSync("YourF33tAr3B4ckw4rd$", bcrypt.genSaltSync(10), null);
            db.User.findOneAndUpdate(
              { _id: req.user._id },
              {
                password: pw,
                pwChangeAttempts: 0
              }
            )
              .then(response => {
                console.log("Check pw response:");
                console.log(response);
                res.json({ message: "too many attempts" });
              })
          } else {
            res.send({ message: "incorrect" });
          }
        }).catch(err => res.json(err));
    }
  },

}

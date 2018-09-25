const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
mongoose.promise = Promise;

const tempPw = bcrypt.hashSync("BootsNPants", bcrypt.genSaltSync(10), null);

const userSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true, default: tempPw },
	pwChangeAttempts: { type: Number, required: true, default: 0 },
	firstName: String,
	lastName: String,
	email: String,
	street: String,
	city: String,
	province: String,
	postalCode: String,
	phone: String,
	photo: String,
	reservations: [{
		type: Schema.Types.ObjectId,
		ref: "Reservation"
	}],
	pastRentals: [{
		type: Schema.Types.ObjectId,
		ref: "PastRental"
	}],
	standing: {
		type: String,
		enum: ['Good', 'Uncertain', 'Banned', 'Inactive'],
		default: 'Good'
	},
  note: String
});

// Define schema methods
userSchema.methods.checkPassword = function (inputPassword) {
	return bcrypt.compareSync(inputPassword, this.password);
}

userSchema.methods.hashPassword = function (plainTextPassword) {
	return bcrypt.hashSync(plainTextPassword, 10);
}

// Define hooks for pre-saving
userSchema.pre('save', function (next) {
	if (!this.password) {
		console.log('models/user.js =======NO PASSWORD PROVIDED=======');
		next();
	} else {
		console.log('models/user.js hashPassword in pre save');
		this.password = this.hashPassword(this.password);
		next();
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
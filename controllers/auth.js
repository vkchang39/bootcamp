const asyncHandler = require("../middleware/async");
const crypto = require("crypto");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const Bootcamp = require("../models/bootcamp");

// @desc    register a user.
// @route   POST api/v1/auth/register
// @access  Public

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	sendTokenResponse(user, 200, res);
});

// @desc    login a user.
// @route   POST api/v1/auth/login
// @access  Public

exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//validate email and password
	if (!email || !password) {
		return next(
			new errorResponse("please provide an email and password", 400)
		);
	}

	// verify a user
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(new errorResponse("Invalid Credentials", 401));
	}

	// password check
	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		return next(new errorResponse("Invalid Credentials", 401));
	}

	sendTokenResponse(user, 200, res);
});

// @desc    get a user.
// @route   GET api/v1/auth/me
// @access  Private

exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    Update Password
// @route   PUT api/v1/auth/updatepassword
// @access  Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");

	//check current password
	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new errorResponse("Password is incorrect", 401));
	}

	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});

// @desc    update user details.
// @route   PUT api/v1/auth/updatedetails
// @access  Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		name: req.body.name,
	};
	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    delete a user.
// @route   DELETE api/v1/auth/deleteme
// @access  Private

// exports.deleteMe = asyncHandler(async (req, res, next) => {
// 	const user = await User.findById(req.user.id);

// 	if (!user) {
// 		return next(new errorResponse("unauthorised", 401));
// 	}
// 	await user.remove;

// 	res.status(200).json({
// 		success: true,
// 		data: user,
// 	});
// });

// @desc    forgot password.
// @route   GET api/v1/auth/forgotpassword
// @access  Private

exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(
			new errorResponse(
				`There is no user with email id of ${req.body.email}`,
				404
			)
		);
	}

	//get reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	//create reset url
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `${resetUrl}`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Password reset",
			message,
		});

		res.status(200).json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new errorResponse(`email could not be sent`, 500));
	}

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    reset password
// @route   PUT api/v1/auth/resetpassword/:resettoken
// @access  Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resettoken)
		.digest("hex");

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(new errorResponse("invalid user", 400));
	}

	//set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;

	await user.save();

	sendTokenResponse(user, 200, res);
});

// GET TOKEN FROM MODEL, SAVE IT IN COOKIE AND SEND IT AS RESPONSE
const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res.status(statusCode)
		.cookie("token", token, options)
		.json({ success: true, token });
};

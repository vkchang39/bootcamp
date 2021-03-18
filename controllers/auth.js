const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");

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

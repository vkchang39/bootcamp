const jwt = require("jsonwebtoken");
const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require("./async");

//protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}

	// else if (req.cookie.token) {
	//     token = req.cookie.token;
	// }

	if (!token) {
		return next(
			new errorResponse("Not authorised to access this service", 401)
		);
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log(decoded);
		req.user = await User.findById(decoded.id);
		next();
	} catch (err) {
		return next(
			new errorResponse("Not authorised to access this service", 401)
		);
	}
});

// GRANT ACCESS TO SPECIFIC ROLES
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new errorResponse(
					`User role ${req.user.role} is not authoried for this route`,
					403
				)
			);
		}
		next();
	};
};

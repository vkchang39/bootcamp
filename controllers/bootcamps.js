const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/bootcamp");

// @desc    Get all Bootcamps.
// @route   GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	// copy req.query
	const reqQuery = { ...req.query };

	// fields to exclude
	const removeFields = ["select", "sort", "page", "limit"];

	// loop over removeFields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// create query string
	let queryStr = JSON.stringify(reqQuery);

	//create operators like $gt $gte etc
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// finding resource
	query = Bootcamp.find(JSON.parse(queryStr));

	//select fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		query = query.select(fields);
	}

	//sort fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 1;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// executing query
	const bootcamp = await query;

	// pagination result
	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page + 1,
			limit,
		};
	}

	res.status(200).json({
		success: true,
		count: bootcamp.length,
		pagination,
		data: bootcamp,
	});
});

// @desc    Get single Bootcamp.
// @route   GET api/v1/bootcamps/:id
// @access  Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return new ErrorResponse(
			`Bootcamp not found wit id of ${req.params.id}`,
			404
		);
	}

	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @desc    Create new Bootcamp.
// @route   POST api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({ success: true, msg: bootcamp });
});

// @desc    Update Bootcamp.
// @route   PUT api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!bootcamp) {
		return new ErrorResponse(
			`Bootcamp not found wit id of ${req.params.id}`,
			404
		);
	}
	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @desc    Delete Bootcamp.
// @route   DELETE api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
	if (!bootcamp) {
		return new ErrorResponse(
			`Bootcamp not found wit id of ${req.params.id}`,
			404
		);
	}
	res.status(200).json({
		success: true,
		msg: `Deleted Bootcamp ${req.params.id}`,
	});
});

// @desc    Get Bootcamp with in a radius.
// @route   DELETE api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
// exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
// 	const { zipcode, distance } = req.params;
// 	//console.log(zipcode, distance);

// 	//get lang/lat from geocode
// 	const loc = await geocoder.geocode(zipcode);
// 	const lng = loc[0].longitude;
// 	const lat = loc[0].latitude;

// 	const radius = distance / 3963;
// 	console.log(lng, lat, radius);
// 	const bootcamps = await Bootcamp.find({
// 		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
// 	});

// 	res.status(200).json({
// 		success: true,
// 		count: bootcamps.length,
// 		data: bootcamps,
// 	});
// });

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc radius using radians
	// Divide dist by radius of Earth
	// Earth Radius = 3,963 mi / 6,378 km
	const radius = distance / 3963;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

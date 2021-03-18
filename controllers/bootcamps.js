const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/bootcamp");

// @desc    Get all Bootcamps.
// @route   GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

// @desc    Get single Bootcamp.
// @route   GET api/v1/bootcamps/:id
// @access  Private
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found wit id of ${req.params.id}`,
				404
			)
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
	req.body.user = req.user.id;

	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

	if (!publishedBootcamp && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`user with id with ${req.user.id} has already published a bootcamp`,
				400
			)
		);
	}

	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({ success: true, msg: bootcamp });
});

// @desc    Update Bootcamp.
// @route   PUT api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	let bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found wit id of ${req.params.id}`,
				404
			)
		);
	}

	//make sure bootcamp belongs to the logged in user
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id of ${req.params.id} is not authorised to update this bootcamp`,
				401
			)
		);
	}

	bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @desc    Delete Bootcamp.
// @route   DELETE api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found wit id of ${req.params.id}`,
				404
			)
		);
	}

	//make sure bootcamp belongs to the logged in user
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id of ${req.params.id} is not authorised to delete this bootcamp`,
				401
			)
		);
	}

	bootcamp.remove();

	res.status(200).json({
		success: true,
		msg: `Deleted Bootcamp ${req.params.id}`,
	});
});

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

// @desc    Upload Photo from Bootcamp.
// @route   PUT api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);
	if (!bootcamp) {
		return next(
			new ErrorResponse(
				`Bootcamp not found wit id of ${req.params.id}`,
				404
			)
		);
	}

	//make sure bootcamp belongs to the logged in user
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id of ${req.params.id} is not authorised to update this bootcamp`,
				401
			)
		);
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please Upload a file`, 400));
	}
	const file = req.files.file;
	// validation image extention
	if (!file.mimetype.startsWith("image")) {
		return next(new ErrorResponse(`Please Upload a valid image file`, 400));
	}

	//CHECK FILE SIZE
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please Upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	//CREATE CUSTOM FILENAME
	file.name = `photo_${bootcamp.id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(`problem with file upload`, 500));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
});

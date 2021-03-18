const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Bootcamp = require("../models/bootcamp");
const errorResponse = require("../utils/errorResponse");

// @desc    Get Courses
// @route   GET api/v1/courses
// @route   GER api/v1/bootcamps/:bootcampsId/courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc    Get Single Course
// @route   GET api/v1/Courses/	:id
// @access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: "bootcamp",
		select: "name description",
	});

	if (!course) {
		return next(
			new errorResponse(`no course with the id of ${req.params.id}`),
			404
		);
	}
	res.status(200).json({
		sucess: true,
		data: course,
	});
});

// @desc    Add a Course
// @route   POST api/v1/:bootcampId/Courses/
// @access  Private

exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(
			new errorResponse(
				`No Bootcamp with the id of ${req.params.bootcampId}`
			),
			404
		);
	}
	//make sure bootcamp belongs to the logged in user
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id of ${req.user.id} is not authorised to add a course to bootcamp`,
				401
			)
		);
	}

	const course = await Course.create(req.body);

	res.status(200).json({
		sucess: true,
		data: course,
	});
});

// @desc    Update a Course
// @route   PUT api/v1/courses/:id
// @access  Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new errorResponse(`No course with the id of ${req.params.id}`),
			404
		);
	}

	//make sure bootcamp belongs to the logged in user
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id of ${req.user.id} is not authorised to update course to bootcamp`,
				401
			)
		);
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		sucess: true,
		data: course,
	});
});

// @desc    Delete a Course
// @route   DELETE api/v1/courses/:id
// @access  Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new errorResponse(`No course with the id of ${req.params.id}`),
			404
		);
	}

	//make sure bootcamp belongs to the logged in user
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`User with id of ${req.user.id} is not authorised to delete a course to bootcamp`,
				401
			)
		);
	}

	await course.remove();

	res.status(200).json({
		sucess: true,
		data: {},
	});
});

const express = require("express");
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	deleteBootcamp,
	createBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const Bootcamp = require("../models/bootcamp");
const advancedResults = require("../middleware/advancedResults");

// include other resource router
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// re route into other resourse router
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
	.route("/:id/photo")
	.put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), getBootcamps)
	.post(protect, authorize("publisher", "admin"), createBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.put(protect, authorize("publisher", "admin"), updateBootcamp)
	.delete(protect, authorize("publisher", "admin"), deleteBootcamp);
module.exports = router;

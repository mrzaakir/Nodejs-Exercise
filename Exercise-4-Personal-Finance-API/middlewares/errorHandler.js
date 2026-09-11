const errorHandler = (error, req, res, next) => {
	if (res.headersSent) return next(error);

	if (error.name === "ValidationError") {
		return res.status(400).json({ message: error.message });
	}

	if (error.name === "CastError") {
		return res.status(400).json({ message: `Invalid ${error.path}` });
	}

	console.error(error);
	res.status(error.statusCode || 500).json({
		message: error.statusCode ? error.message : "Internal server error"
	});
};

module.exports = errorHandler;
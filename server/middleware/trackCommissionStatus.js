const Farmer = require('../models/farmerModel.js');
const { catchAsyncErrors } =require('../middleware/catchAsyncErrors.js');
const {ErrorHandler}=require('../middleware/error.js');

exports.trackCommissionStatus = catchAsyncErrors(
  async (req, res, next) => {
    const user = await Farmer.findById(req.user.id);
    if (user.unpaidCommission > 0) {
      return next(
        new ErrorHandler(
          "You have unpaid commissions. Please pay them before posting a new auction.",
          403
        )
      );
    }
    next();
  }
);
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      res
        .status(error.cause || 500)
        .json({ message: error.message, success: false, stack: error.stack });
    });
  };
};
 


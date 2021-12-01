/* eslint-disable semi, quotes */

class ValidationErr extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

class ConflictErr extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}
class NotAuthorizedErr extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

const errorHandler = (error, req, res, next) => {
  if (
    error instanceof ConflictErr ||
    error instanceof NotAuthorizedErr ||
    error instanceof ValidationErr
  ) {
    return res.status(error.status).json({ message: error.message });
  }
  res.status(500).json({ message: error.message });
};

module.exports = {
  ConflictErr,
  NotAuthorizedErr,
  ValidationErr,
  errorHandler,
};

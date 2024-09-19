const { UserModel } = require("../models");
const { APIError, BadRequestError } = require("../../utils/app-errors");

class UserRepository {

  async CreateUser({email,password}) {
    try {
      const user = new UserModel({
        email,
        password
      });

      const userResult = await user.save();
      return userResult;

    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Create Product"
      );
    }
  }

  async FindById({_id}) { 
    try {
      return await UserModel.findById(_id);

    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find User"
      );
    }
  }

  async FindByEmail({email}) { 
    try {
      return await UserModel.findOne({email});
      
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to Find User"
      );
    }
  }
}

module.exports = UserRepository;
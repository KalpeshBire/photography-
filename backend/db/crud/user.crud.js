const User = require("../../models/User");

/* CREATE */
const createAdmin = async (data) => {
  return await User.create(data);
};

/* READ */
const getAdminByEmail = async (email) => {
  return await User.findOne({ email });
};

/* UPDATE */
const updateAdmin = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

/* DELETE */
const deleteAdmin = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  createAdmin,
  getAdminByEmail,
  updateAdmin,
  deleteAdmin
};

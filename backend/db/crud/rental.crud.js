const Rental = require("../../models/Rental");

/* CREATE */
const createRental = async (data) => {
  return await Rental.create(data);
};

/* READ */
const getAllRentals = async () => {
  return await Rental.find({ available: true });
};

const getRentalByType = async (type) => {
  return await Rental.find({ type });
};

/* UPDATE */
const updateRental = async (id, updateData) => {
  return await Rental.findByIdAndUpdate(id, updateData, { new: true });
};

/* DELETE */
const deleteRental = async (id) => {
  return await Rental.findByIdAndDelete(id);
};

module.exports = {
  createRental,
  getAllRentals,
  getRentalByType,
  updateRental,
  deleteRental
};

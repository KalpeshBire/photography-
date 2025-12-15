const Booking = require("../../models/Booking");

/* CREATE */
const createBooking = async (data) => {
  return await Booking.create(data);
};

/* READ */
const getAllBookings = async () => {
  return await Booking.find().populate("service");
};

const getBookingsByStatus = async (status) => {
  return await Booking.find({ status });
};

/* UPDATE STATUS */
const updateBookingStatus = async (id, status) => {
  return await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};

/* DELETE */
const deleteBooking = async (id) => {
  return await Booking.findByIdAndDelete(id);
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingsByStatus,
  updateBookingStatus,
  deleteBooking
};

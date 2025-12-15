const Gallery = require("../../models/Gallery");

/* CREATE */
const createGallery = async (data) => {
  return await Gallery.create(data);
};

/* READ */
const getAllGalleries = async () => {
  return await Gallery.find().sort({ createdAt: -1 });
};

const getGalleryByCategory = async (category) => {
  return await Gallery.find({ category });
};

/* UPDATE */
const updateGallery = async (id, updateData) => {
  return await Gallery.findByIdAndUpdate(id, updateData, { new: true });
};

/* DELETE */
const deleteGallery = async (id) => {
  return await Gallery.findByIdAndDelete(id);
};

module.exports = {
  createGallery,
  getAllGalleries,
  getGalleryByCategory,
  updateGallery,
  deleteGallery
};

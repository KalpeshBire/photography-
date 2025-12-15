const Service = require("../../models/Service");

/* CREATE */
const createService = async (data) => {
  return await Service.create(data);
};

/* READ */
const getAllServices = async () => {
  return await Service.find({ active: true });
};

const getServiceByType = async (type) => {
  return await Service.find({ serviceType: type });
};

/* UPDATE */
const updateService = async (id, updateData) => {
  return await Service.findByIdAndUpdate(id, updateData, { new: true });
};

/* SOFT DELETE */
const deactivateService = async (id) => {
  return await Service.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );
};

module.exports = {
  createService,
  getAllServices,
  getServiceByType,
  updateService,
  deactivateService
};

const Joi = require('joi');

exports.createBookingSchema = Joi.object({
  providerId: Joi.string().required(),
  serviceId: Joi.string().required(),
  scheduledDate: Joi.date().required(),
  slotStart: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  slotEnd: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  address: Joi.object({
    line1: Joi.string().required(),
    line2: Joi.string().allow(''),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.string().required(),
    lat: Joi.number(), lng: Joi.number()
  }).required(),
  pricing: Joi.object({
    baseAmount: Joi.number().required(),
    taxes: Joi.number().default(0),
    discount: Joi.number().default(0),
    total: Joi.number().required(),
    currency: Joi.string().default('INR')
  }).required(),
  notes: Joi.string().allow('')
});

exports.rejectSchema = Joi.object({ reason: Joi.string().required() });
exports.startSchema  = Joi.object({ otp: Joi.string().length(4).required() });

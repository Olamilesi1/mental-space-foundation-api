import Joi from 'joi'

export const blogValidationSchema = Joi.object({
  image: Joi.string(),
  title: Joi.string().required(),
  summary: Joi.string().required(), 
  author: Joi.string().required().max(60), 
  contents: Joi.string().required(),
  // date: Joi.date().required(),
});

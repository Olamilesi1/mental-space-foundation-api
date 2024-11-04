import Joi from 'joi'

export const eventValidationSchema = Joi.object({
  image: Joi.string(),
  title: Joi.string().required(),
  // description: Joi.string().required(), 
  contents: Joi.string().required(),
  date: Joi.date().required(),
});

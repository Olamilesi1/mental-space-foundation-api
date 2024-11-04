import Joi from 'joi'

export const commentValidationSchema = Joi.object({
  comments: Joi.string().required(),
});

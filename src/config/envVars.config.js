import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const envVarsSchema = Joi.object().keys({
  NODE_ENV: Joi.string().default("development"),
  PORT: Joi.number().default(8080),
  MONGO_URI: Joi.string().required(),
  JWT_ACCEESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCEESS_EXPIRES_MINUTES: Joi.number().default(30),
  JWT_REFRESH_EXPIRES_DAY: Joi.number().default(10),
});

const { error, value } = envVarsSchema.unknown().validate(process.env);

if (error) {
  console.error(
    "error occured while configure env variable set up : error : ",
    error.message
  );
  process.exit(1);
}
const envVars = {
  env: value.NODE_ENV,
  port: value.PORT,
  mongodb: {
    uri: value.MONGO_URI,
    options: {},
  },
  jwt: {
    accessSecret: value.JWT_ACCEESS_SECRET,
    refreshSecret: value.JWT_REFRESH_SECRET,
    accessExpiresMinutes: value.JWT_ACCEESS_EXPIRES_MINUTES,
    refreshExpiredDays: value.JWT_REFRESH_EXPIRES_DAY,
  },
  cookie: {
    options: {
      httpOnly: true,
      secure: true,
    },
  },
};
export default envVars;

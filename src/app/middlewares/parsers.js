export const addIsDoctorQueryFlag = (req, _res, next) => {
  req.query.is_doctor = true;
  return next();
};

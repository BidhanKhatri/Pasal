const generatedOtp = () => {
  return Math.floor(Math.random() * 900000) + 100000; // generate 6 digit random number
};
export default generatedOtp;

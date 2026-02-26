export const generateCodeOtp = (length = 6) => {
  let degits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    let randomNum = Math.floor(Math.random() * 10);
    otp += degits[randomNum];
  }
  const otpExpire =  Date.now() + 10 * 60 * 1000;
  return {otp , otpExpire};
};

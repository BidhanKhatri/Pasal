const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div>
    <p>Dear, ${name} </p>
    <p>Here is your OTP, Please user this OTP to reset your password</p>
    <div>
        <p>OTP: ${otp}</p>
    </div>
    </div>
    
    `;
};
export default forgotPasswordTemplate;

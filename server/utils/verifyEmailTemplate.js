const verifyEmailTemplate = ({ name, url }) => {
  return `
    <p> Hello ${name} </p>
    <p> Thankyou for registering to Pasal. </p>
    <a href=${url} style="color:black; background:orange; marging-top:10px; padding: 20px; display: block"> Verify Email</a>
    
    `;
};

export default verifyEmailTemplate;

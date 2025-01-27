import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadImageCloudinary = async (image) => {
  const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

  const uploadImage = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "pasal" }, (error, uploadResult) => {
        return resolve(uploadResult);
      })
      .end(buffer);
  });

  return uploadImage;
};

export default uploadImageCloudinary;

// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadImageCloudinary = async (image) => {
//   // `image` should already be a buffer
//   const buffer = image.buffer;

//   const uploadImage = await new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream({ folder: "pasal" }, (error, uploadResult) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(uploadResult);
//         }
//       })
//       .end(buffer); // Directly pass the buffer here
//   });

//   return uploadImage;
// };

// export default uploadImageCloudinary;

import axios from "axios";

const fetchUserData = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const result = await axios.get("/proxy/api/user/get-user-details", config);

    return result.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Optionally rethrow the error for further handling
  }
};

export default fetchUserData;

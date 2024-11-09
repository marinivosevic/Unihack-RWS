import * as SecureStore from "expo-secure-store";

// Function to store JWT and refresh tokens
export const storeTokens = async (jwtToken: string, refreshToken: string) => {
  try {
    // Store JWT Token
    await SecureStore.setItemAsync("jwtToken", jwtToken);

    // Store Refresh Token
    await SecureStore.setItemAsync("refreshToken", refreshToken);

    return true;
  } catch (error) {
    console.error("Error storing tokens:", error);
  }
};

// Function to retrieve JWT and refresh tokens
export const getTokens = async () => {
  try {
    // Retrieve JWT Token
    const jwtToken = await SecureStore.getItemAsync("jwtToken");

    // Retrieve Refresh Token
    const refreshToken = await SecureStore.getItemAsync("refreshToken");

    if (jwtToken && refreshToken) {
      return { jwtToken, refreshToken };
    } else {
      console.log("Tokens not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return null;
  }
};

export const storeInfo = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
    console.log(`${key} stored successfully`);
  } catch (error) {
    console.error("Error storing info:", error);
  }
};

export const getInfo = async (key: string) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value) {
      return value;
    } else {
      console.log("Info not found");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving info:", error);
    return null;
  }
};

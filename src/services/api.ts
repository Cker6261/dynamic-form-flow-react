
import { FormResponse } from "../types/form";

const API_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export const loginUser = async (rollNumber: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rollNumber, name }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getFormStructure = async (rollNumber: string): Promise<FormResponse> => {
  try {
    const response = await fetch(`${API_URL}/get-form?rollNumber=${rollNumber}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching form:", error);
    throw error;
  }
};

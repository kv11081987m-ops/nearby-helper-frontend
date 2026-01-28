export const API_URL = "https://nearby-helper-backend.onrender.com";

export async function login(data) {
  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    return await res.json();
  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
}

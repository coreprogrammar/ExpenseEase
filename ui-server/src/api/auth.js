export default class AuthApi {
  static apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // ✅ Fallback

  // ✅ Register User with Better Error Handling
  static async register(data) {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Registration Failed:", errorData);
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error in register API:", error);
      throw error;
    }
  }
}

export default class AuthApi {

  static apiUrl = import.meta.env.VITE_API_URL;

  static async register(data) {
    return await fetch(`${this.apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json());
  }
}

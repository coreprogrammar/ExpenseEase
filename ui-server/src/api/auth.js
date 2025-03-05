export default class AuthApi {

  static apiUrl = 'http://localhost:5000/api';

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

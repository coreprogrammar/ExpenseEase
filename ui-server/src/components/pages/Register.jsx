import AuthApi from "../../api/auth.js";
import { useState } from "react";

async function register(formData) {
  return await AuthApi.register(formData);
}

export default function Register() {

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        message: "Passwords do not match",
        class: " border-red-400 text-red-700 bg-red-100"
      });
      return;
    }

    const data = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };

    const response = await register(data);
    console.log(response);

    let message = "";

    if (response.success === false) {
      if (response.errors) {
        for (const [, value] of Object.entries(response.errors)) {
          message += `<li>${value.message}</li>`;
        }
        message = `<ul>${message}</ul>`;
      }
      else {
        message += `${response.message}`;
      }
    }

    setAlert({
      message: message,
      class: response.success ? " border-green-400 text-green-700 bg-green-100" : " border-red-400 text-red-700 bg-red-100"
    });
  }

  const [alert, setAlert] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create your account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        {alert && <div className={"border px-4 py-3 rounded relative mb-8" + alert.class} role="alert">
          <span className="block sm:inline" dangerouslySetInnerHTML={{__html: alert.message}}></span>
        </div>}

        <form className="space-y-6"  method="POST" onSubmit={handleSubmit}>

          <div>
            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Name</label>
            <div className="mt-2">
              <input type="text" name="name" id="name" autoComplete="name" required="required"
                     value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
            <div className="mt-2">
              <input type="email" name="email" id="email" autoComplete="email" required=""
                     value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
            </div>
            <div className="mt-2">
              <input type="password" name="password" id="password" autoComplete="current-password" required=""
                     value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
            </div>
            <div className="mt-2">
              <input type="password" name="confirmPassword" id="confirmPassword" autoComplete="current-password" required=""
                     value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
            </div>
          </div>

          <div>
            <button type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
              up
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account? <a href="/login" className="text-indigo-600 font-medium">Login</a>
        </p>
        </form>

      </div>
    </div>
  );
}

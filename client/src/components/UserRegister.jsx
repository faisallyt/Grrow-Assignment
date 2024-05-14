import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
const UserRegister = () => {
  const navigateTo = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    profile: "",
    email: "",
    password: "",
    cpassword: "",
    acceptTerms: "",
  });

  const formDataSchema = z.object({
    username: z.string().min(3).max(25),
    name: z.string().min(3).max(25),
    email: z.string().email().max(25),
    password: z.string().min(8).max(25),
  });

  const handleFormData = async (e) => {
    e.preventDefault();

    try {
      const validatedData = formDataSchema.parse(formData);
      console.log(validatedData);
      if (!formData.acceptTerms) {
        alert("Please accept the terms and conditions.");
        return;
      }
      if (formData.password !== formData.cpassword) {
        alert("Passwords do not match.");
        return;
      }

      const { acceptTerms, cpassword, ...formDataToSend } = formData;

      console.log(formDataToSend);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      };

      const response = await fetch(
        `https://grrow-assignment.onrender.com/api/v1/user/signup`,
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));
      if (data.success === false) {
        alert(`${data.message}`);
      } else {
        navigateTo("/posts");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          alert(`${err.code}: ${err.message}`);
        });
      } else {
        alert("Validation failed. Please check your input.");
      }
    }
  };

  return (
    <section className="bg-gray-50  md:mt-[150px]">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleFormData}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="your email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Your username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      name: e.target.value,
                    }))
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-picture"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="profile-picture"
                  id="profile-picture"
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      profile: e.target.files[0],
                    }))
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm password *
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.cpassword}
                  onChange={(e) =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      cpassword: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                    checked={formData.acceptTerms}
                    onChange={(e) =>
                      setFormData((prevFormData) => ({
                        ...prevFormData,
                        acceptTerms: e.target.checked,
                      }))
                    }
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300">
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Create an account
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserRegister;

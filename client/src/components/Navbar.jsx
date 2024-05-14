import { useEffect, useState } from "react";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  let userData;
  let parsedData;
  useEffect(() => {
    userData = localStorage.getItem("user");
    console.log(userData);
    parsedData = JSON.parse(userData);
    console.log(parsedData);
  });
  return (
    <>
      <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://cdn.dribbble.com/users/735944/screenshots/2715201/logo-dribbble.jpg"
              className="h-16"
              alt="Flowbite Logo"
            />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {userData && (
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Sign Up
              </button>
            )}
            {/* {!userData && <img src={parsedData.profile} alt="" />} */}
            {userData && (
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-expanded={isSidebarOpen ? "true" : "false"}>
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
      {isSidebarOpen && userData && (
        <div className="fixed inset-0 flex z-30 justify-end">
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75"
            onClick={toggleSidebar}></div>
          <div className="relative flex flex-col w-64 bg-white dark:bg-gray-900 shadow-xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Menu
              </h2>
            </div>
            <div className="py-4">
              {/* s */}
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

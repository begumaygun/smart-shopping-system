import React from 'react';

const LoginPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-end pr-50"
      style={{ backgroundImage: "url('/rocket-bg.png')" }}
    >
      {/* Sağ taraf: Login form */}
      
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl h-[600px]">
          <h2 className="text-3xl font-bold text-purple-700 text-center">Sign In</h2>
          <p className="text-3sm text-center text-gray-500 mb-6">Welcome to ShopLens</p>

          <form className="flex flex-col justify-between h-[400px]">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-3 py-3 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            {/*<div className="flex justify-between text-sm text-gray-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-purple-500" />
                Remember me
              </label>
              <a href="#" className="text-purple-600 hover:underline">Forgot password?</a>
            </div>*/}

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition "
            >
              LOGIN
            </button>
          </form>

          {/*<div className="text-center text-sm text-gray-600 mt-4">
            Not a member? <span className="text-purple-600 cursor-pointer hover:underline">Create Account!</span>
          </div>*/}
        </div>
      </div>
    
  );
};

export default LoginPage;

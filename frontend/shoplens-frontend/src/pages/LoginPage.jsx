import React from 'react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-orange-500">Hoş Geldin!</h1>
          
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              placeholder="ornek@eposta.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-xl font-semibold hover:bg-orange-500 transition"
          >
            Giriş Yap
          </button>
        </form>

        {/*<p className="text-sm text-center text-gray-600">
          Hesabın yok mu? <a href="#" className="text-orange-500 font-semibold hover:underline">Kayıt ol</a>
        </p>*/}
      </div>
    </div>
  );
};

export default LoginPage;
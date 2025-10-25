import React from 'react'
import { Link } from 'react-router-dom'

const Opener = () => {
  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col">
      <header className="w-full shadow-md bg-yellow-200 px-4 sm:px-6 py-4 flex items-center justify-center">
        <h1 className="text-xl sm:text-2xl font-bold text-yellow-800">DictPie</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 py-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-yellow-800 mb-3 sm:mb-4">Welcome to DictPie Dashboard!</h2>
        <p className="text-sm sm:text-base md:text-lg text-yellow-700 mb-4 sm:mb-6 max-w-xl">
          You have to <span className="font-bold">Sign In</span> or <span className="font-bold">Login</span> to continue using the app.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link to="/signup">
            <button className="px-6 py-2 sm:py-3 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-base sm:text-lg w-full sm:w-auto">Sign In</button>
          </Link>
          <Link to="/login">
            <button className="px-6 py-2 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg w-full sm:w-auto">Login</button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Opener;

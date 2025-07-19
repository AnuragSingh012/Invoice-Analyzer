import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          InvoiceAI
        </Link>
        <div className="space-x-6 text-gray-700 font-medium">
          <Link to="/dashboard" className="hover:text-blue-600 transition duration-200">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

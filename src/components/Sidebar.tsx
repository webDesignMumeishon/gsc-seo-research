import React from 'react'

const Sidebar = () => {
    return (
        <div className="w-64 bg-white shadow-md">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-blue-600">SEO Tool</h1>
            </div>
            <nav className="mt-4">
                <a href="#" className="block py-2 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Dashboard</a>
                <a href="#" className="block py-2 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Keywords</a>
                <a href="#" className="block py-2 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Backlinks</a>
                <a href="#" className="block py-2 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Site Audit</a>
                <a href="#" className="block py-2 px-4 text-gray-600 hover:bg-blue-50 hover:text-blue-600">Reports</a>
            </nav>
        </div>
    )
}

export default Sidebar
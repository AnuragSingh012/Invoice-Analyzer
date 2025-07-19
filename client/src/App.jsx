import React from 'react'
import InvoiceUploader from './components/InvoiceUploader'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import { Routes, Route} from 'react-router'




const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<InvoiceUploader/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  )
}

export default App
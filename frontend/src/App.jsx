import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import FileUpload from './components/upload/FileUpload'
import UploadPage from './pages/UploadPage'
import ParametersPage from './pages/ParametersPage'
import EncryptionPage from './pages/EncryptionPage'
import DecryptionPage from './pages/DecryptionPage'
import AnalysisPage from './pages/AnalysisPage'
import TeamPage from './pages/TeamPage'
import AboutPage from './pages/AboutPage'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/parameters" element={<ParametersPage />} />
                    <Route path="/encryption" element={<EncryptionPage />} />
                    <Route path="/decryption" element={<DecryptionPage />} />
                    <Route path="/analysis" element={<AnalysisPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App

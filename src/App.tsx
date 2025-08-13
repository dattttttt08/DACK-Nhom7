import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css'
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from '../Server/Component/DefaultLayout';
import DangNhap from '../Server/Component/Login';
import DangKy from '../Server/Component/DangKy';
import DSBookUser from '../Server/Layout/DS-Book-User';  
import DSBookAdmin from '../Server/Layout/DS-Book-Admin'; // Sửa lại dòng này

function App() {
  return (
    <Routes>
      <Route path="/login" element={<DangNhap />} />
      <Route path="/dangky" element={<DangKy/>}/>
      <Route path="/ds-book-admin" element={<DSBookAdmin />} /> {/* Sửa lại dòng này */}
      <Route path="/ds-book-user" element={<DSBookUser />} />
      <Route path="/*" element={<DefaultLayout />} />
    </Routes>
  );
}

export default App;

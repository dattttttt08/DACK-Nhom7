import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from "./Header";
import Footer from './Footer';
import Home from "../Layout/Home";
import DSSach from "../Layout/DS-Book-Admin";
import UserProfile from "../Layout/UserProfile";
import { Routes, Route } from "react-router-dom";
import NotFound from './Not-Found';
import '../../src/App.css'


const DefaultLayout = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="" element={<Home />} />
                <Route path="Home" element={<Home/>} />
                <Route path ="ds-book" element={<DSSach/>}/>
                <Route path="user-profile" element={<UserProfile />} />
                <Route path="not-found" element={<NotFound/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
            <Footer />
        </> 
    );
};
export default DefaultLayout;
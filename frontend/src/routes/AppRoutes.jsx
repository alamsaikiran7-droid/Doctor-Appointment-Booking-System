import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Doctors from "../pages/Doctors";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/doctors" element={<Doctors />} />


                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="*" element={<NotFound />} />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;
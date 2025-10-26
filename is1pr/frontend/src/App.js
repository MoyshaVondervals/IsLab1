import './App.css';
import './styles/styles.css';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import {Button, ConfigProvider, notification, Space} from "antd";

import RegisterPage from "./components/pages/authorityPages/register-page";
import LoginPage from "./components/pages/authorityPages/login-page";
import Dragons from "./components/pages/Dragons";
import PrivateRoute from "./PrivateRoute";
import Header from "./components/headers/Header";
import WsEchoDemo from "./components/pages/RefsPage";
import DragonDetail from "./components/pages/DragonDetail";
import CoordinatesPage from "./components/pages/CoordinatesPage";
import CavesPage from "./components/pages/CavesPage";
import PersonsPage from "./components/pages/PersonsPage";
import LocationsPage from "./components/pages/LocationsPage";
import HeadsPage from "./components/pages/HeadsPage";
import DragonOperationsPage from "./components/pages/DragonOperationsPage";
import 'antd/dist/reset.css';



function App() {


    return (

            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#1f39a0",
                        colorSuccess: "#1fa038",
                        colorError: "#e3401b",
                    },
                }}
            >
                <div className="App">

                    <BrowserRouter>
                        <Header />

                        <Routes>

                            <Route path="/" element={<LoginPage />} />
                            <Route path="/auth/sign-up" element={<RegisterPage />} />
                            <Route path="/dragons" element={<PrivateRoute element={<Dragons />} />} />
                            <Route path="/dragons/:id" element={<PrivateRoute element={<DragonDetail />} />} />
                            <Route path="/refs" element={<PrivateRoute element={<WsEchoDemo />} />} />
                            <Route path="/coordinates" element={<PrivateRoute element={<CoordinatesPage />} />} />
                            <Route path="/caves" element={<PrivateRoute element={<CavesPage />} />} />
                            <Route path="/persons" element={<PrivateRoute element={<PersonsPage />} />} />
                            <Route path="/heads" element={<PrivateRoute element={<HeadsPage />} />} />
                            <Route path="/locations" element={<PrivateRoute element={<LocationsPage />} />} />
                            <Route path="/operations" element={<PrivateRoute element={<DragonOperationsPage />} />} />
                        </Routes>

                    </BrowserRouter>
                </div>
            </ConfigProvider>

    );
}

export default App;

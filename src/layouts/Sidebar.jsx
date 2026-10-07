import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import ModalLogout from "../components/layouts/ModalLogout";

import logo from "/src/assets/Logo Co-Living Pagul.png"
import {
    LayoutDashboard,
    BedDouble,
    Users,
    Wallet,
} from "lucide-react";

const menuItems = [
    { id: 1, name: "Dashboard", path: "/dashboard", icon: LayoutDashboard},
    { id: 2, name: "Kamar", path: "/kamar", icon: BedDouble},
    { id: 3, name: "Penghuni", path: "/penghuni", icon: Users},
    { id: 4, name: "Keuangan", path: "/keuangan", icon: Wallet, },
];

export default function Sidebar (){

    const navigate = useNavigate();
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const handleLogout = () => {

  // nanti jika memakai login session bisa dihapus disini
  // localStorage.removeItem("login");

navigate("/");
};

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col sticky top-0 h-screen shadow-2xl">
            {/*Header Logo*/ }
            <header>
            <div className="p-6 flex flex-col items-center border-b border-slate-800" >
            < img 
            src={logo} 
            alt="Logo Co-Living Pagul.png"
            className="h-16 w-auto mb-2"
            />
                <h1 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Pagul Co-Living</h1>
            </div>
            </header>
            {/* Menu*/}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (

                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span className="font-medium">
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer Sidebar */}
            <footer className="p-4 border-t border-slate-800"> 
                <button  
                onClick={() => setIsLogoutOpen(true)}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                    <LogOut size={20} />
                    <span>Keluar</span>
                </button>
            </footer>

            <ModalLogout
    isOpen={isLogoutOpen}
    onCancel={() => setIsLogoutOpen(false)}
    onConfirm={handleLogout}
/>

        </aside>
    );

}
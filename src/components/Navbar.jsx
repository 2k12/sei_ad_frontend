import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointRight } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const userEmail = decodedToken.email || "Usuario";

    const permissions = decodedToken.permissions || [];
    const gestionarPermissions = permissions
        .filter((permiso) => permiso.startsWith("Gestionar"))
        .map((permiso) => permiso.split(" ")[1]);

    const routes = {
        Dashboard: "/dashboard",
        Usuarios: "/users",
        Roles: "/roles",
        Modulos: "/modules",
        Permisos: "/permissions",
        Auditoria: "/audits",
    };

    const permissionDisplayNames = {
        Usuarios: "Usuarios",
        Roles: "Roles",
        Permisos: "Permisos",
        Modulos: "Módulos",
        Auditoria: "Auditoría",
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const drawerRef = useRef(null);
    const buttonRef = useRef(null);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isDrawerOpen &&
                drawerRef.current &&
                !drawerRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsDrawerOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isDrawerOpen]);

    const handlePermissionClick = (permiso) => {
        const route = routes[permiso];
        if (route) {
            setSelectedPermission(permiso);
            navigate(route);
            setIsDrawerOpen(false);
        }
    };

    return (
        <nav className="bg-gray-300 dark:bg-gray-800 text-black dark:text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <button
                    ref={buttonRef}
                    onClick={toggleDrawer}
                    className="mr-4 bg-transparent p-2 rounded"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
                <h1 className="text-sm font-normal">Bienvenido, {userEmail}</h1>
            </div>
            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium text-white"
            >
                Cerrar sesión
            </button>

            {/* Drawer */}
            <div
                ref={drawerRef}
                id="drawer"
                className={`fixed top-16 left-0 h-full w-48 bg-gray-300 dark:bg-gray-800 shadow-lg p-4 transition-transform duration-300 ${isDrawerOpen ? "transform translate-x-0" : "transform -translate-x-full"
                    }`}
            >
                <ul>
                    <li
                        className={`py-2 cursor-pointer rounded ${selectedPermission === "Dashboard"
                            ? "text-blue-500"
                            : "hover:text-blue-500 text-black dark:text-white"
                            }`}
                        onClick={() => handlePermissionClick("Dashboard")}
                    >
                        <FontAwesomeIcon icon={faHandPointRight} className="mr-2" />
                        Dashboard
                    </li>
                    {gestionarPermissions.map((permiso, index) => {
                        const displayName =
                            permissionDisplayNames[permiso] || permiso; 
                        return (
                            <li
                                key={index}
                                className={`py-2 cursor-pointer rounded ${permiso === selectedPermission
                                    ? "text-blue-500"
                                    : "hover:text-blue-500 text-black dark:text-white"
                                    }`}
                                onClick={() => handlePermissionClick(permiso)}
                            >
                                <FontAwesomeIcon
                                    icon={faHandPointRight}
                                    className="mr-2"
                                />
                                {displayName}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

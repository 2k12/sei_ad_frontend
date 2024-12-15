const Navbar = () => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const userEmail = decodedToken.email || "Usuario";

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; 
    };

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h1 className="text-sm font-normal">Bienvenido, {userEmail}</h1>
            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium"
            >
                Cerrar sesión
            </button>
        </nav>
    );
};

export default Navbar;

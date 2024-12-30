// Breadcrumbs.js
import { useLocation, Link } from "react-router-dom";
import { routeMap } from '../helpers/routeMap.js';

const Breadcrumbs = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Desglosa la ruta en partes
    const pathParts = currentPath.split("/").filter((part) => part);

    // Construye las rutas acumulativas
    const breadcrumbPaths = pathParts.map((part, index) => {
        const path = `/${pathParts.slice(0, index + 1).join("/")}`;
        return {
            path,
            label: routeMap[path] || capitalizeFirstLetter(part),
        };
    });

    // Capitaliza la primera letra en caso de rutas dinámicas no definidas en el mapa
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <nav className="flex items-center space-x-2 text-sm mt-16">
            {breadcrumbPaths.map((breadcrumb, index) => (
                <span key={breadcrumb.path} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {index === breadcrumbPaths.length - 1 ? (
                        <span className="text-gray-500">{breadcrumb.label}</span>
                    ) : (
                        <Link
                            to={breadcrumb.path}
                            className="text-blue-500 hover:underline"
                        >
                            {breadcrumb.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumbs;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 

function LoginPage() {
    const { login } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password); 
        } catch (err) {
            console.log(err);
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
            <form className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    Iniciar Sesión SECURITYService
                </h1>

                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email <span aria-label="email icon">📧</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Contraseña <span aria-label="key icon">🔑</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition duration-300"
                >
                    Ingresar
                </button>

                {error && (
                    <div className="mt-4 text-red-500 text-center">{error}</div>
                )}
            </form>
        </div>
    );
}

export default LoginPage;

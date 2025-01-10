// import { useState } from "react";
// import { reportApi } from "../api/axios";
// import { toast } from 'react-toastify';

// const ReportModal = ({ onClose }) => {
//     const [selectAll, setSelectAll] = useState(false);

//     const handleSubmit = async () => {
//         console.log("Generar reporte:", selectAll);
//         // const response = await fetch("/generate-report", {
//         //     method: "POST",
//         //     headers: { "Content-Type": "application/json" },
//         //     body: JSON.stringify({ all: selectAll }),
//         // });
//         try {
//             const response = await reportApi.generateReport({ all: selectAll });
//             console.log(response);
//             if (response.ok) {
//                 const blob = await response.blob();
//                 const url = window.URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.download = "reporte.docx";
//                 a.click();
//                 window.URL.revokeObjectURL(url);
//                 onClose();
//             } else {
//                 console.error("Error al generar el reporte:", response.statusText);
//                 toast.error('No se pudo generar el reporte.');

//             }
//         } catch (error) {
//             console.error("Error durante la solicitud:", error);
//             toast.error('Hubo un problema al generar el reporte.');

//         }

//     };

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                 <h2 className="text-xl font-semibold mb-4">Generar Reporte</h2>
//                 <div className="mb-4">
//                     <label className="flex items-center space-x-2">
//                         <input
//                             type="checkbox"
//                             checked={selectAll}
//                             onChange={(e) => setSelectAll(e.target.checked)}
//                             className="h-5 w-5"
//                         />
//                         <span>Todos los Usuarios</span>
//                     </label>
//                 </div>
//                 <div className="flex justify-end space-x-4">
//                     <button
//                         onClick={handleSubmit}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//                     >
//                         Generar
//                     </button>
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
//                     >
//                         Cerrar
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReportModal;
import { useState } from "react";
import { reportApi } from "../api/axios"; // Asegúrate de que este archivo esté configurado correctamente
import { toast } from 'react-toastify';

const ReportModal = ({ onClose }) => {
    const [selectAll, setSelectAll] = useState(false);

    // const handleSubmit = async () => {
    //     console.log("Generar reporte:", selectAll); // Esto debería ser un valor booleano
    //     try {
    //         const response = await reportApi.generateReport(selectAll, { responseType: 'blob' });

    //         if (response.status === 200) {
    //             const blob = response.data;



    //             // Verifica si `blob` es una instancia de Blob
    //             if (!(blob instanceof Blob)) {
    //                 throw new Error('La respuesta no es un Blob válido.');
    //             }

    //             const url = window.URL.createObjectURL(blob);
    //             const a = document.createElement("a");
    //             a.href = url;
    //             a.download = "reporte.pdf";
    //             a.click();
    //             window.URL.revokeObjectURL(url);
    //             onClose(); // Cierra el modal
    //         } else {
    //             console.error("Error al generar el reporte:", response.statusText);
    //             toast.error('No se pudo generar el reporte.');
    //         }
    //     } catch (error) {
    //         console.error("Error durante la solicitud:", error);
    //         toast.error('Hubo un problema al generar el reporte.');
    //     }
    // };


    const handleSubmit = async () => {
        try {
            // Llama a la función `generateReport` de `reportApi`
            const response = await reportApi.generateReport(selectAll);
    
            if (response.status === 200) {
                // Crea un Blob a partir de la respuesta.
                const blob = new Blob([response.data], { type: "application/pdf" });
    
                // Verifica si el Blob es válido.
                if (!(blob instanceof Blob)) {
                    throw new Error("La respuesta no es un Blob válido.");
                }
    
                // Genera la URL para la descarga del archivo.
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "reporte.pdf"; // Nombre del archivo.
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
    
                toast.success("Reporte generado exitosamente.");
                onClose(); // Cierra el modal si es necesario.
            } else {
                console.error("Error al generar el reporte:", response.statusText);
                toast.error("No se pudo generar el reporte.");
            }
        } catch (error) {
            console.error("Error durante la solicitud:", error);
            toast.error("Hubo un problema al generar el reporte.");
        }
    };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Generar Reporte</h2>
                <div className="mb-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={(e) => setSelectAll(e.target.checked)}
                            className="h-5 w-5"
                        />
                        <span>Todos los Usuarios</span>
                    </label>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Generar
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;

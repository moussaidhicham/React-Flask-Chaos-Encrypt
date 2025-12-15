import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ onFileSelect }) => {
    const [preview, setPreview] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [fileName, setFileName] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setFileType(file.type);
            setFileName(file.name);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/tiff': ['.tif', '.tiff'],
            'image/bmp': ['.bmp']
        },
        maxFiles: 1
    });

    const removeFile = (e) => {
        e.stopPropagation();
        setPreview(null);
        setFileType(null);
        setFileName('');
        onFileSelect(null);
    }

    const isPreviewable = (type) => {
        return type && (type.includes('png') || type.includes('jpeg') || type.includes('bmp') || type.includes('webp'));
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 cursor-pointer overflow-hidden
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-gray-400 hover:bg-white/5'}
                `}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode='wait'>
                    {preview ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 flex flex-col items-center"
                        >
                            <div className="relative group">
                                {isPreviewable(fileType) ? (
                                    <img src={preview} alt="Preview" className="h-64 object-contain rounded-lg shadow-2xl" />
                                ) : (
                                    <div className="h-64 w-64 bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4 border border-gray-700 shadow-2xl text-center">
                                        <FileType size={64} className="text-gray-400 mb-4" />
                                        <p className="text-gray-200 font-semibold break-all">{fileName}</p>
                                        <p className="text-xs text-gray-500 mt-2">(Prévisualisation non disponible pour ce format)</p>
                                    </div>
                                )}

                                <button
                                    onClick={removeFile}
                                    className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-success">
                                <CheckCircle size={20} />
                                <span className="font-medium">Image chargée avec succès</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-gray-800 text-gray-400'}`}>
                                <Upload size={40} />
                            </div>
                            <div>
                                <p className="text-xl font-semibold text-gray-200">
                                    {isDragActive ? "Déposez l'image ici" : "Glissez & Déposez une image"}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    PNG, JPG, BMP, TIFF supportés
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FileUpload;

"use client";

import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";

interface FileUploaderProps {
    onUploadComplete: (fileUrl: string, thumbnailUrl: string) => void;
    accept?: string;
}

export default function FileUploader({ onUploadComplete, accept }: FileUploaderProps) {
    const { edgestore } = useEdgeStore();
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            try {
                const res = await edgestore.myPublicImages.upload({
                    file: selectedFile,
                    onProgressChange: (prog) => {
                        setProgress(prog);
                    },
                });
                // Notify parent component that the upload is complete:
                onUploadComplete(res.url, res.thumbnailUrl);
            } catch (error) {
                console.error("File upload failed:", error);
            }
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                accept={accept || ".pdf,.doc,.docx,.png"}
                className="mt-1 block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {file && (
                <p className="mt-2 text-xs text-green-600">Обрано файл: {file.name}</p>
            )}
            {progress > 0 && (
                <div className="h-[6px] w-full rounded bg-gray-500 mt-2">
                    <div
                        className="h-full bg-green-400 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}

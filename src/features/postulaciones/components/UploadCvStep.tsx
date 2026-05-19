import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Card } from "../../../components/ui";
import { useUploadCvMutation } from "../hooks/postulacion.hooks";

const maxSize = 10 * 1024 * 1024; // 10MB

type UploadCvStepProps = {
  postulacionId: number;
  onUploadComplete: () => void;
};

export function UploadCvStep({
  postulacionId,
  onUploadComplete,
}: UploadCvStepProps) {
  const [error, setError] = useState<string | null>(null);
  const uploadMutation = useUploadCvMutation(postulacionId);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setError(null);
      uploadMutation.mutate(acceptedFiles[0], {
        onSuccess: () => onUploadComplete(),
        onError: (err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Error al procesar el archivo";
          setError(message);
        },
      });
    },
    [uploadMutation, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      maxSize,
      multiple: false,
      onDrop,
    });

  const rejectionError = fileRejections[0]?.errors[0]?.message;

  return (
    <Card className="mt-4">
      <h3 className="text-lg font-semibold text-ink">
        Cargar hoja de vida
      </h3>
      <p className="mt-2 text-sm text-gray-600">
        Arrastra tu hoja de vida aqui o haz clic para seleccionarla.
        Solo se aceptan archivos PDF de maximo 10 MB.
      </p>

      <div
        {...getRootProps()}
        className={[
          "mt-4 flex min-h-48 flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-8 text-center transition",
          isDragActive
            ? "border-brand-700 bg-brand-50"
            : "border-gray-300 bg-gray-50",
          uploadMutation.isPending ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />
        {uploadMutation.isPending ? (
          <p className="text-sm text-brand-700">
            Procesando hoja de vida con IA...
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            {isDragActive
              ? "Suelta el archivo aqui"
              : "Arrastra o haz clic para seleccionar"}
          </p>
        )}
      </div>

      {rejectionError && (
        <p className="mt-3 text-sm text-red-600">{rejectionError}</p>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </Card>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import { Upload, FileText, Trash2, Image, File } from "lucide-react";
import type { Document } from "@studeo/shared";
import { DOCUMENT_TYPE_LABELS } from "@studeo/shared";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("RECEIPT");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get<{ data: Document[] }>("/documents")
      .then((r) => setDocuments(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", docType);
      const res = await api.upload<{ data: Document }>("/documents/upload", formData);
      setDocuments((prev) => [res.data, ...prev]);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce document ?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Documents</h1>

      {/* Upload area */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex-1">
            <label className="label">Type de document</label>
            <select className="input" value={docType} onChange={(e) => setDocType(e.target.value)}>
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*,.pdf" onChange={onFileChange} />
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Upload en cours..." : "Ajouter un document"}
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Formats acceptés : JPEG, PNG, WebP, PDF, HEIC. Max 10 MB.</p>
      </div>

      {/* Document grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Aucun document</p>
          <p className="text-sm mt-1">Ajoute tes fiches de paie, reçus et contrats ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="card flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {doc.fileName.match(/\.(jpg|jpeg|png|webp|heic)$/i) ? (
                  <Image className="w-5 h-5 text-gray-500" />
                ) : (
                  <File className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                <p className="text-xs text-gray-500">{DOCUMENT_TYPE_LABELS[doc.type] || doc.type}</p>
                <p className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString("fr-BE")}</p>
              </div>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

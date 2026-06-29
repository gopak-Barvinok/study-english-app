import type { CertificateFile } from "@/types/c-types";

type AddCertificateProps = {
  certificate: CertificateFile;
  onChange: (field: keyof CertificateFile, value: string | File | null) => void;
};

export default function CertificateComponent({ certificate, onChange }: AddCertificateProps) {
  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl p-6 space-y-4 animate-fade-in">
      <div className="space-y-1">
        <label className="text-sm text-base-content/60 font-medium">Year</label>
        <input
          type="number"
          value={certificate.year}
          className="input input-bordered w-full"
          onChange={(e) => onChange("year", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-base-content/60 font-medium">Certificate name</label>
        <input
          type="text"
          value={certificate.name}
          placeholder="Name of your certificate"
          className="input input-bordered w-full"
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-base-content/60 font-medium">Description</label>
        <textarea
          value={certificate.description}
          placeholder="Briefly describe this certificate"
          className="textarea textarea-bordered w-full"
          rows={3}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-base-content/60 font-medium">PDF scan</label>
        {typeof certificate.scan === "string" ? (
          <iframe src={certificate.scan} width="100%" height="400px" className="rounded-xl border border-base-300" />
        ) : (
          <input
            type="file"
            accept=".pdf"
            className="file-input file-input-bordered w-full"
            onChange={(e) => onChange("scan", e.target.files?.[0] ?? null)}
          />
        )}
      </div>
    </div>
  );
}

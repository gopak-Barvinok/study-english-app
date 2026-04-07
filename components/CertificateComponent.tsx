import type { CertificateFile } from "@/types/c-types";

type AddCertificateProps = {
  certificate: CertificateFile;
  onChange: (field: keyof CertificateFile, value: string | File | null) => void;
}

export default function CertificateComponent({ certificate, onChange }: AddCertificateProps) {
  return (
    <div>
      <div>
        <p>Year</p>
          <input
            type="number"
            value={certificate.year}
            className="input"
            onChange={(e) => onChange("year", e.target.value)}
          />
      </div>
      <div>
        <p>Name of certificate</p>
        <input
          type="text"
          value={certificate.name}
          placeholder="Name of your certificate"
          className="input"
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      <div>
        <p>Description</p>
        <textarea
          value={certificate.description}
          placeholder="Leave a comment"
          className="textarea textarea-info"
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div>
        <p>Add the PDF-scans of your certificate</p>
        {typeof certificate.scan === "string" ? (
          <iframe src={certificate.scan} width="100%" height="600px" />
        ) : (
          <input
            type="file"
            className="file-input"
            onChange={(e) => onChange("scan", e.target.files?.[0] ?? null)}
          />
        )}
      </div>
    </div>
  )
}
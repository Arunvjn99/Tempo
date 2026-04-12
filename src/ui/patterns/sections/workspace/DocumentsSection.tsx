import { FormSection } from "@/ui/patterns";
import type { ProfileDocumentRow } from "./profileTypes";

export function DocumentsSection({ documents }: { documents: ProfileDocumentRow[] }) {
  return (
    <section id="documents">
      <FormSection title="Documents">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default text-left text-xs text-secondary">
                <th className="pb-sm pr-md font-medium">Document</th>
                <th className="pb-sm pr-md font-medium">Date</th>
                <th className="pb-sm font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.name} className="border-b border-default/50">
                  <td className="py-sm pr-md font-medium text-primary">{doc.name}</td>
                  <td className="py-sm pr-md text-secondary">{doc.date}</td>
                  <td className="py-sm">
                    <span className="rounded bg-surface px-xs py-0.5 text-xs text-secondary">{doc.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FormSection>
    </section>
  );
}

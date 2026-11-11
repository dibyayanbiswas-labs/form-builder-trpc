import { FormPreview } from "~/components/form-preview";
import { SiteHeader } from "~/components/site-header";

export default async function FormPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <SiteHeader title="Form preview" />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <FormPreview formId={id} />
      </div>
    </>
  );
}

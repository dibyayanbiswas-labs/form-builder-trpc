import { SiteHeader } from "~/components/site-header";
import { FormFieldsBuilder } from "~/components/form-fields-builder";

export default async function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <SiteHeader title="Form Builder" />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <FormFieldsBuilder formId={id} />
      </div>
    </>
  );
}

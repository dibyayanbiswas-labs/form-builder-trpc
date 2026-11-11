import { FormSubmissionsTable } from "~/components/form-submissions-table";
import { SiteHeader } from "~/components/site-header";

export default async function FormSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <SiteHeader title="Form submissions" />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <div>
          <h2 className="text-2xl font-semibold">Form submissions</h2>
          <p className="text-muted-foreground">View the responses submitted to this form.</p>
        </div>
        <FormSubmissionsTable formId={id} />
      </div>
    </>
  );
}

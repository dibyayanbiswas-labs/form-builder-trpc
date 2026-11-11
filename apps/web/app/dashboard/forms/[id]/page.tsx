import { SiteHeader } from "~/components/site-header";

export default async function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <SiteHeader title="Form Builder" />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <h2 className="text-2xl font-semibold">Form builder</h2>
        <p className="text-muted-foreground">
          Editing form <span className="font-mono">{id}</span>
        </p>
      </div>
    </>
  );
}

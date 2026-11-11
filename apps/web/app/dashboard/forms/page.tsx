import { SiteHeader } from "~/components/site-header";
import { CreateFormDialog } from "~/components/create-form-dialog";
import { FormsTable } from "~/components/forms-table";

export default function FormsPage() {
  return (
    <>
      <SiteHeader title="Forms" />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Forms</h2>
            <p className="text-muted-foreground">Create and manage your forms here.</p>
          </div>
          <CreateFormDialog />
        </div>
        <FormsTable />
      </div>
    </>
  );
}

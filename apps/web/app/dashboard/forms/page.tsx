import { SiteHeader } from "~/components/site-header"

export default function FormsPage() {
  return (
    <>
      <SiteHeader title="Forms" />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <h2 className="text-2xl font-semibold">Forms</h2>
        <p className="text-muted-foreground">
          Create and manage your forms here.
        </p>
      </div>
    </>
  )
}

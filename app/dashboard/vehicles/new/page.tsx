import { PageShell } from "@/components/master-data/PageShell"
import { VehiclePlateForm } from "@/components/master-data/VehiclePlateForm"
import { requireAdminAccess } from "@/lib/auth-service"

export default async function NewVehiclePage() {
  await requireAdminAccess()

  return (
    <PageShell
      title="新增车牌"
      description="维护可调度的车牌、车辆类型、所属车队和保险到期时间。"
    >
      <VehiclePlateForm backHref="/dashboard/vehicles" />
    </PageShell>
  )
}

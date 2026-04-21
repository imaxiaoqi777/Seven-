import { NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

import { auth } from "@/lib/auth-config"
import {
  LOAD_EXPORT_COLUMN_OPTIONS,
  normalizeLoadExportColumnKeys,
  type LoadExportColumnKey,
} from "@/lib/loads/export-columns"
import { getLoadExportList } from "@/lib/loads/queries"
import {
  formatLoadDateTimeLabel,
  getLoadStatusLabel,
  resolveLoadListFilters,
} from "@/lib/loads/utils"
import { hasPermission } from "@/lib/permissions"
import { getUserRoleLabel } from "@/lib/users/utils"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type LoadExportItem = Awaited<ReturnType<typeof getLoadExportList>>[number]

function formatDateTime(value: Date) {
  return value.toLocaleString("zh-CN")
}

function formatDate(value?: Date | null) {
  return value ? value.toLocaleDateString("zh-CN") : ""
}

const columnValueGetters: Record<LoadExportColumnKey, (item: LoadExportItem) => string | number> = {
  loadNumber: (item) => item.loadNumber,
  status: (item) => getLoadStatusLabel(item.status),
  pickupAt: (item) => formatLoadDateTimeLabel(item.pickupAt),
  destination: (item) => item.destination,
  companyName: (item) => item.company?.name ?? "",
  companySocialCreditCode: (item) => item.company?.socialCreditCode ?? "",
  companyContactName: (item) => item.company?.contactName ?? "",
  companyContactPhone: (item) => item.company?.contactPhone ?? "",
  blNumber: (item) => item.blNumber,
  vesselVoyage: (item) => item.vesselVoyage ?? "",
  containerTypeName: (item) => item.containerType.name,
  containerNumber: (item) => item.containerNumber,
  sealNumber: (item) => item.sealNumber ?? "",
  dropLocationName: (item) => item.dropLocation.name,
  dropLocationAddress: (item) => item.dropLocation.fullAddress,
  vehiclePlate: (item) => item.vehicle.plateNumber,
  vehicleInsuranceExpiresAt: (item) => formatDate(item.vehicle.insuranceExpiresAt),
  driverName: (item) => item.driver.name,
  driverPhone: (item) => item.driver.phone,
  operatorUsername: (item) => item.operatorUser.username,
  operatorRole: (item) => getUserRoleLabel(item.operatorUser.role),
  totalFee: (item) => Number(item.totalFee),
  gasFee: (item) => Number(item.gasFee),
  driverPay: (item) => Number(item.driverPay),
  otherFee: (item) => Number(item.otherFee),
  otherFeeRemark: (item) => item.otherFeeRemark ?? "",
  balanceFee: (item) => Number(item.balanceFee),
  remark: (item) => item.remark ?? "",
  createdAt: (item) => formatDateTime(item.createdAt),
  updatedAt: (item) => formatDateTime(item.updatedAt),
}

function buildFileName() {
  const now = new Date()
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("")
  const timePart = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("")

  return `运单导出-${datePart}-${timePart}.xlsx`
}

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session.user.status === "DISABLED") {
    return NextResponse.redirect(new URL("/login?notice=disabled", request.url))
  }

  if (!hasPermission(session.user.role, "loads")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  const filters = resolveLoadListFilters({
    loadNumber: request.nextUrl.searchParams.get("loadNumber"),
    companyIds: request.nextUrl.searchParams.getAll("companyIds"),
    containerTypeIds: request.nextUrl.searchParams.getAll("containerTypeIds"),
    blNumber: request.nextUrl.searchParams.get("blNumber"),
    driverIds: request.nextUrl.searchParams.getAll("driverIds"),
    vehicleIds: request.nextUrl.searchParams.getAll("vehicleIds"),
    dateFrom: request.nextUrl.searchParams.get("dateFrom"),
    dateTo: request.nextUrl.searchParams.get("dateTo"),
  })

  const items = await getLoadExportList({
    filters,
    currentUserId: session.user.id,
    currentUserRole: session.user.role,
  })
  const selectedColumnKeys = normalizeLoadExportColumnKeys(
    request.nextUrl.searchParams.getAll("columns")
  )
  const selectedColumns = selectedColumnKeys.map((key) => {
    return LOAD_EXPORT_COLUMN_OPTIONS.find((column) => column.key === key)!
  })

  const worksheet = XLSX.utils.aoa_to_sheet([
    selectedColumns.map((column) => column.label),
    ...items.map((item) =>
      selectedColumns.map((column) => columnValueGetters[column.key](item))
    ),
  ])

  worksheet["!cols"] = selectedColumns.map((column) => ({ wch: column.width }))

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "运单列表")

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  }) as Buffer
  const bytes = new Uint8Array(buffer)

  const fileName = buildFileName()

  return new NextResponse(bytes, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "no-store",
    },
  })
}

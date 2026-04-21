import { LoadStatus, Prisma, RecordStatus, Role } from "@prisma/client"

import { prisma } from "@/lib/db"

const INSURANCE_EXPIRY_REMINDER_DAYS = 10
const DAY_MS = 24 * 60 * 60 * 1000
const DASHBOARD_STATUS_ORDER = [
  LoadStatus.DRAFT,
  LoadStatus.ASSIGNED,
  LoadStatus.IN_TRANSIT,
  LoadStatus.DELIVERED,
  LoadStatus.COMPLETED,
  LoadStatus.CANCELLED,
]

function getAccessibleLoadWhere(currentUserId: string, currentUserRole: Role) {
  if (currentUserRole === Role.ADMIN) {
    return {}
  }

  return {
    operatorUserId: currentUserId,
  }
}

function getAccessibleVehicleWhere(
  currentUserId: string,
  currentUserRole: Role
): Prisma.VehiclePlateWhereInput {
  const enabledVehicleWhere = {
    status: RecordStatus.ENABLED,
  }

  if (currentUserRole === Role.ADMIN) {
    return enabledVehicleWhere
  }

  return {
    ...enabledVehicleWhere,
    loads: {
      some: {
        operatorUserId: currentUserId,
      },
    },
  }
}

function toNumber(value: { toString(): string } | number | null | undefined) {
  if (value === null || value === undefined) {
    return 0
  }

  return Number(value)
}

function getDateStart(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

export async function getDashboardOverview(currentUserId: string, currentUserRole: Role) {
  const now = new Date()
  const todayStart = getDateStart(now)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const accessibleLoadWhere = getAccessibleLoadWhere(currentUserId, currentUserRole)
  const accessibleVehicleWhere = getAccessibleVehicleWhere(currentUserId, currentUserRole)

  const [totalLoads, monthLoads, activeVehicleRows, recentLoads, statusGroups, feeAggregate] =
    await Promise.all([
      prisma.load.count({ where: accessibleLoadWhere }),
      prisma.load.count({
        where: {
          ...accessibleLoadWhere,
          createdAt: {
            gte: monthStart,
            lt: nextMonthStart,
          },
        },
      }),
      prisma.vehiclePlate.findMany({
        where: accessibleVehicleWhere,
        orderBy: [{ plateNumber: "asc" }],
        select: {
          id: true,
          plateNumber: true,
          insuranceExpiresAt: true,
        },
      }),
      prisma.load.findMany({
        where: accessibleLoadWhere,
        orderBy: [{ updatedAt: "desc" }],
        take: 6,
        select: {
          id: true,
          loadNumber: true,
          destination: true,
          status: true,
          updatedAt: true,
          vehicle: {
            select: {
              plateNumber: true,
            },
          },
          operatorUser: {
            select: {
              username: true,
            },
          },
        },
      }),
      prisma.load.groupBy({
        by: ["status"],
        where: accessibleLoadWhere,
        _count: {
          status: true,
        },
      }),
      prisma.load.aggregate({
        where: accessibleLoadWhere,
        _sum: {
          totalFee: true,
          gasFee: true,
          driverPay: true,
          otherFee: true,
          balanceFee: true,
        },
      }),
    ])

  const statusCountMap = new Map(statusGroups.map((item) => [item.status, item._count.status]))
  const insuranceExpiryReminders = activeVehicleRows
    .filter((vehicle) => {
      if (!vehicle.insuranceExpiresAt) {
        return false
      }

      const expiryDate = getDateStart(vehicle.insuranceExpiresAt)
      const daysLeft = Math.ceil((expiryDate.getTime() - todayStart.getTime()) / DAY_MS)

      return daysLeft < INSURANCE_EXPIRY_REMINDER_DAYS
    })
    .sort((a, b) => {
      const aTime = a.insuranceExpiresAt?.getTime() ?? 0
      const bTime = b.insuranceExpiresAt?.getTime() ?? 0
      return aTime - bTime
    })
    .map((vehicle) => {
      const expiryDate = vehicle.insuranceExpiresAt ? getDateStart(vehicle.insuranceExpiresAt) : null
      const daysLeft = expiryDate
        ? Math.ceil((expiryDate.getTime() - todayStart.getTime()) / DAY_MS)
        : null

      return {
        id: vehicle.id,
        plateNumber: vehicle.plateNumber,
        insuranceExpiresAt: vehicle.insuranceExpiresAt,
        daysLeft,
      }
    })

  return {
    totalLoads,
    monthLoads,
    activeVehicleCount: activeVehicleRows.length,
    insuranceExpiryReminders,
    balanceFeeTotal: toNumber(feeAggregate._sum.balanceFee),
    feeSummary: {
      totalFee: toNumber(feeAggregate._sum.totalFee),
      gasFee: toNumber(feeAggregate._sum.gasFee),
      driverPay: toNumber(feeAggregate._sum.driverPay),
      otherFee: toNumber(feeAggregate._sum.otherFee),
      balanceFee: toNumber(feeAggregate._sum.balanceFee),
    },
    recentLoads,
    statusSummary: DASHBOARD_STATUS_ORDER.map((status) => ({
      status,
      count: statusCountMap.get(status) ?? 0,
    })),
  }
}

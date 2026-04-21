export const LOAD_EXPORT_COLUMN_OPTIONS = [
  { key: "loadNumber", label: "运单号", width: 20 },
  { key: "status", label: "状态", width: 12 },
  { key: "pickupAt", label: "提箱时间", width: 20 },
  { key: "destination", label: "目的地", width: 28 },
  { key: "companyName", label: "公司名称", width: 24 },
  { key: "companySocialCreditCode", label: "统一社会信用代码", width: 24 },
  { key: "companyContactName", label: "联系人", width: 14 },
  { key: "companyContactPhone", label: "联系电话", width: 16 },
  { key: "blNumber", label: "卸货箱号", width: 20 },
  { key: "vesselVoyage", label: "装货地址", width: 20 },
  { key: "containerTypeName", label: "箱型", width: 14 },
  { key: "containerNumber", label: "装货箱号", width: 18 },
  { key: "sealNumber", label: "封号", width: 18 },
  { key: "dropLocationName", label: "落箱地点", width: 20 },
  { key: "dropLocationAddress", label: "落箱地址", width: 36 },
  { key: "vehiclePlate", label: "车牌号", width: 16 },
  { key: "vehicleInsuranceExpiresAt", label: "车辆保险到期时间", width: 18 },
  { key: "driverName", label: "司机", width: 14 },
  { key: "driverPhone", label: "司机电话", width: 16 },
  { key: "operatorUsername", label: "操作人员", width: 16 },
  { key: "operatorRole", label: "操作人员角色", width: 16 },
  { key: "totalFee", label: "总运费", width: 12 },
  { key: "gasFee", label: "燃气费", width: 12 },
  { key: "driverPay", label: "司机工资", width: 12 },
  { key: "otherFee", label: "其他费用", width: 12 },
  { key: "otherFeeRemark", label: "其他费用说明", width: 24 },
  { key: "balanceFee", label: "结余", width: 12 },
  { key: "remark", label: "备注", width: 28 },
  { key: "createdAt", label: "创建时间", width: 20 },
  { key: "updatedAt", label: "修改时间", width: 20 },
] as const

export type LoadExportColumnKey = (typeof LOAD_EXPORT_COLUMN_OPTIONS)[number]["key"]

const EXPORT_COLUMN_KEY_SET = new Set<string>(
  LOAD_EXPORT_COLUMN_OPTIONS.map((column) => column.key)
)

export function normalizeLoadExportColumnKeys(values: string[]) {
  const selectedKeys = Array.from(
    new Set(values.filter((value) => EXPORT_COLUMN_KEY_SET.has(value)))
  ) as LoadExportColumnKey[]

  return selectedKeys.length > 0
    ? selectedKeys
    : LOAD_EXPORT_COLUMN_OPTIONS.map((column) => column.key)
}

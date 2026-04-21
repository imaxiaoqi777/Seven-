"use client"

import { Download, FileSpreadsheet, X } from "lucide-react"
import { useState } from "react"

import { LOAD_EXPORT_COLUMN_OPTIONS } from "@/lib/loads/export-columns"
import type { LoadExportColumnKey } from "@/lib/loads/export-columns"
import type { LoadListFilters } from "@/lib/loads/types"

type LoadExportDialogProps = {
  filters: LoadListFilters
}

const allColumnKeys = LOAD_EXPORT_COLUMN_OPTIONS.map((column) => column.key)

function appendValues(searchParams: URLSearchParams, name: string, values: string[]) {
  values.forEach((value) => {
    if (value) {
      searchParams.append(name, value)
    }
  })
}

function buildExportHref(filters: LoadListFilters, selectedColumns: LoadExportColumnKey[]) {
  const searchParams = new URLSearchParams()

  if (filters.loadNumber) {
    searchParams.set("loadNumber", filters.loadNumber)
  }

  if (filters.blNumber) {
    searchParams.set("blNumber", filters.blNumber)
  }

  if (filters.dateFrom) {
    searchParams.set("dateFrom", filters.dateFrom)
  }

  if (filters.dateTo) {
    searchParams.set("dateTo", filters.dateTo)
  }

  appendValues(searchParams, "companyIds", filters.companyIds)
  appendValues(searchParams, "containerTypeIds", filters.containerTypeIds)
  appendValues(searchParams, "driverIds", filters.driverIds)
  appendValues(searchParams, "vehicleIds", filters.vehicleIds)
  appendValues(searchParams, "columns", selectedColumns)

  const query = searchParams.toString()
  return query ? `/dashboard/loads/export?${query}` : "/dashboard/loads/export"
}

export function LoadExportDialog({ filters }: LoadExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<LoadExportColumnKey[]>(allColumnKeys)
  const allSelected = selectedColumns.length === allColumnKeys.length

  function toggleColumn(columnKey: LoadExportColumnKey, checked: boolean) {
    setSelectedColumns((current) => {
      if (checked) {
        return current.includes(columnKey) ? current : [...current, columnKey]
      }

      return current.filter((value) => value !== columnKey)
    })
  }

  function downloadExport() {
    if (selectedColumns.length === 0) {
      return
    }

    const anchor = document.createElement("a")
    anchor.href = buildExportHref(filters, selectedColumns)
    anchor.rel = "noopener"
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
      >
        <Download className="h-4 w-4" />
        下载 Excel
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-gray-900/45 px-4 py-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setOpen(false)
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="load-export-title"
            className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="load-export-title" className="text-lg font-semibold text-gray-900">
                    导出 Excel
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">选择需要导出的表头</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="关闭"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => {
                      setSelectedColumns(event.target.checked ? allColumnKeys : [])
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  全部
                </label>

                {LOAD_EXPORT_COLUMN_OPTIONS.map((column) => (
                  <label
                    key={column.key}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      name="columns"
                      value={column.key}
                      checked={selectedColumns.includes(column.key)}
                      onChange={(event) => {
                        toggleColumn(column.key, event.target.checked)
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {column.label}
                  </label>
                ))}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedColumns(allColumnKeys)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  选择全部
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={downloadExport}
                  disabled={selectedColumns.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Download className="h-4 w-4" />
                  导出文件
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

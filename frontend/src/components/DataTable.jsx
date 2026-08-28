import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

export default function DataTable({ 
  columns, 
  data, 
  keyField = 'id',
  searchable = false,
  onRowClick,
  rowClassName,
  emptyText = 'No data available'
}) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 20

  const filtered = searchable && search 
    ? data.filter(row => 
        columns.some(col => 
          String(row[col.key] || '').toLowerCase().includes(search.toLowerCase())
        )
      )
    : data

  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize)

  return (
    <div className="wuzen-panel overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-wuzen-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wuzen-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              className="wuzen-input w-full pl-10"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="wuzen-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className={col.width ? `w-${col.width}` : ''}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-wuzen-muted">
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginated.map(row => (
                <tr 
                  key={row[keyField]} 
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? 'cursor-pointer' : ''} ${rowClassName?.(row) || ''}`}
                >
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-wuzen-border">
          <span className="text-xs text-wuzen-muted">
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1 rounded hover:bg-wuzen-card disabled:opacity-30 text-wuzen-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-wuzen-muted px-2">{page + 1} / {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1 rounded hover:bg-wuzen-card disabled:opacity-30 text-wuzen-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

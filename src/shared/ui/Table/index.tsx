import React from "react"

interface TableProps {
  children: React.ReactNode
}

export const Table: React.FC<TableProps> = ({ children }) => {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">{children}</table>
    </div>
  )
}

export const TableHeader: React.FC<TableProps> = ({ children }) => {
  return <thead>{children}</thead>
}

export const TableBody: React.FC<TableProps> = ({ children }) => {
  return <tbody>{children}</tbody>
}

export const TableRow: React.FC<TableProps> = ({ children }) => {
  return <tr className="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50">{children}</tr>
}

export const TableHead: React.FC<TableProps & { className?: string }> = ({ children, className }) => {
  return <th className={`h-12 px-4 text-left align-middle font-medium ${className || ""}`}>{children}</th>
}

export const TableCell: React.FC<TableProps> = ({ children }) => {
  return <td className="p-4 align-middle">{children}</td>
}

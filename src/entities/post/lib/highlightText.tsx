import React from "react"

export const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query) return text

  const parts = text.split(new RegExp(`(${query})`, "gi"))

  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <mark key={index} className="bg-yellow-200">
          {part}
        </mark>
      )
    }
    return part
  })
}

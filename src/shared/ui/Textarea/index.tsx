import * as React from "react"
import { forwardRef } from "react"

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

/**
 * @param {object[string, object[string, string, React.TextareaHTMLAttributes<HTMLTextAreaElement>]]} props
 * @property {string} props.className - 텍스트 입력 영역에 적용할 클래스 이름
 * @property {React.TextareaHTMLAttributes<HTMLTextAreaElement>} props - 텍스트 입력 영역에 적용할 속성
 * @property {React.Ref<HTMLTextAreaElement>} ref - 텍스트 입력 영역에 적용할 참조
 * @returns 텍스트 입력 영역 컴포넌트
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[150px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

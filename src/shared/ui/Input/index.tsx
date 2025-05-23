import * as React from "react"
import { forwardRef } from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

/**
 * @param {object[string, string, React.Ref<HTMLInputElement>]} props
 * @property {string} props.className - 인풋에 적용할 클래스 이름
 * @property {string} props.type - 인풋의 타입
 * @property {React.Ref<HTMLInputElement>} props.ref - 인풋에 적용할 참조
 * @returns 인풋 컴포넌트
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

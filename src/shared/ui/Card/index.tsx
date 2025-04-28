import * as React from "react"
import { forwardRef } from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

/**
 * @param className - 카드에 적용할 클래스 이름
 * @param props - 카드에 적용할 속성
 * @param ref - 카드에 적용할 참조
 * @returns 카드 컴포넌트
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ""}`} {...props} />
))
Card.displayName = "Card"

/**
 * @param className - 카드 헤더에 적용할 클래스 이름
 * @param props - 카드 헤더에 적용할 속성
 * @param ref - 카드 헤더에 적용할 참조
 * @returns 카드 헤더 컴포넌트
 */
export const CardHeader = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col space-y-1.5 p-6 ${className || ""}`} {...props} />
))
CardHeader.displayName = "CardHeader"

/**
 * @param className - 카드 타이틀에 적용할 클래스 이름
 * @param props - 카드 타이틀에 적용할 속성
 * @param ref - 카드 타이틀에 적용할 참조
 * @returns 카드 타이틀 컴포넌트
 */
export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={`text-2xl font-semibold leading-none tracking-tight ${className || ""}`} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

/**
 * @param className - 카드 컨텐츠에 적용할 클래스 이름
 * @param props - 카드 컨텐츠에 적용할 속성
 * @param ref - 카드 컨텐츠에 적용할 참조
 * @returns 카드 컨텐츠 컴포넌트
 */
export const CardContent = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ""}`} {...props} />
))
CardContent.displayName = "CardContent"

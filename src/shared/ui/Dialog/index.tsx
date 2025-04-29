import * as React from "react"
import { forwardRef } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogOverlay = DialogPrimitive.Overlay

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  className?: string
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  className?: string
}

interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
  className?: string
}

/**
 * @param {object[string, React.ReactNode, object[string, string, React.Ref<HTMLDivElement>]]} props
 * @property {string} props.className - 대화 컨텐츠에 적용할 클래스 이름
 * @property {React.ReactNode} props.children - 대화 컨텐츠의 자식 요소
 * @property {React.Ref<HTMLDivElement>} ref - 대화 컨텐츠에 적용할 참조
 * @returns 대화 컨텐츠 컴포넌트
 */
export const DialogContent = forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        ref={ref}
        className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full ${className || ""}`}
        aria-describedby={props["aria-describedby"] || "dialog-description"}
        {...props}
      >
        {children}
        <div id="dialog-description" className="sr-only">
          대화 창 내용입니다. ESC 키를 눌러 닫을 수 있습니다.
        </div>
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">닫기</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
)
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * @param {object[string, object[string, string, React.HTMLAttributes<HTMLDivElement>]]} props
 * @property {string} props.className - 대화 헤더에 적용할 클래스 이름
 * @property {React.HTMLAttributes<HTMLDivElement>} props - 대화 헤더에 적용할 속성
 * @returns 대화 헤더 컴포넌트
 */
export const DialogHeader = ({ className, ...props }: DialogHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ""}`} {...props} />
)
DialogHeader.displayName = "DialogHeader"

/**
 * @param {object[string, object[string, string, React.HTMLAttributes<HTMLHeadingElement>]]} props
 * @property {string} props.className - 대화 타이틀에 적용할 클래스 이름
 * @property {React.HTMLAttributes<HTMLHeadingElement>} props - 대화 타이틀에 적용할 속성
 * @returns 대화 타이틀 컴포넌트
 */
export const DialogTitle = forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
      {...props}
    />
  ),
)
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * @param {object[string, object[string, string, React.HTMLAttributes<HTMLParagraphElement>]]} props
 * @property {string} props.className - 대화 설명에 적용할 클래스 이름
 * @property {React.HTMLAttributes<HTMLParagraphElement>} props - 대화 설명에 적용할 속성
 * @returns 대화 설명 컴포넌트
 */
export const DialogDescription = forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={`text-sm text-gray-500 ${className || ""}`} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

import * as React from "react"
import { forwardRef } from "react"

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string
}

/**
 * @param {object[string, object[string, string, React.TableHTMLAttributes<HTMLTableElement>]]} props
 * @property {string} props.className - 테이블에 적용할 클래스 이름
 * @property {React.TableHTMLAttributes<HTMLTableElement>} props - 테이블에 적용할 속성
 * @property {React.Ref<HTMLTableElement>} ref - 테이블에 적용할 참조
 * @returns 테이블 컴포넌트
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={`table-fixed w-full caption-bottom text-sm ${className || ""}`} {...props} />
  </div>
))
Table.displayName = "Table"

/**
 * @param {object[string, object[string, string, React.HTMLAttributes<HTMLTableSectionElement>]]} props
 * @property {string} props.className - 테이블 헤더에 적용할 클래스 이름
 * @property {React.HTMLAttributes<HTMLTableSectionElement>} props - 테이블 헤더에 적용할 속성
 * @property {React.Ref<HTMLTableSectionElement>} ref - 테이블 헤더에 적용할 참조
 * @returns 테이블 헤더 컴포넌트
 */
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => (
  <thead ref={ref} className={`[&_tr]:border-b ${className || ""}`} {...props} />
))
TableHeader.displayName = "TableHeader"

/**
 * @param {object[string, object[string, string, React.HTMLAttributes<HTMLTableSectionElement>]]} props
 * @property {string} props.className - 테이블 바디에 적용할 클래스 이름
 * @property {React.HTMLAttributes<HTMLTableSectionElement>} props - 테이블 바디에 적용할 속성
 * @property {React.Ref<HTMLTableSectionElement>} ref - 테이블 바디에 적용할 참조
 * @returns 테이블 바디 컴포넌트
 */
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className || ""}`} {...props} />
))
TableBody.displayName = "TableBody"

/**
 * @param {object[string, object[string, string, React.HTMLAttributes<HTMLTableRowElement>]]} props
 * @property {string} props.className - 테이블 행에 적용할 클래스 이름
 * @property {React.HTMLAttributes<HTMLTableRowElement>} props - 테이블 행에 적용할 속성
 * @property {React.Ref<HTMLTableRowElement>} ref - 테이블 행에 적용할 참조
 * @returns 테이블 행 컴포넌트
 */
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted h-14 ${className || ""}`}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * @param {object[string, object[string, string, React.ThHTMLAttributes<HTMLTableCellElement>]]} props
 * @property {string} props.className - 테이블 헤드에 적용할 클래스 이름
 * @property {React.ThHTMLAttributes<HTMLTableCellElement>} props - 테이블 헤드에 적용할 속성
 * @property {React.Ref<HTMLTableCellElement>} ref - 테이블 헤드에 적용할 참조
 * @returns 테이블 헤드 컴포넌트
 */
export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className || ""}`}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * @param {object[string, object[string, string, React.TdHTMLAttributes<HTMLTableCellElement>]]} props
 * @property {string} props.className - 테이블 셀에 적용할 클래스 이름
 * @property {React.TdHTMLAttributes<HTMLTableCellElement>} props - 테이블 셀에 적용할 속성
 * @property {React.Ref<HTMLTableCellElement>} ref - 테이블 셀에 적용할 참조
 * @returns 테이블 셀 컴포넌트
 */
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td ref={ref} className={`p-2 align-middle [&:has([role=checkbox])]:pr-0 ${className || ""}`} {...props} />
))
TableCell.displayName = "TableCell"

import { useState } from 'react'

// Third-party Imports
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import {
  ChevronDownIcon, ChevronUpIcon, BrushIcon,
  CrownIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  PencilLineIcon,
  PencilRulerIcon,
  Trash2Icon,
  UserCheckIcon,
  UserRoundIcon,
  UserXIcon
} from 'lucide-react'
import { format } from 'date-fns'

// Component Imports
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/src/components/ui/tooltip'

// Config Imports
import { getInitialsFromName } from '@/src/configs/mailConfig'
import { ROLE_ICONS } from '@/src/configs/role-permConfig'

// Util Imports
import { cn } from '@/src/lib/utils'

export default function AdminSimpleUserTable({ paginatedUsers, totalPages, sorting, onSortingChange, tableError, onSelectUser }) {
  const [highlightItem, setHighLightItem] = useState("")
  const sortingState = sorting ? [sorting] : []

  const handleSortingChange = (updater) => {
    const nextSorting = typeof updater === 'function' ? updater(sortingState) : updater

    if (nextSorting.length === 0) {
      onSortingChange(null)

      return
    }

    onSortingChange({
      id: nextSorting[0].id,
      desc: nextSorting[0].desc
    })
  }

  function TableActions({ user }) {
    if (user.role === "admin") {
      return <></>
    }
    return (
      <div className='flex items-center justify-center gap-1'>
        <Tooltip>
          <TooltipTrigger
            render={
              <button onClick={() => {
                setHighLightItem(user.id)
                onSelectUser(user)
              }}></button>
            }
          >
            <EyeIcon className='size-4.5' />
          </TooltipTrigger>
          <TooltipContent>
            <p>View user in update form</p>
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }


  const userTableColumns = [
    {
      id: 'user',
      header: 'User',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Avatar className='size-9'>
            {row.original.avatar ? <AvatarImage src={row.original.avatar} alt={row.original.name} /> : null}
            <AvatarFallback className='text-xs'>
              {getInitialsFromName(row.original.name)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium'>{row.original.name}</span>
            <span className='text-muted-foreground'>{row.original.email}</span>
          </div>
        </div>
      ),
      size: 360,
      enableSorting: true
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => {
        const role = row.original.role

        return (
          <div className='flex items-center gap-2'>
            {ROLE_ICONS[role]}
            <span className='capitalize'>{role}</span>
          </div>
        )
      },
      enableSorting: true
    },
    {
      id: 'id',
      header: 'id',
      accessorKey: 'plan',
      cell: ({ row }) => <span className='text-muted-foreground'>{row.original.id}</span>,
      enableSorting: true
    },
    {
      id: 'permissions',
      header: 'permissions',
      accessorKey: 'permissions',
      cell: ({ row }) => <span className='text-muted-foreground'>{row.original.permissions}</span>,
      enableSorting: true
    },

    {
      id: 'joinedDate',
      header: 'Joined Date',
      accessorKey: 'joinedDate',
      cell: ({ row }) => <span>{format(new Date(row.original.createdAt), 'dd MMM yyyy')}</span>,
      enableSorting: true
    },
    {
      id: 'actions',
      header: () => 'Actions',
      cell: ({ row }) => <TableActions user={row.original} />,
      enableHiding: false,
      enableSorting: false
    }
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: paginatedUsers,
    columns: userTableColumns,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id,
    enableRowSelection: false,
    enableSortingRemoval: false,
    state: {
      sorting: sortingState
    },
    onSortingChange: handleSortingChange
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id} className='h-14 border-t'>
            {headerGroup.headers.map(header => (
              <TableHead
                key={header.id}
                style={{ width: `${header.getSize()}px` }}
                className='text-muted-foreground first:pl-4 last:px-4 last:text-center'
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <div
                    className={cn(
                      header.column.getCanSort() &&
                      'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={event => {
                      if (header.column.getCanSort() && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault()
                        header.column.getToggleSortingHandler()?.(event)
                      }
                    }}
                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ChevronUpIcon className='size-4 shrink-0 opacity-60' aria-hidden='true' />,
                      desc: <ChevronDownIcon className='size-4 shrink-0 opacity-60' aria-hidden='true' />
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map(row => {
            const isSelectedRow = highlightItem === row.id;
            return (
              <TableRow
                key={row.id}
                className={cn(
                  "transition-colors duration-200",
                  isSelectedRow && "bg-primary/5 hover:bg-primary/10 border-l-4 border-l-primary font-medium"
                  // 💡 Pro-tip: You can use any class you prefer, like "bg-slate-100" or "bg-muted"
                )}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className='h-14 first:w-12.5 first:pl-4 last:w-29 last:px-4'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )
          })
        ) : (
          <TableRow>
            <TableCell colSpan={userTableColumns.length} className='h-24 text-center'>
              No results.
              {tableError ? <div>Database Error Couldn't retrieve users list</div> : ""}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
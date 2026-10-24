'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

const DEFAULT_FILTERS = {
  role: 'all',
  plan: 'all',
  status: 'all',
  search: ''
}

const DEFAULT_ROWS_PER_PAGE = 10
const DEFAULT_CURRENT_PAGE = 1

// FIX 1: Add optional chaining everywhere so undefined names/emails won't crash the loop
const filterUsers = (users = [], filters) => {
  if (!Array.isArray(users)) return []

  const normalizedSearch = filters?.search?.trim().toLowerCase() || ''

  return users.filter(user => {
    if (!user) return false

    if (filters.role !== 'all' && user.role !== filters.role) return false
    if (filters.plan !== 'all' && user.plan !== filters.plan) return false
    // if (filters.status !== 'all' && user.status !== filters.status) return false

    // to make the filter by status works with th field banned from better-auth database schema
    // console.log(filters.status, user.banned)
    if (filters.status !== 'all') {

      if (filters.status === 'Inactive') {
        if (user.banned !== true) return false
      }

      else if (filters.status === 'Active') {
        if (user.banned === true) return false
      }

      else {
        if (user.status !== filters.status) return false
      }
    }


    if (normalizedSearch) {
      // Safely access properties using optional chaining
      const matchesName = user.name?.toLowerCase().includes(normalizedSearch) ?? false
      const matchesEmail = user.email?.toLowerCase().includes(normalizedSearch) ?? false

      if (!matchesName && !matchesEmail) return false
    }

    return true
  })
}

// FIX 2: Fallback to empty strings if an property is missing asynchronously
const compareUsers = (a, b, column) => {
  if (!a || !b) return 0

  const valA = a[column] ?? ''
  const valB = b[column] ?? ''

  switch (column) {
    case 'user':
      return (a.name ?? '').localeCompare(b.name ?? '')
    case 'role':
    case 'plan':
    case 'billing':
    case 'status':
      return String(valA).localeCompare(String(valB))
    case 'joinedDate':
      const timeA = a.joinedDate ? new Date(a.joinedDate).getTime() : 0
      const timeB = b.joinedDate ? new Date(b.joinedDate).getTime() : 0
      return timeA - timeB
    default:
      return 0
  }
}

const sortUsers = (users = [], sorting) => {
  if (!Array.isArray(users)) return []
  if (!sorting || (typeof sorting === 'object' && !sorting.id)) return users

  const columnId = typeof sorting === 'string' ? sorting : sorting.id
  const isDesc = typeof sorting === 'object' ? !!sorting.desc : false

  return [...users].sort((a, b) => {
    const comparison = compareUsers(a, b, columnId)
    return isDesc ? -comparison : comparison
  })
}

const buildNewUser = (data) => ({
  id: crypto.randomUUID(),
  name: data?.name?.trim() || '',
  email: data?.email?.trim() || '',
  role: data?.role || 'user',
  plan: data?.plan || 'Basic',
  status: data?.status || 'Pending',
  billing: 'Manual',
  company: data?.company?.trim() || undefined,
  country: data?.country?.trim() || undefined,
  contact: data?.contact?.trim() || undefined,
  joinedDate: new Date().toISOString()
})

const removeIdsFromSelection = (selectedUserIds = [], ids = []) => {
  const idSet = new Set(ids)
  return selectedUserIds.filter(id => !idSet.has(id))
}

export function useUserApp({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers)
  const [filters, setFiltersState] = useState(DEFAULT_FILTERS)
  const [rowsPerPage, setRowsPerPageState] = useState(DEFAULT_ROWS_PER_PAGE)
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [sorting, setSorting] = useState(null)
  const [sheetMode, setSheetMode] = useState(null)
  const [editingUserId, setEditingUserId] = useState(null)

  // to allow proper sync between ui and backend after using next actions
  useEffect(() => {
    if (initialUsers) {
      setUsers(initialUsers);
    }
  }, [initialUsers]); // 👈 Watches the server payload live

  const stats = useMemo(() => {
    const safeUsers = initialUsers || []
    return {
      totalUsers: safeUsers.length,
      activeUsers: safeUsers.filter(u => u?.status === 'Active').length,
      pendingUsers: safeUsers.filter(u => u?.status === 'Pending').length,
      paidUsers: safeUsers.filter(u => u?.plan && u.plan !== 'Basic').length
    }
  }, [initialUsers])

  const filteredUsers = useMemo(() => filterUsers(initialUsers, filters), [filters, users])
  const sortedUsers = useMemo(() => sortUsers(filteredUsers, sorting), [filteredUsers, sorting])
  const totalFilteredCount = sortedUsers.length

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalFilteredCount / rowsPerPage)),
    [rowsPerPage, totalFilteredCount]
  )

  // Keep pagination in bounds if filters dramatically shrink results mid-session
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedUsers.slice(startIndex, startIndex + rowsPerPage)
  }, [currentPage, rowsPerPage, sortedUsers])

  const showingFrom = totalFilteredCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1
  const showingTo = Math.min(currentPage * rowsPerPage, totalFilteredCount)

  // FIX 4: Safely look up editing users with a fallback object to avoid undefined template reads
  const editingUser = useMemo(() => {
    if (!editingUserId) return null
    return users.find(user => user?.id === editingUserId) ?? null
  }, [editingUserId, users])

  const paginatedUserIds = useMemo(() => paginatedUsers.map(user => user?.id).filter(Boolean), [paginatedUsers])
  const isAllSelected = paginatedUsers.length > 0 && paginatedUserIds.every(id => selectedUserIds.includes(id))
  const isIndeterminate = paginatedUserIds.some(id => selectedUserIds.includes(id)) && !isAllSelected
  const rowSelection = Object.fromEntries(selectedUserIds.map(id => [id, true]))

  const handleFilterChange = useCallback((nextFilters) => {
    setFiltersState(prev => ({ ...prev, ...nextFilters }))
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [])

  const handleSearchChange = useCallback((search) => {
    setFiltersState(prev => ({ ...prev, search }))
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [])

  const handleRowsPerPageChange = useCallback((n) => {
    setRowsPerPageState(n)
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
  }, [])

  const handleSortingChange = useCallback((nextSorting) => {
    setSorting(nextSorting)
    setCurrentPage(DEFAULT_CURRENT_PAGE)
  }, [])

  const handleSelectUser = useCallback((id) => {
    if (!id) return
    setSelectedUserIds(prev => (prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]))
  }, [])

  const handleSelectAll = useCallback((userIds) => {
    if (!userIds) return
    setSelectedUserIds(prev => {
      const allSelected = userIds.length > 0 && userIds.every(id => prev.includes(id))
      return allSelected ? removeIdsFromSelection(prev, userIds) : [...new Set([...prev, ...userIds])]
    })
  }, [])

  const handleClearSelection = useCallback(() => setSelectedUserIds([]), [])

  const handleAddUser = useCallback((data) => {
    if (!data) return
    const newUser = buildNewUser(data)
    setUsers(prev => [...prev, newUser])
    setSheetMode(null)
    setEditingUserId(null)
  }, [])

  const handleUpdateUser = useCallback((id, data) => {
    if (!id || !data) return
    setUsers(prev =>
      prev.map(user =>
        user?.id === id
          ? {
            ...user,
            ...data,
            name: data.name?.trim() ?? user.name,
            email: data.email?.trim() ?? user.email,
            company: data.company?.trim() ?? user.company,
            country: data.country?.trim() ?? user.country,
            contact: data.contact?.trim() ?? user.contact
          }
          : user
      )
    )
    setSheetMode(null)
    setEditingUserId(null)
  }, [])

  const handleDeleteUser = useCallback((id) => {
    if (!id) return
    setUsers(prev => prev.filter(user => user?.id !== id))
    setSelectedUserIds(prev => removeIdsFromSelection(prev, [id]))
  }, [])

  const handleBulkDelete = useCallback(() => {
    setUsers(prev => prev.filter(user => user?.id && !selectedUserIds.includes(user.id)))
    setSelectedUserIds(prev => removeIdsFromSelection(prev, selectedUserIds))
  }, [selectedUserIds])

  const handleUpdateStatus = useCallback((id, status) => {
    if (!id) return
    setUsers(prev => prev.map(user => (user?.id === id ? { ...user, status } : user)))
  }, [])

  const handleBulkUpdateStatus = useCallback((status) => {
    setUsers(prev => prev.map(user => (user?.id && selectedUserIds.includes(user.id) ? { ...user, status } : user)))
  }, [selectedUserIds])

  const handleOpenAddSheet = useCallback(() => {
    setSheetMode('add')
    setEditingUserId(null)
  }, [])

  const handleOpenEditSheet = useCallback((userId) => {
    if (!userId) return
    setSheetMode('edit')
    setEditingUserId(userId)
  }, [])

  const handleCloseSheet = useCallback(() => {
    setSheetMode(null)
    setEditingUserId(null)
  }, [])

  return {
    initialUsers,
    stats,
    filters,
    paginatedUsers,
    filteredUsers,
    sortedUsers,
    totalPages,
    totalFilteredCount,
    showingFrom,
    showingTo,
    rowsPerPage,
    currentPage,
    selectedUserIds,
    isAllSelected,
    isIndeterminate,
    rowSelection,
    sorting,
    sheetMode,
    editingUser,
    handleFilterChange,
    handleSearchChange,
    handleRowsPerPageChange,
    handlePageChange,
    handleSortingChange,
    handleSelectUser,
    handleSelectAll,
    handleClearSelection,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleBulkDelete,
    handleUpdateStatus,
    handleBulkUpdateStatus,
    handleOpenAddSheet,
    handleOpenEditSheet,
    handleCloseSheet
  }
}

// app/products/FilterControls.tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';

export default function FilterControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Read current parameters from URL
  const currentSearch = searchParams.get('search') ?? '';
  const currentSort = searchParams.get('sort') ?? '';
  const currentCategory = searchParams.get('category') ?? '';

  // Check if any filter is currently applied to conditionally show the clear button
  const hasActiveFilters = currentSearch || currentSort || currentCategory;

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // 2. Shared helper function to update URL state
  const updateUrlParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // 3. Clear all filters handler
  const handleClearFilters = () => {
    setSearchTerm(''); // Reset local input immediately
    
    startTransition(() => {
      // Pushing just the pathname effectively strips away all query params
      router.push(pathname); 
    });
  };

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateUrlParam('search', searchTerm);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Sync local search input if filters are cleared or URL changes externally
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  return (
    <div className="flex flex-wrap gap-4 mb-6 items-center">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-64 focus:outline-blue-500"
      />

      {/* Category Dropdown */}
      <select
        value={currentCategory}
        onChange={(e) => updateUrlParam('category', e.target.value)}
        className="border p-2 rounded bg-white"
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      {/* Sort Dropdown */}
      <select
        value={currentSort}
        onChange={(e) => updateUrlParam('sort', e.target.value)}
        className="border p-2 rounded bg-white"
      >
        <option value="">Sort By</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>

      {/* Clear Filters Button (Only renders if filters are active) */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded transition text-sm"
        >
          Clear Filters
        </button>
      )}

      {/* Loading Indicator */}
      {isPending && <span className="text-sm text-blue-600 animate-pulse">Loading...</span>}
    </div>
  );
}


// // app/products/FilterControls.tsx
// 'use client';

// import { useRouter, usePathname, useSearchParams } from 'next/navigation';
// import { useTransition, useEffect, useState } from 'react';

// export default function FilterControls() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [isPending, startTransition] = useTransition();

//   // Read current parameters from URL to set initial state
//   const currentSearch = searchParams.get('search') ?? '';
//   const currentSort = searchParams.get('sort') ?? '';
//   const currentCategory = searchParams.get('category') ?? '';

//   const [searchTerm, setSearchTerm] = useState(currentSearch);

//   const updateUrlParam = (key, value) => {
//     const params = new URLSearchParams(searchParams.toString());
//     if (value) params.set(key, value); else params.delete(key);

//     startTransition(() => {
//       router.push(`${pathname}?${params.toString()}`);
//     });
//   };

//   // Debounce search input
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (searchTerm !== currentSearch) {
//         updateUrlParam('search', searchTerm);
//       }
//     }, 400);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm]);

//   useEffect(() => {
//     setSearchTerm(currentSearch);
//   }, [currentSearch]);

//   return (
//     <div className="flex flex-wrap gap-4 mb-6 items-center">
//       <input
//         type="text"
//         placeholder="Search items..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border p-2 rounded w-64 focus:outline-blue-500"
//       />

//       <select
//         value={currentCategory}
//         onChange={(e) => updateUrlParam('category', e.target.value)}
//         className="border p-2 rounded bg-white"
//       >
//         <option value="">All Categories</option>
//         <option value="electronics">Electronics</option>
//         <option value="clothing">Clothing</option>
//       </select>

//       <select
//         value={currentSort}
//         onChange={(e) => updateUrlParam('sort', e.target.value)}
//         className="border p-2 rounded bg-white"
//       >
//         <option value="">Sort By</option>
//         <option value="price_asc">Price: Low to High</option>
//         <option value="price_desc">Price: High to Low</option>
//       </select>

//       {isPending && <span className="text-sm text-blue-600 animate-pulse">Loading...</span>}
//     </div>
//   );
// }

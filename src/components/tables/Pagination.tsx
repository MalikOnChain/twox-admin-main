type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  // Ensure currentPage is not greater than totalPages
  const safeCurrentPage = Math.min(currentPage, totalPages)

  // Always show first and last page, with window around current page
  const windowSize = 1 // Number of pages to show on each side of current
  let pages: (number | string)[] = []

  if (totalPages <= 5) {
    // Show all pages if 5 or fewer
    pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  } else {
    // Always show first page
    pages.push(1)
    // Show left ellipsis if needed
    if (safeCurrentPage > windowSize + 2) {
      pages.push('left-ellipsis')
    }
    // Pages around current
    const start = Math.max(2, safeCurrentPage - windowSize)
    const end = Math.min(totalPages - 1, safeCurrentPage + windowSize)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    // Show right ellipsis if needed
    if (safeCurrentPage < totalPages - windowSize - 1) {
      pages.push('right-ellipsis')
    }
    // Always show last page
    pages.push(totalPages)
  }

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type='button'
        onClick={() => onPageChange(1)}
        disabled={safeCurrentPage === 1}
        className='shadow-theme-xs mr-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
      >
        <span className='block md:hidden'>{'<<'}</span>
        <span className='hidden md:block'>First</span>
      </button>
      <button
        type='button'
        onClick={() => onPageChange(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
        className='shadow-theme-xs mr-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
      >
        <span className='block md:hidden'>{'<'}</span>
        <span className='hidden md:block'>Previous</span>
      </button>
      <div className='flex items-center gap-2'>
        {pages.map((page, idx) =>
          typeof page === 'number' ? (
            <button
              type='button'
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded px-4 py-2 ${
                safeCurrentPage === page
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-700 dark:text-gray-400'
              } hover:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-blue-500/[0.08]`}
            >
              {page}
            </button>
          ) : (
            <span key={page + idx} className='px-2 text-gray-400'>
              ...
            </span>
          )
        )}
      </div>
      <button
        type='button'
        onClick={() => onPageChange(safeCurrentPage + 1)}
        disabled={safeCurrentPage === totalPages}
        className='shadow-theme-xs ml-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
      >
        <span className='block md:hidden'>{'>'}</span>
        <span className='hidden md:block'>Next</span>
      </button>
      <button
        type='button'
        onClick={() => onPageChange(totalPages)}
        disabled={safeCurrentPage === totalPages}
        className='shadow-theme-xs ml-2.5 flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]'
      >
        <span className='block md:hidden'>{'>>'}</span>
        <span className='hidden md:block'>Last</span>
      </button>
    </div>
  )
}

export default Pagination

// app/blocked/page.tsx
export default function BlockedPage() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='rounded p-6 text-center'>
        <h1 className='mb-2 text-2xl font-bold text-red-500'>Access Denied</h1>
        <p className='text-gray-100'>
          Your region is not allowed to access this site.
        </p>
      </div>
    </div>
  )
}

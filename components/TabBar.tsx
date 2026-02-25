'use client';

import { usePathname, useRouter } from 'next/navigation'

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="tabs tabs-box flex justify-center">
      <input
        type="radio"
        name="tabs"
        className="tab"
        aria-label="Calls"
        checked={pathname === '/app/call-list'}
        onChange={() => router.push('/app/call-list')}
      />
      <input 
        type="radio" 
        name="tabs" 
        className="tab" 
        aria-label="Review" 
        checked={pathname === '/app/review'}
        onChange={() => router.push('/app/review')}
      />
      <input 
        type="radio" 
        name="tabs" 
        className="tab" 
        aria-label="Profile" 
        checked={pathname === '/app/profile'}
        onChange={() => router.push('/app/profile')}
      />
    </div>
  );
}

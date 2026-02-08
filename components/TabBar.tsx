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
        checked={pathname === '/call-list'}
        onChange={() => router.push('/call-list')}
      />
      <input 
        type="radio" 
        name="tabs" 
        className="tab" 
        aria-label="Review" 
        checked={pathname === '/review'}
        onChange={() => router.push('/review')}
      />
      <input 
        type="radio" 
        name="tabs" 
        className="tab" 
        aria-label="Profile" 
        checked={pathname === '/profile'}
        onChange={() => router.push('/profile')}
      />
    </div>
  );
}

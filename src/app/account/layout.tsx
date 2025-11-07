import { ReactNode } from 'react';
import SideNavigation from '@/app/_components/SideNavigation';

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="h-full grid grid-cols-[16rem_1fr] gap-12">
      <SideNavigation />

      <div>{children}</div>
    </div>
  );
}

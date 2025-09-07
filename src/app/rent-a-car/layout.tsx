import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { RentVerticalNav } from '@/components/rent/RentVerticalNav';

export default function RentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      <ExploreHeader />
      <div className="flex flex-1 overflow-hidden">
        <RentVerticalNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

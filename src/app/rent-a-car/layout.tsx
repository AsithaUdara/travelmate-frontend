import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { RentVerticalNav } from '@/components/rent/RentVerticalNav';

// Route segment config for all rent-a-car pages (must be on the server)
// Force dynamic rendering and disable caching/prerender to support client hooks like useSearchParams
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

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

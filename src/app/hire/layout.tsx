import { ExploreHeader } from '@/components/explore/ExploreHeader'; // We will reuse the header
import { PlanVerticalNav } from '@/components/plan/PlanVerticalNav'; // A new nav for this section

// Ensure dynamic rendering and no caching for pages under /hire
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      <ExploreHeader />
      <div className="flex flex-1 overflow-hidden">
        <PlanVerticalNav />
        {/* The main content area where the page will be rendered */}
        <main className="flex-1 bg-slate-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 
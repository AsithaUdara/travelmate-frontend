import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { VerticalNav } from '@/components/explore/VerticalNav';

export default function AccommodationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* Reusing the existing ExploreHeader */}
      <ExploreHeader />
      <div className="flex flex-1 overflow-hidden">
        {/* Reusing the existing VerticalNav */}
        <VerticalNav />
        {/* The content of your accommodation pages will be rendered here */}
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
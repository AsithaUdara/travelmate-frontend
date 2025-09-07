import { ExploreHeader } from '@/components/explore/ExploreHeader';
import { VerticalNav } from '@/components/explore/VerticalNav';

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      <ExploreHeader />
      <div className="flex flex-1 overflow-hidden">
        <VerticalNav />
        {children}
      </div>
    </div>
  );
}
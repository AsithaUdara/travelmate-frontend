import { Header } from '@/components/organisms/ExploreHeader'; // A new header for this page
import { ExploreSidebar } from '@/components/organisms/ExploreSidebar';

export default function NearMeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* The Sidebar is now part of the layout, not the page */}
        <ExploreSidebar /> 
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
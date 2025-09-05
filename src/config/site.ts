export type NavLink = { label: string; href: string };

export const siteConfig = {
  name: "TravelMate.lk",
  description: "AI-powered travel planning for Sri Lanka.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Plan", href: "/plan" },
    { label: "Transport", href: "/transport" },
    { label: "Discover", href: "/discover" },
    { label: "Map", href: "/map" },
  ] as NavLink[],
};

export type SiteConfig = typeof siteConfig;

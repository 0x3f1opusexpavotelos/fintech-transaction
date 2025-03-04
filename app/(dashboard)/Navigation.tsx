"use client";
import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "./NavButton";
import { useMedia } from "react-use";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
const routes = [
  {
    label: "Overview",
    href: "/"
  },
  {
    label: "Transactions",
    href: "/trnasactions"
  },
  {
    label: "Acccounts",
    href: "/accounts"
  },
  {
    label: "Categories",
    href: "/categories"
  },
  {
    label: "Settings",
    href: "/settings"
  }
];

export const Navigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMedia("(max-width: 1024px)", false);
  console.log(isMobile);
  const router = useRouter();
  const pathName = usePathname();

  const onClick = (href: string) => {
    router.push(href);
    setIsDrawerOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "font-normal border-none outline-none bg-white/10 hover:bg-white/20 hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent text-white focus:bg-white/30 transition"
            )}
          >
            {" "}
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathName ? "secondary" : "ghost"}
                onClick={() => onClick(route.href)}
                className="justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathName === route.href}
        ></NavButton>
      ))}
    </nav>
  );
};

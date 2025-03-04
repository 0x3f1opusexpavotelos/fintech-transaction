import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
type Props = {
  href: string;
  label: string;
  isActive: boolean;
};

export const NavButton = ({ href, label, isActive }: Props) => {
  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={cn(
        "w-full lg:w-auto justify-between font-normal text-white hover:bg-white/20 focust:bg-white/20 hover:text-white border-none outline:none focus-visible:ring-offset-0 focus-visible:ring-transparent transition",
        isActive ? "bg-whtie/10 text-white" : "bg-transparent"
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

import { Loader2 } from "lucide-react";
import HeaderLogo from "./HeaderLogo";
import { Navigation } from "./Navigation";
import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { WelcomeMessage } from "./WelcomeMessage";
const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-bule-500 px-4 py-8 pb-36">
      <div className="max-w-screen-2xl mx-auto">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="size-8 animate-spin" />
          </ClerkLoading>
        </div>
        <WelcomeMessage />
      </div>
    </header>
  );
};

export default Header;

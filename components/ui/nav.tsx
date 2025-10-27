'use client';
import { Link } from "@/components/link";
import { Navbar, NavbarDivider, NavbarItem, NavbarSection, NavbarSpacer } from "@/components/navbar";
import { Text } from "@/components/text";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";


export function Nav() {
  const pathname = usePathname();
  return (
    <Navbar className="bg-white dark:bg-background border-b">
      <Link className="pl-4" href="/" aria-label="Home">
        <Text className="text-red-500!  font-bold">
          AI Explorer
        </Text>
      </Link>
      <NavbarDivider className="max-lg:hidden" />
      <NavbarSection className="max-lg:hidden">
        {/* <NavbarItem className="text-foreground dark:text-white" href="/">Home</NavbarItem> */}
        <NavbarItem current={pathname === '/stream'} className="text-foreground dark:text-white" href="/stream">Stream</NavbarItem>
        <NavbarItem current={pathname === '/text'} className="text-foreground dark:text-white" href="/text">Text</NavbarItem>
        <NavbarItem current={pathname === '/chat'} className="text-foreground dark:text-white" href="/chat">Chat</NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection className="max-lg:hidden">
        <div className="text-foreground dark:text-white mr-2 hover:ring hover:rounded-xl hover:transition-all hover:duration-300 hover:ease-in-out">
          <ThemeToggle />
        </div>
      </NavbarSection>
    </Navbar>
  )
}

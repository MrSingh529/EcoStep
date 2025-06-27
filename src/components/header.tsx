
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ListChecks,
  Menu,
  LogOut,
  ScanLine,
  ClipboardCheck,
  User as UserIcon,
  MessageSquare,
  Users,
  BrainCircuit,
  Info,
} from "lucide-react";

import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { avatars } from "@/components/avatars";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/activities", label: "Activities", icon: ListChecks },
  { href: "/actions", label: "Actions", icon: ClipboardCheck },
  { href: "/analyzer", label: "Analyzer", icon: ScanLine },
  { href: "/community", label: "Community", icon: Users },
  { href: "/ai-hub", label: "AI Hub", icon: BrainCircuit },
];

export function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);

  const renderNavLinks = (isMobile = false) =>
    navItems.map((item) => {
      const isActive = pathname.startsWith(item.href);
      return (
        <Button
          key={item.href}
          id={item.href === '/activities' && !isMobile ? 'tour-activities-link' : undefined}
          variant={isActive ? "secondary" : "ghost"}
          asChild
          className={cn(
            "justify-start",
            isMobile ? "w-full text-base" : "text-sm"
          )}
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      );
    });
  
  const UserMenu = () => {
    if (!user) return null;
    
    const AvatarComponent = user.avatarId ? avatars[user.avatarId]?.component : null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button id="tour-user-menu" variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        {AvatarComponent ? (
                            <AvatarComponent className="h-10 w-10" />
                        ) : (
                           <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'Anonymous User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                    <Link href="/feedback">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Give Feedback</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsAboutDialogOpen(true)}>
                  <Info className="mr-2 h-4 w-4" />
                  <span>About EcoStep</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    )
  }


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Icons.logo className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold hidden sm:inline-block">
                EcoStep
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {renderNavLinks()}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                 <SheetHeader className="sr-only">
                    <SheetTitle>Mobile Menu</SheetTitle>
                    <SheetDescription>
                      A list of links to navigate the application.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4">
                    <Icons.logo className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold">EcoStep</span>
                  </Link>
                  <nav className="flex flex-col gap-2 px-2">
                    {renderNavLinks(true)}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Icons.logo className="h-6 w-6 text-primary" />
              Our Story
            </DialogTitle>
            <DialogDescription asChild>
                <div className="text-left pt-4 space-y-4 text-base text-muted-foreground">
                  <p>
                      EcoStep was born from a simple, slightly panicked thought: "The world is facing huge climate challenges... what can someone like me even do?"
                  </p>
                  <p>
                      I'm not a scientist or a policy maker. Honestly, I'm just a regular person who felt overwhelmed by the scale of the problem. But I believe that small, individual actions, when multiplied by millions, can create a ripple effect of massive change.
                  </p>
                  <p>
                      So, I decided to build something. EcoStep is my answer. It's a tool to turn that feeling of helplessness into a sense of empowerment. It's for tracking the small steps—the bike ride instead of the drive, the reusable bag, the meatless meal—and seeing how they add up to a giant, positive impact.
                  </p>
                  <p className="font-semibold text-foreground/90">
                      This app is proof that you don't need to be a tech guru to build something that matters. You just need a problem to solve and the passion to see it through. Thank you for being part of this journey.
                  </p>
                </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

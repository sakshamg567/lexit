import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="w-full h-16 flex items-center">
      <Button
        variant="ghost"
        className={pathname === "/" ? "underline font-bold text-md hover:bg-white" : "text-md hover:bg-white"}
        onClick={() => router.push("/")}
      > Home </Button>
      <Button
        variant="ghost"
        className={pathname === "/vault" ? "underline font-bold text-md hover:bg-white" : "text-md hover:bg-white"}
        onClick={() => router.push("/vault")}
      > Vault </Button>
    </nav>
  )
}

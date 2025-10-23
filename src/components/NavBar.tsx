import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === "h") {
        router.push("/");
      } else if (e.key === "v") {
        router.push("/vault");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  return (
    <nav className="w-full h-16 flex items-center">
      <Button
        variant="ghost"
        className={
          pathname === "/"
            ? "underline font-bold text-md hover:bg-white"
            : "text-md hover:bg-white"
        }
        onClick={() => router.push("/")}
      >
        {" "}
        Home {pathname != "/" && "[h]"}
      </Button>
      <Button
        variant="ghost"
        className={
          pathname === "/vault"
            ? "underline font-bold text-md hover:bg-white"
            : "text-md hover:bg-white"
        }
        onClick={() => router.push("/vault")}
      >
        {" "}
        Vault {pathname != "/vault" && "[v]"}
      </Button>
    </nav>
  );
}

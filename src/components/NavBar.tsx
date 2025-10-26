import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import Toggle from "./Toggle";

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
      } else if (e.key === "c") {
        router.push("/contributors");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router]);

  return (
    <nav className="w-full h-16 flex items-center justify-between dark:text-gray-200">
      <div>
        <Button
          variant="ghost"
          className={
            pathname === "/"
              ? "underline font-bold text-md hover:bg-white cursor-pointer"
              : "text-md hover:bg-white cursor-pointer"
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
              ? "underline font-bold text-md hover:bg-white cursor-pointer"
              : "text-md hover:bg-white cursor-pointer"
          }
          onClick={() => router.push("/vault")}
        >
          {" "}
          Vault {pathname != "/vault" && "[v]"}
        </Button>
        <Button
          variant="ghost"
          className={
            pathname === "/contributors"
              ? "underline font-bold text-md hover:bg-white cursor-pointer"
              : "text-md hover:bg-white cursor-pointer"
          }
          onClick={() => router.push("/contributors")}
        >
          {" "}
          Contributors {pathname != "/contributors" && "[c]"}
        </Button>
      </div>
      <div>
        <Toggle />
      </div>

    </nav>
  );
}

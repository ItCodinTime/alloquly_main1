import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { HomePageContent } from "@/components/HomePageContent";

export default function Home() {
  return (
    <ThemeProvider>
      <HomePageContent />
    </ThemeProvider>
  );
}

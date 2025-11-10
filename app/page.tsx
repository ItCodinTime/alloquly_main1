import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { HomePageContent } from "@/components/HomePageContent";

export default function HomePage() {
  return (
    <ThemeProvider>
      <HomePageContent />
    </ThemeProvider>
  );
}

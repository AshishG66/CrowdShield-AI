export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background py-4 px-4 md:px-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-xs text-muted-foreground">
        <p>
          &copy; {currentYear} CrowdShield AI. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:underline hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:underline hover:text-foreground transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

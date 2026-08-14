export function AppFooter({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block text-[12px] font-bold text-[#766F69] ${className}`}>
      Developed with <span className="text-[#E23636] animate-pulse">❤️</span> by{" "}
      <a
        href="https://capturemathan.github.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#24201D] underline decoration-[#F17141]/40 underline-offset-2 transition hover:text-[#F17141] hover:decoration-[#F17141]"
      >
        Mathan
      </a>
    </span>
  );
}

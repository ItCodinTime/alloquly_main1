export function TeacherFooter() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 text-slate-500">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Alloqly · Internal dashboard</p>
        <p className="text-slate-400">Status: All systems normal</p>
      </div>
    </footer>
  );
}

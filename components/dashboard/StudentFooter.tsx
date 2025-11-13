export function StudentFooter() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 text-slate-400">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Alloqly · Student beta</p>
        <p className="text-indigo-200">Need help? Ping your teacher any time.</p>
      </div>
    </footer>
  );
}

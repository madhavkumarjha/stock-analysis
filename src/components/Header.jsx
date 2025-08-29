import { Activity ,Github} from "lucide-react";
import React from "react";

function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/60 dark:bg-neutral-900/60 border-b border-gray-100 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Stock Analysis</h1>
        </div>
        <a
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          href="https://github.com/madhavkumarjha/stock-analysis"
          target="_blank"
          rel="noreferrer"
        >
          <Github className="w-4 h-4" /> Docs
        </a>
      </div>
    </header>
  );
}

export default Header;

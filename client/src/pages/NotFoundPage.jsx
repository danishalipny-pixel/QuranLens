import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-arabic text-3xl font-bold mx-auto">
        ٤٠٤
      </div>
      <h1 className="text-3xl font-bold font-serif text-charcoal-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-charcoal-500">
        The page or verse you are looking for could not be found.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>
        <Link
          to="/surahs"
          className="px-4 py-2 rounded-xl bg-ivory-100 dark:bg-charcoal-800 text-charcoal-800 dark:text-charcoal-200 text-xs font-semibold flex items-center gap-1.5 border border-ivory-300 dark:border-charcoal-700"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse Surahs</span>
        </Link>
      </div>
    </div>
  );
}

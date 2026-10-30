import React, { createContext, useContext, useState, useEffect } from 'react';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('quranlens_bookmarks');
    return saved ? JSON.parse(saved) : [
      {
        id: 'bm_default_1',
        surahNumber: 1,
        ayahNumber: 1,
        surahName: 'Al-Fatihah',
        arabicPreview: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        englishPreview: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        collectionName: 'Daily Reading',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'bm_default_2',
        surahNumber: 21,
        ayahNumber: 30,
        surahName: 'Al-Anbiya',
        arabicPreview: 'أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا...',
        englishPreview: '...heavens and the earth were a joined entity, and then We separated them...',
        collectionName: 'Science',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('quranlens_notes');
    return saved ? JSON.parse(saved) : [
      {
        id: 'note_default_1',
        surahNumber: 2,
        ayahNumber: 255,
        title: 'Reflection on Ayat al-Kursi',
        content: 'The concept of Al-Qayyum as continuous divine sustaining rather than a passive creator.',
        tags: ['Theology', 'Cosmic Order'],
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [readingHistory, setReadingHistory] = useState(() => {
    const saved = localStorage.getItem('quranlens_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('quranlens_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('quranlens_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('quranlens_history', JSON.stringify(readingHistory));
  }, [readingHistory]);

  const isBookmarked = (surahNumber, ayahNumber) => {
    return bookmarks.some(
      (b) => Number(b.surahNumber) === Number(surahNumber) && Number(b.ayahNumber) === Number(ayahNumber)
    );
  };

  const toggleBookmark = (ayahData, collectionName = 'Favorites') => {
    const sNum = Number(ayahData.surahNumber);
    const aNum = Number(ayahData.ayahNumber);

    const existsIndex = bookmarks.findIndex(
      (b) => Number(b.surahNumber) === sNum && Number(b.ayahNumber) === aNum
    );

    if (existsIndex !== -1) {
      setBookmarks((prev) => prev.filter((_, idx) => idx !== existsIndex));
      return false; // Removed
    } else {
      const newBookmark = {
        id: 'bm_' + Date.now(),
        surahNumber: sNum,
        ayahNumber: aNum,
        surahName: ayahData.surahName || (ayahData.surah ? ayahData.surah.englishName : `Surah ${sNum}`),
        arabicPreview: ayahData.arabicText || '',
        englishPreview: ayahData.englishTranslation || '',
        collectionName,
        createdAt: new Date().toISOString(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
      return true; // Added
    }
  };

  const removeBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const addNote = (surahNumber, ayahNumber, noteData) => {
    const newNote = {
      id: 'note_' + Date.now(),
      surahNumber: Number(surahNumber),
      ayahNumber: Number(ayahNumber),
      title: noteData.title || '',
      content: noteData.content || '',
      tags: noteData.tags || [],
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const trackReading = (surahNumber, ayahNumber, surahName) => {
    setReadingHistory((prev) => {
      const filtered = prev.filter(
        (h) => !(h.surahNumber === surahNumber && h.ayahNumber === ayahNumber)
      );
      return [
        {
          surahNumber,
          ayahNumber,
          surahName,
          timestamp: new Date().toISOString(),
        },
        ...filtered.slice(0, 19),
      ];
    });
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        notes,
        readingHistory,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        addNote,
        deleteNote,
        trackReading,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};

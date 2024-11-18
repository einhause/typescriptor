import { create } from 'zustand';

import useKeyboardStore from './keyboardStore';

export interface CodeSnippet {
  language: Language;
  description: string;
  linesOfCode: number;
  code: string;
}

type Language = 'python' | 'cpp' | 'csharp' | 'java' | 'javascript' | 'typescript';
type AutoOption = 'autoTab' | 'autoNewline';

export type LanguageFilter = {
  [key in Language]: boolean;
};

export type AutoOptions = {
  [key in AutoOption]: boolean;
};

export type SortType = 'ascending' | 'descending' | 'random';

interface CodeSnippetStore {
  snippets: CodeSnippet[];
  filteredSnippets: CodeSnippet[];
  languageFilter: LanguageFilter;
  autoOptions: AutoOptions;
  minCodeSnippetLength: number;
  maxCodeSnippetLength: number;
  sortType: SortType;
  currentCodeSnippetIndex: number;
  currentSnippet: CodeSnippet | null;
  fetchSnippets: () => void;
  setPrevSnippet: () => void;
  setNextSnippet: () => void;
  setLanguageFilter: (languages: LanguageFilter) => void;
  setAutoOptions: (autoOptions: AutoOptions) => void;
  setCodeSnippetLengthFilter: (min: number, max: number) => void;
  applyFilters: () => void;
  sortByIncreasingLength: () => void;
  sortByDecreasingLength: () => void;
  sortRandomly: () => void;
}

const useCodeSnippetStore = create<CodeSnippetStore>((set, get) => ({
  snippets: [],
  filteredSnippets: [],
  languageFilter: {
    python: true,
    cpp: true,
    csharp: true,
    java: true,
    javascript: true,
    typescript: true,
  },
  autoOptions: {
    autoTab: true,
    autoNewline: true,
  },
  minCodeSnippetLength: 10,
  maxCodeSnippetLength: 30,
  sortType: 'random',
  currentCodeSnippetIndex: 0,
  currentSnippet: null,

  fetchSnippets: async () => {
    try {
      const files = [
        'cpp.json',
        'csharp.json',
        'java.json',
        'javascript.json',
        'python.json',
        'typescript.json',
      ];
      const fetchPromises = files.map((file) =>
        fetch(`json/${file}`).then((res) => res.json())
      );
      const data = await Promise.all(fetchPromises);
      const snippets = data.reduce((prev, curr) => [...prev, curr.snippets], []).flat();

      set({ snippets });
      get().applyFilters();
    } catch (error) {
      console.error('Error fetching code snippets:', error);
    }
  },

  setPrevSnippet: () => {
    const { currentCodeSnippetIndex, filteredSnippets } = get();
    const newIndex =
      (currentCodeSnippetIndex - 1 + filteredSnippets.length) % filteredSnippets.length;
    set({
      currentCodeSnippetIndex: newIndex,
      currentSnippet: filteredSnippets[newIndex],
    });
    useKeyboardStore.getState().resetKeyboardProgress();
  },

  setNextSnippet: () => {
    const { currentCodeSnippetIndex, filteredSnippets } = get();
    const newIndex = (currentCodeSnippetIndex + 1) % filteredSnippets.length;
    set({
      currentCodeSnippetIndex: newIndex,
      currentSnippet: filteredSnippets[newIndex],
    });
    useKeyboardStore.getState().resetKeyboardProgress();
  },

  setLanguageFilter: (languages) => {
    set({ languageFilter: languages });
    get().applyFilters();
    useKeyboardStore.getState().resetKeyboardProgress();
  },

  setAutoOptions: (options) => {
    set({ autoOptions: options });
    useKeyboardStore.getState().resetKeyboardProgress();
  },

  setCodeSnippetLengthFilter: (min, max) => {
    set({ minCodeSnippetLength: min, maxCodeSnippetLength: max });
    get().applyFilters();
    useKeyboardStore.getState().resetKeyboardProgress();
  },

  applyFilters: () => {
    const {
      snippets,
      languageFilter,
      minCodeSnippetLength,
      maxCodeSnippetLength,
      sortType,
    } = get();

    let newSnippets = snippets.filter((snippet) => {
      const matchesLanguage = languageFilter[snippet.language];
      const matchesLength =
        snippet.linesOfCode >= minCodeSnippetLength &&
        snippet.linesOfCode <= maxCodeSnippetLength;
      return matchesLanguage && matchesLength;
    });

    if (sortType === 'ascending') {
      newSnippets = newSnippets.sort((a, b) => a.linesOfCode - b.linesOfCode);
    } else if (sortType === 'descending') {
      newSnippets = newSnippets.sort((a, b) => b.linesOfCode - a.linesOfCode);
    } else if (sortType === 'random') {
      newSnippets = newSnippets.sort(() => Math.random() - 0.5);
    }

    set({
      filteredSnippets: newSnippets,
      currentCodeSnippetIndex: 0,
      currentSnippet: newSnippets[0] || null,
    });
  },

  sortByIncreasingLength: () => {
    set((state) => {
      const sortedSnippets = [...state.filteredSnippets].sort(
        (a, b) => a.linesOfCode - b.linesOfCode
      );
      return {
        sortType: 'ascending',
        filteredSnippets: sortedSnippets,
        currentCodeSnippetIndex: 0,
        currentSnippet: sortedSnippets[0] || null,
      };
    });
    useKeyboardStore.getState().resetKeyboardProgress();
  },

  sortByDecreasingLength: () => {
    set((state) => {
      const sortedSnippets = [...state.filteredSnippets].sort(
        (a, b) => b.linesOfCode - a.linesOfCode
      );
      return {
        sortType: 'descending',
        filteredSnippets: sortedSnippets,
        currentCodeSnippetIndex: 0,
        currentSnippet: sortedSnippets[0] || null,
      };
    });
    useKeyboardStore.getState().resetKeyboardProgress();
  },

  sortRandomly: () => {
    set((state) => {
      const randomizedSnippets = [...state.filteredSnippets].sort(
        () => Math.random() - 0.5
      );
      return {
        sortType: 'random',
        filteredSnippets: randomizedSnippets,
        currentCodeSnippetIndex: 0,
        currentSnippet: randomizedSnippets[0] || null,
      };
    });
    useKeyboardStore.getState().resetKeyboardProgress();
  },
}));

export default useCodeSnippetStore;

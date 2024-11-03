import { create } from 'zustand';

interface CodeSnippet {
  language: string;
  description: string;
  linesOfCode: number;
  code: string;
}

interface CodeSnippetStore {
  snippets: CodeSnippet[];
  filteredSnippets: CodeSnippet[];
  languageFilter: string[];
  minCodeSnippetLength: number | null;
  maxCodeSnippetLength: number | null;
  currentCodeSnippetIndex: number;
  fetchSnippets: () => void;
  setCurrentSnippetIndex: (idx: number) => void;
  setLanguageFilter: (languages: string[]) => void;
  setCodeSnippetLengthFilter: (min: number, max: number) => void;
  applyFilters: () => void;
  sortByIncreasingLength: () => void;
  sortByDecreasingLength: () => void;
  sortRandomly: () => void;
}

const useCodeSnippetStore = create<CodeSnippetStore>((set, get) => ({
  snippets: [],
  filteredSnippets: [],
  languageFilter: [],
  minCodeSnippetLength: null,
  maxCodeSnippetLength: null,
  currentCodeSnippetIndex: 0,

  fetchSnippets: async () => {
    try {
      const files = ['cpp.json', 'java.json', 'javascript.json', 'python.json'];
      const fetchPromises = files.map((file) =>
        fetch(`/${file}`).then((res) => res.json())
      );
      const data = await Promise.all(fetchPromises);
      const snippets = data.reduce((prev, curr) => [...prev, curr.snippets], []).flat();

      set({ snippets, filteredSnippets: snippets });
    } catch (error) {
      console.error('Error fetching code snippets:', error);
    }
  },

  setCurrentSnippetIndex: (idx) => {
    set({ currentCodeSnippetIndex: idx });
  },

  setLanguageFilter: (languages) => {
    set({ languageFilter: languages });
    get().applyFilters();
  },

  setCodeSnippetLengthFilter: (min, max) => {
    set({ minCodeSnippetLength: min, maxCodeSnippetLength: max });
    get().applyFilters();
  },

  applyFilters: () => {
    const { snippets, languageFilter, minCodeSnippetLength, maxCodeSnippetLength } =
      get();

    const filtered = snippets.filter((snippet) => {
      const matchesLanguage =
        languageFilter.length === 0 || languageFilter.includes(snippet.language);
      const matchesLength =
        (minCodeSnippetLength === null || snippet.linesOfCode >= minCodeSnippetLength) &&
        (maxCodeSnippetLength === null || snippet.linesOfCode <= maxCodeSnippetLength);
      return matchesLanguage && matchesLength;
    });

    set({ filteredSnippets: filtered });
  },

  sortByIncreasingLength: () => {
    set((state) => ({
      filteredSnippets: [...state.filteredSnippets].sort(
        (a, b) => a.linesOfCode - b.linesOfCode
      ),
    }));
  },

  sortByDecreasingLength: () => {
    set((state) => ({
      filteredSnippets: [...state.filteredSnippets].sort(
        (a, b) => b.linesOfCode - a.linesOfCode
      ),
    }));
  },

  sortRandomly: () => {
    set((state) => ({
      filteredSnippets: [...state.filteredSnippets].sort(() => Math.random() - 0.5),
    }));
  },
}));

export default useCodeSnippetStore;

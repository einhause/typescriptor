import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import useCodeSnippetStore, { CodeSnippet } from '../codeSnippetStore';

beforeEach(() => {
  const { setState } = useCodeSnippetStore;
  setState({
    snippets: [] as CodeSnippet[],
    filteredSnippets: [] as CodeSnippet[],
    languageFilter: {
      python: true,
      cpp: true,
      csharp: true,
      java: true,
      javascript: true,
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
  });
});

describe('useCodeSnippetStore', () => {
  it('should initialize with correct default state', () => {
    const state = useCodeSnippetStore.getState();
    expect(state.snippets).toEqual([]);
    expect(state.filteredSnippets).toEqual([]);
    expect(state.languageFilter).toEqual({
      python: true,
      cpp: true,
      csharp: true,
      java: true,
      javascript: true,
    });
    expect(state.autoOptions).toEqual({
      autoTab: true,
      autoNewline: true,
    });
    expect(state.minCodeSnippetLength).toBe(10);
    expect(state.maxCodeSnippetLength).toBe(30);
    expect(state.sortType).toBe('random');
    expect(state.currentCodeSnippetIndex).toBe(0);
    expect(state.currentSnippet).toBeNull();
  });

  it('should update language filter and apply filters', () => {
    const { setLanguageFilter } = useCodeSnippetStore.getState();
    const snippets: CodeSnippet[] = [
      {
        language: 'python',
        description: 'Snippet 1',
        linesOfCode: 20,
        code: 'print(1)',
      },
      {
        language: 'cpp',
        description: 'Snippet 2',
        linesOfCode: 15,
        code: 'cout << 2;',
      },
      {
        language: 'java',
        description: 'Snippet 3',
        linesOfCode: 25,
        code: 'System.out.println(3);',
      },
    ];

    useCodeSnippetStore.setState({ filteredSnippets: snippets });

    act(() => {
      setLanguageFilter({
        python: true,
        cpp: false,
        csharp: false,
        java: true,
        javascript: true,
      });
    });

    const { languageFilter } = useCodeSnippetStore.getState();

    expect(languageFilter).toEqual({
      python: true,
      cpp: false,
      csharp: false,
      java: true,
      javascript: true,
    });
  });

  it('should set and update auto options', () => {
    const { setAutoOptions } = useCodeSnippetStore.getState();

    act(() => {
      setAutoOptions({ autoTab: false, autoNewline: true });
    });

    const { autoOptions } = useCodeSnippetStore.getState();

    expect(autoOptions).toEqual({
      autoTab: false,
      autoNewline: true,
    });
  });

  it('should set code snippet length filter and apply filters', () => {
    const { setCodeSnippetLengthFilter } = useCodeSnippetStore.getState();

    act(() => {
      setCodeSnippetLengthFilter(15, 50);
    });

    const { minCodeSnippetLength, maxCodeSnippetLength } = useCodeSnippetStore.getState();

    expect(minCodeSnippetLength).toBe(15);
    expect(maxCodeSnippetLength).toBe(50);
  });

  it('should sort snippets by increasing length', () => {
    const { sortByIncreasingLength } = useCodeSnippetStore.getState();
    const snippets: CodeSnippet[] = [
      { language: 'python', description: 'Snippet 1', linesOfCode: 20, code: 'print(1)' },
      { language: 'cpp', description: 'Snippet 2', linesOfCode: 15, code: 'cout << 2;' },
      {
        language: 'java',
        description: 'Snippet 3',
        linesOfCode: 25,
        code: 'System.out.println(3);',
      },
    ];

    useCodeSnippetStore.setState({ filteredSnippets: snippets });

    act(() => {
      sortByIncreasingLength();
    });

    const { filteredSnippets } = useCodeSnippetStore.getState();

    expect(filteredSnippets).toEqual([
      { language: 'cpp', description: 'Snippet 2', linesOfCode: 15, code: 'cout << 2;' },
      { language: 'python', description: 'Snippet 1', linesOfCode: 20, code: 'print(1)' },
      {
        language: 'java',
        description: 'Snippet 3',
        linesOfCode: 25,
        code: 'System.out.println(3);',
      },
    ]);
  });

  it('should sort snippets by decreasing length', () => {
    const { sortByDecreasingLength } = useCodeSnippetStore.getState();
    const snippets: CodeSnippet[] = [
      { language: 'python', description: 'Snippet 1', linesOfCode: 20, code: 'print(1)' },
      { language: 'cpp', description: 'Snippet 2', linesOfCode: 15, code: 'cout << 2;' },
      {
        language: 'java',
        description: 'Snippet 3',
        linesOfCode: 25,
        code: 'System.out.println(3);',
      },
    ];

    useCodeSnippetStore.setState({ filteredSnippets: snippets });

    act(() => {
      sortByDecreasingLength();
    });

    const { filteredSnippets } = useCodeSnippetStore.getState();

    expect(filteredSnippets).toEqual([
      {
        language: 'java',
        description: 'Snippet 3',
        linesOfCode: 25,
        code: 'System.out.println(3);',
      },
      { language: 'python', description: 'Snippet 1', linesOfCode: 20, code: 'print(1)' },
      { language: 'cpp', description: 'Snippet 2', linesOfCode: 15, code: 'cout << 2;' },
    ]);
  });

  it('should navigate to the next snippet', () => {
    const { setNextSnippet } = useCodeSnippetStore.getState();

    const snippets: CodeSnippet[] = [
      { language: 'python', description: 'Snippet 1', linesOfCode: 10, code: 'print(1)' },
      {
        language: 'java',
        description: 'Snippet 2',
        linesOfCode: 20,
        code: 'System.out.println(2);',
      },
    ];

    useCodeSnippetStore.setState({
      filteredSnippets: snippets,
      currentSnippet: snippets[0],
    });

    act(() => {
      setNextSnippet();
    });

    const { currentCodeSnippetIndex, currentSnippet } = useCodeSnippetStore.getState();

    expect(currentCodeSnippetIndex).toBe(1);
    expect(currentSnippet).toEqual(snippets[1]);
  });

  it('should navigate to the previous snippet', () => {
    const { setPrevSnippet } = useCodeSnippetStore.getState();

    const snippets: CodeSnippet[] = [
      { language: 'python', description: 'Snippet 1', linesOfCode: 10, code: 'print(1)' },
      {
        language: 'java',
        description: 'Snippet 2',
        linesOfCode: 20,
        code: 'System.out.println(2);',
      },
    ];

    useCodeSnippetStore.setState({
      filteredSnippets: snippets,
      currentSnippet: snippets[1],
      currentCodeSnippetIndex: 1,
    });

    act(() => {
      setPrevSnippet();
    });

    const { currentCodeSnippetIndex, currentSnippet } = useCodeSnippetStore.getState();

    expect(currentCodeSnippetIndex).toBe(0);
    expect(currentSnippet).toEqual(snippets[0]);
  });
});

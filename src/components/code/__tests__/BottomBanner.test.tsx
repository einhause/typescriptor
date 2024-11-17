import { render, screen } from '@testing-library/react';
import { describe, beforeEach, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import BottomBanner from '../BottomBanner';
import useCodeSnippetStore from '@/store/codeSnippetStore';

describe('BottomBanner Component', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useCodeSnippetStore.setState({
      currentCodeSnippetIndex: 0,
    });
  });

  it('should display the correct language label for C++', () => {
    // Set Zustand store with a C++ snippet
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'cpp',
        description: 'A C++ snippet',
        code: '#include <iostream>',
        linesOfCode: 10,
      },
    });

    render(<BottomBanner />);

    const languageLabel = screen.getByText('C++');
    expect(languageLabel).toBeInTheDocument();
    expect(screen.getByText('| A C++ snippet')).toBeInTheDocument();
    expect(
      screen.getByText('Correctly type the first character to begin.')
    ).toBeInTheDocument();
  });

  it('should display the correct language label for C#', () => {
    // Set Zustand store with a C++ snippet
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'csharp',
        description: 'A C# snippet',
        code: 'Console.WriteLine("Foo")',
        linesOfCode: 10,
      },
    });

    render(<BottomBanner />);

    const languageLabel = screen.getByText('C#');
    expect(languageLabel).toBeInTheDocument();
    expect(screen.getByText('| A C# snippet')).toBeInTheDocument();
    expect(
      screen.getByText('Correctly type the first character to begin.')
    ).toBeInTheDocument();
  });

  it('should display the correct language label for JavaScript', () => {
    // Set Zustand store with a JavaScript snippet
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'javascript',
        description: 'A JavaScript snippet',
        code: 'console.log("Hello World!");',
        linesOfCode: 10,
      },
    });

    render(<BottomBanner />);

    const languageLabel = screen.getByText('JavaScript');
    expect(languageLabel).toBeInTheDocument();
    expect(screen.getByText('| A JavaScript snippet')).toBeInTheDocument();
    expect(
      screen.getByText('Correctly type the first character to begin.')
    ).toBeInTheDocument();
  });

  it('should display the correct language label for Python', () => {
    // Set Zustand store with a Python snippet
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'python',
        description: 'A Python snippet',
        code: 'print("Hello, World!")',
        linesOfCode: 10,
      },
    });

    render(<BottomBanner />);

    const languageLabel = screen.getByText('Python');
    expect(languageLabel).toBeInTheDocument();
    expect(screen.getByText('| A Python snippet')).toBeInTheDocument();
    expect(
      screen.getByText('Correctly type the first character to begin.')
    ).toBeInTheDocument();
  });

  it('should display the correct language label for Java', () => {
    // Set Zustand store with a generic snippet
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'java',
        description: 'A Java snippet',
        code: 'public class HelloWorld {}',
        linesOfCode: 10,
      },
    });

    render(<BottomBanner />);

    expect(screen.getByText('Java')).toBeInTheDocument();
    expect(screen.getByText('| A Java snippet')).toBeInTheDocument();
    expect(
      screen.getByText('Correctly type the first character to begin.')
    ).toBeInTheDocument();
  });
});

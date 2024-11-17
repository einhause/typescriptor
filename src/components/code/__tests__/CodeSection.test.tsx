import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

import CodeSection from '../CodeSection';
import useKeyboardStore from '@/store/keyboardStore';
import useCodeSnippetStore from '@/store/codeSnippetStore';

describe('CodeSection Component', () => {
  beforeEach(() => {
    const scrollIntoViewMock = vi.fn();
    const scrollTo = vi.fn();
    // Mock the scrollIntoView function
    Element.prototype.scrollIntoView = scrollIntoViewMock;
    Element.prototype.scrollTo = scrollTo;
  });

  it('should render the current snippet and handle character highlighting', () => {
    // Set initial state for both stores
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'python',
        description: 'Snippet 1',
        linesOfCode: 20,
        code: 'print(1)',
      },
    });
    useKeyboardStore.setState({
      currentCharIndex: 0,
      incorrectKey: false,
      showModal: false,
    });

    render(<CodeSection />);

    // Check the first character 'p' is highlighted as current
    const firstChar = screen.getByText('p');
    expect(firstChar).toBeInTheDocument();
    expect(firstChar).toHaveClass('text-white px-[.5px]');
    const parent = firstChar.parentNode;
    expect(parent).toHaveClass('relative inline-block bg-gray-700');
  });

  it('should display a cursor for the current character', () => {
    // Set initial state for both stores
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'java',
        description: 'Snippet 3',
        linesOfCode: 25,
        code: 'System.out.println(3);',
      },
    });
    useKeyboardStore.setState({
      currentCharIndex: 0,
      incorrectKey: false,
      showModal: false,
    });

    render(<CodeSection />);

    // Check if cursor is rendered at the first character 'S'
    const firstChar = screen.getByText('S');
    const cursor = firstChar.nextSibling;
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass(
      'absolute top-0 left-full w-0.5 h-6 animate-blink bg-slate-300'
    );
  });

  it('should mark the current character red if incorrect key is pressed', () => {
    // Set initial state with incorrectKey true
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'cpp',
        description: 'Snippet 2',
        linesOfCode: 15,
        code: 'cout << 2;',
      },
    });
    useKeyboardStore.setState({
      currentCharIndex: 0,
      incorrectKey: true,
      showModal: false,
    });

    render(<CodeSection />);

    // Check if the first character 'H' has red color for incorrect typing
    const firstChar = screen.getByText('c');
    expect(firstChar).toBeInTheDocument();
    expect(firstChar).toHaveClass('text-red-500 px-[.5px]');
    const parent = firstChar.parentNode;
    expect(parent).toHaveClass('relative inline-block bg-red-100');
  });

  it('should mark the current character green if correct key is pressed and advance character', () => {
    // Set initial state with incorrectKey true
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'cpp',
        description: 'Snippet 2',
        linesOfCode: 15,
        code: 'cout << 2;',
      },
    });
    useKeyboardStore.setState({
      currentCharIndex: 1,
      incorrectKey: false,
      showModal: false,
    });

    render(<CodeSection />);

    // Check if the first character 'H' has green color for correct typing
    const firstChar = screen.getByText('c');
    expect(firstChar).toBeInTheDocument();
    expect(firstChar).toHaveClass('text-green-500 px-[.5px]');
    const parent = firstChar.parentNode;
    expect(parent).toHaveClass('relative inline-block bg-transparent');

    // Check if cursor advanced
    const secondChar = screen.getByText('o');
    const cursor = secondChar.nextSibling;
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass(
      'absolute top-0 left-full w-0.5 h-6 animate-blink bg-slate-300'
    );
  });

  it('should hide the bottom banner when currentCharIndex is not 0', () => {
    // Set currentCharIndex to 1 to simulate progression
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'python',
        description: 'Snippet 1',
        linesOfCode: 20,
        code: 'print(1)',
      },
    });
    useKeyboardStore.setState({
      currentCharIndex: 1,
      incorrectKey: false,
      showModal: false,
    });

    render(<CodeSection />);

    // Check if the bottom banner is not rendered
    const bottomBanner = screen.queryByTestId('BottomBanner');
    expect(bottomBanner).not.toBeInTheDocument();
  });

  it('should show the bottom banner when currentCharIndex is 0', () => {
    // Set currentCharIndex to 0
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'java',
        description: 'Snippet 3',
        linesOfCode: 25,
        code: 'System.out.println(3);',
      },
    });
    useKeyboardStore.setState({
      currentCharIndex: 0,
      incorrectKey: false,
      showModal: false,
    });

    render(<CodeSection />);

    // Check if the bottom banner is rendered
    const bottomBanner = screen.queryByTestId('BottomBanner');
    expect(bottomBanner).toBeInTheDocument();
  });

  it('should show modal when the snippet is complete', () => {
    // Set state with completed snippet
    useCodeSnippetStore.setState({
      currentSnippet: {
        language: 'cpp',
        description: 'Snippet 2',
        linesOfCode: 15,
        code: 'cout << 2;',
      },
    });
    useKeyboardStore.setState({
      currentCharIndex: 5, // Snippet length is 5, so complete
      incorrectKey: false,
      showModal: true,
    });

    render(<CodeSection />);

    // Check if the modal is displayed
    expect(screen.queryByTestId('SnippetCompleteModal')).toBeInTheDocument();
  });
});

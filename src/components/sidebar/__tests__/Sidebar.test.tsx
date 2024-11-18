import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Sidebar } from '../Sidebar';
import useCodeSnippetStore, { CodeSnippet } from '@/store/codeSnippetStore';

beforeEach(() => {
  const { setState } = useCodeSnippetStore;

  // Reset store state before each test
  setState({
    snippets: [] as CodeSnippet[],
    filteredSnippets: [] as CodeSnippet[],
    languageFilter: {
      python: true,
      cpp: false,
      csharp: true,
      java: false,
      javascript: true,
      typescript: true,
    },
    autoOptions: {
      autoTab: true,
      autoNewline: false,
    },
    minCodeSnippetLength: 10,
    maxCodeSnippetLength: 30,
    sortType: 'random',
    currentCodeSnippetIndex: 0,
    currentSnippet: null,
  });
});

describe('Sidebar Component', () => {
  it('should update language filter when checkboxes are clicked', () => {
    // Spy on the store method
    const mockSetLanguageFilter = vi.spyOn(
      useCodeSnippetStore.getState(),
      'setLanguageFilter'
    );

    render(<Sidebar />);

    const pythonCheckbox = screen.getByLabelText('Python');
    const cppCheckbox = screen.getByLabelText('C++');

    // Toggle checkboxes
    fireEvent.click(pythonCheckbox);
    fireEvent.click(cppCheckbox);

    const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
    fireEvent.click(applyButton);

    expect(mockSetLanguageFilter).toHaveBeenCalledWith({
      python: false,
      cpp: true,
      csharp: true,
      java: false,
      javascript: true,
      typescript: true,
    });

    expect(screen.getByText('Filters Applied!')).toBeInTheDocument();
  });

  it('should update code length slider values', () => {
    render(<Sidebar />);

    const minSliderThumb = screen.getByPlaceholderText('min-value');
    const maxSliderThumb = screen.getByPlaceholderText('max-value');

    expect(minSliderThumb).toHaveValue('10');
    expect(maxSliderThumb).toHaveValue('30');

    act(() => {
      fireEvent.input(minSliderThumb, { target: { value: '15' } });
      fireEvent.input(maxSliderThumb, { target: { value: '25' } });
    });

    expect(minSliderThumb).toHaveValue('15');
    expect(maxSliderThumb).toHaveValue('25');
  });

  it('should update sorting type when radio buttons are clicked', () => {
    const mockSortByIncreasingLength = vi.spyOn(
      useCodeSnippetStore.getState(),
      'sortByIncreasingLength'
    );
    const mockSortByDecreasingLength = vi.spyOn(
      useCodeSnippetStore.getState(),
      'sortByDecreasingLength'
    );
    const mockSortRandomly = vi.spyOn(useCodeSnippetStore.getState(), 'sortRandomly');

    render(<Sidebar />);

    const ascendingRadio = screen.getByLabelText('Ascending Lines of Code');
    const descendingRadio = screen.getByLabelText('Descending Lines of Code');
    const randomRadio = screen.getByLabelText('Random Order');
    const applyButton = screen.getByRole('button', { name: 'Apply Filters' });

    fireEvent.click(ascendingRadio);
    fireEvent.click(applyButton);
    expect(mockSortByIncreasingLength).toHaveBeenCalled();
    expect(screen.getByText('Filters Applied!')).toBeInTheDocument();

    fireEvent.click(descendingRadio);
    fireEvent.click(applyButton);
    expect(mockSortByDecreasingLength).toHaveBeenCalled();
    expect(screen.getByText('Filters Applied!')).toBeInTheDocument();

    fireEvent.click(randomRadio);
    fireEvent.click(applyButton);
    expect(mockSortRandomly).toHaveBeenCalled();
    expect(screen.getByText('Filters Applied!')).toBeInTheDocument();
  });

  it('should update auto options when checkboxes are toggled', () => {
    const mockSetAutoOptions = vi.spyOn(useCodeSnippetStore.getState(), 'setAutoOptions');

    render(<Sidebar />);

    const autoTabCheckbox = screen.getByLabelText('Auto-tab');
    const autoNewlineCheckbox = screen.getByLabelText('Auto-newline');
    const applyButton = screen.getByRole('button', { name: 'Apply Filters' });

    fireEvent.click(autoTabCheckbox);
    fireEvent.click(autoNewlineCheckbox);
    fireEvent.click(applyButton);

    expect(mockSetAutoOptions).toHaveBeenCalledWith({
      autoTab: false,
      autoNewline: true,
    });

    expect(screen.getByText('Filters Applied!')).toBeInTheDocument();
  });

  it('should display a message when no filters are applied', async () => {
    render(<Sidebar />);

    const applyButton = screen.getByRole('button', { name: 'Apply Filters' });
    fireEvent.click(applyButton);

    // Check for the filter change message
    expect(screen.getByText('No Filters Applied.')).toBeInTheDocument();
  });
});

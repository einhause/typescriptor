import { render, screen, fireEvent } from '@testing-library/react';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import SnippetCompleteModal from '../SnippetCompleteModal';
import useKeyboardStore from '@/store/keyboardStore';
import useCodeSnippetStore from '@/store/codeSnippetStore';

describe('SnippetCompleteModal Component', () => {
  beforeEach(() => {
    // Reset Zustand stores before each test
    useKeyboardStore.setState({
      charactersTyped: 100,
      wordsPerMinute: 60,
      correctCharacters: 90,
      incorrectCharacters: 10,
      averageWordsPerMinute: 55,
      wordsPerMinuteHistory: [50, 60, 55, 58, 59],
      resetKeyboardProgress: vi.fn(),
    });

    useCodeSnippetStore.setState({
      setNextSnippet: vi.fn(),
    });
  });

  const openModal = () => {
    render(<SnippetCompleteModal isOpen={true} />);
  };

  it('should render the modal with all the correct information', () => {
    openModal();

    // Check if the modal is rendered
    expect(screen.getByTestId('SnippetCompleteModal')).toBeInTheDocument();

    // Check the content inside the modal
    expect(screen.getByText('Snippet Complete!')).toBeInTheDocument();
    expect(screen.getByText('Characters Typed:')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();

    expect(screen.getByText('Correct Characters:')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();

    expect(screen.getByText('Incorrect Characters:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Words per minute (WPM):')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();

    expect(screen.getByText('Average WPM:')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();

    // Check the WPM history
    expect(screen.getByText('Last 5 WPM:')).toBeInTheDocument();
    expect(screen.getByText('59 58 55 60 50')).toBeInTheDocument();
  });

  it('should call setNextSnippet and resetKeyboardProgress on clicking "Next Snippet"', () => {
    openModal();

    const setNextSnippetMock = useCodeSnippetStore.getState().setNextSnippet;
    const resetKeyboardProgressMock = useKeyboardStore.getState().resetKeyboardProgress;

    const nextSnippetButton = screen.getByText('Next Snippet');
    fireEvent.click(nextSnippetButton);

    expect(setNextSnippetMock).toHaveBeenCalled();
    expect(resetKeyboardProgressMock).toHaveBeenCalled();
  });

  it('should close the modal when the close button is clicked', () => {
    openModal();

    const resetKeyboardProgressMock = useKeyboardStore.getState().resetKeyboardProgress;
    const closeButton = screen.getByText('✕');
    fireEvent.click(closeButton);

    expect(resetKeyboardProgressMock).toHaveBeenCalled();
  });

  it('should close the modal when the Escape key is pressed', () => {
    render(<SnippetCompleteModal isOpen={true} />);

    const resetKeyboardProgressMock = useKeyboardStore.getState().resetKeyboardProgress;
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(resetKeyboardProgressMock).toHaveBeenCalled();
  });

  it('should not render the modal when isOpen is false', () => {
    render(<SnippetCompleteModal isOpen={false} />);
    expect(screen.queryByTestId('SnippetCompleteModal')).not.toBeInTheDocument();
  });
});

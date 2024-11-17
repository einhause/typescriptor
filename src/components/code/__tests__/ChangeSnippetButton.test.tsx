import { render, screen, fireEvent } from '@testing-library/react';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

import ChangeSnippetButton from '../ChangeSnippetButton';
import useCodeSnippetStore from '@/store/codeSnippetStore';
import useKeyboardStore from '@/store/keyboardStore';

describe('ChangeSnippetButton Component', () => {
  beforeEach(() => {
    useCodeSnippetStore.setState({
      setNextSnippet: vi.fn(),
      setPrevSnippet: vi.fn(),
    });

    useKeyboardStore.setState({
      showModal: false,
    });
  });

  const renderButton = (direction: 'prev' | 'next') => {
    render(<ChangeSnippetButton changeSnippetDirection={direction} />);
  };

  it('should call setNextSnippet when the "Next" button is clicked', () => {
    const setNextSnippetMock = useCodeSnippetStore.getState().setNextSnippet;

    renderButton('next');
    const nextButton = screen.getByTestId('next');
    fireEvent.click(nextButton);

    expect(setNextSnippetMock).toHaveBeenCalled();
  });

  it('should call setPrevSnippet when the "Previous" button is clicked', () => {
    const setPrevSnippetMock = useCodeSnippetStore.getState().setPrevSnippet;

    renderButton('prev');
    const prevButton = screen.getByTestId('prev');
    fireEvent.click(prevButton);

    expect(setPrevSnippetMock).toHaveBeenCalled();
  });

  it('should not call setNextSnippet or setPrevSnippet if showModal is true', () => {
    // Set showModal to true
    useKeyboardStore.setState({ showModal: true });

    const setNextSnippetMock = useCodeSnippetStore.getState().setNextSnippet;
    const setPrevSnippetMock = useCodeSnippetStore.getState().setPrevSnippet;

    renderButton('next');
    const nextButton = screen.getByTestId('next');
    fireEvent.click(nextButton);

    expect(setNextSnippetMock).not.toHaveBeenCalled();

    renderButton('prev');
    const prevButton = screen.getByTestId('prev');
    fireEvent.click(prevButton);

    expect(setPrevSnippetMock).not.toHaveBeenCalled();
  });

  it('should have a disabled style when showModal is true', () => {
    // Set showModal to true
    useKeyboardStore.setState({ showModal: true });

    renderButton('next');
    const nextButton = screen.getByTestId('next');

    // Check that the button has a disabled class
    expect(nextButton).toHaveClass('cursor-not-allowed');
  });

  it('should render the correct icon based on direction', () => {
    // Test for the "next" button
    renderButton('next');
    expect(screen.getByTestId('next').querySelector('svg')).toBeInTheDocument();

    // Test for the "prev" button
    renderButton('prev');
    expect(screen.getByTestId('prev').querySelector('svg')).toBeInTheDocument();
  });
});

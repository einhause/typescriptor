import { describe, it, beforeEach, expect } from 'vitest';
import { act } from '@testing-library/react';
import useKeyboardStore from '../keyboardStore';
import useCodeSnippetStore, { CodeSnippet } from '../codeSnippetStore';

describe('useKeyboardStore', () => {
  beforeEach(() => {
    // Reset the store state before each test to ensure clean tests
    act(() => {
      useKeyboardStore.getState().resetKeyboardProgress();
    });
    // Mock localStorage
    global.localStorage.clear();
  });

  it('should update pressedKeys on handleKeyDown', () => {
    const { handleKeyDown, isKeyPressed } = useKeyboardStore.getState();

    // Simulate pressing the "a" key
    const event = new KeyboardEvent('keydown', { key: 'a', code: 'KeyA' });
    act(() => handleKeyDown(event));

    expect(isKeyPressed('a')).toBe(true);
  });

  it('should update pressedKeys on handleKeyUp', () => {
    const { handleKeyDown, handleKeyUp, isKeyPressed } = useKeyboardStore.getState();

    // Simulate pressing and releasing the "Shift" key
    act(() => {
      handleKeyDown(new KeyboardEvent('keydown', { key: 'Shift', code: 'ShiftLeft' }));
      handleKeyUp(new KeyboardEvent('keyup', { key: 'Shift', code: 'ShiftLeft' }));
    });

    expect(isKeyPressed('Shift')).toBe(false);
  });

  it('should start and stop timer correctly', () => {
    const { startTimer, stopTimer } = useKeyboardStore.getState();

    // Start the timer
    act(() => startTimer());
    expect(useKeyboardStore.getState().startTime).not.toBeNull();

    // Stop the timer
    act(() => stopTimer());
    expect(useKeyboardStore.getState().endTime).not.toBeNull();
  });

  it('should calculate words per minute correctly', () => {
    const { startTimer, stopTimer, calculateCurrentWordsPerMinute } =
      useKeyboardStore.getState();

    // Simulate typing 50 characters in 10 seconds
    act(() => {
      useKeyboardStore.setState({ charactersTyped: 50 });
      startTimer();
      useKeyboardStore.setState({ startTime: Date.now() - 10000 });
      stopTimer();
      calculateCurrentWordsPerMinute();
    });

    const { wordsPerMinute } = useKeyboardStore.getState();
    expect(wordsPerMinute).toBe(60); // 50 characters -> 10 words in 10 seconds -> 60 WPM
  });

  it('should update words per minute history and calculate average', () => {
    const { updateWordsPerMinuteHistory, calculateAverageWordsPerMinute } =
      useKeyboardStore.getState();

    act(() => {
      useKeyboardStore.setState({ wordsPerMinute: 80 });
      updateWordsPerMinuteHistory();
      useKeyboardStore.setState({ wordsPerMinute: 100 });
      updateWordsPerMinuteHistory();
      calculateAverageWordsPerMinute();
    });

    const { wordsPerMinuteHistory, averageWordsPerMinute } = useKeyboardStore.getState();

    // Ensure both are recorded in history and average is calculated
    expect(wordsPerMinuteHistory).toEqual([80, 100]);
    expect(averageWordsPerMinute).toBe(90);

    // Ensure it is saved in localStorage
    const savedHistory = JSON.parse(
      localStorage.getItem('wordsPerMinuteHistory') || '[]'
    );
    const savedAverage = JSON.parse(localStorage.getItem('averageWordsPerMinute') || '0');

    expect(savedHistory).toEqual([80, 100]);
    expect(savedAverage).toBe(90);
  });

  it('should advance characters with mistakes and complete snippet', () => {
    const mockSnippet: CodeSnippet = {
      language: 'python',
      description: 'Test snippet',
      linesOfCode: 3,
      code: 'abc',
    };

    // Setting test mock state
    act(() => {
      useCodeSnippetStore.setState({
        currentSnippet: mockSnippet,
        autoOptions: { autoTab: false, autoNewline: false },
      });
    });

    const { advanceCharacter, startTimer } = useKeyboardStore.getState();

    // Simulate typing characters
    act(() => {
      startTimer();
      advanceCharacter('a');
      advanceCharacter('b');
      advanceCharacter('d'); //incorrect character
      advanceCharacter('c');
    });

    // Fetch the updated state after typing
    const {
      currentCharIndex,
      charactersTyped,
      correctCharacters,
      incorrectCharacters,
      showModal,
    } = useKeyboardStore.getState();

    // Typing all required characters resulted in finish of snippet
    expect(currentCharIndex).toBe(3);
    expect(charactersTyped).toBe(4);
    expect(correctCharacters).toBe(3);
    expect(incorrectCharacters).toBe(1);
    expect(showModal).toBe(true);
  });
});

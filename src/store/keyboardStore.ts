import { create } from 'zustand';
import useCodeSnippetStore from './codeSnippetStore';

// Constants
const AVERAGE_WORD_LENGTH = 5;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;

interface KeyboardState {
  pressedKeys: Set<string>;
  isShiftActive: boolean;
  isCapsLockActive: boolean;
  currentCharIndex: number;
  currentLineIndex: number;
  incorrectKey: boolean;
  startTime: number | null;
  endTime: number | null;
  charactersTyped: number;
  correctCharacters: number;
  incorrectCharacters: number;
  wordsPerMinute: number;
  wordsPerMinuteHistory: number[];
  averageWordsPerMinute: number;
  showModal: boolean;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  isKeyPressed: (key: string) => boolean;
  advanceCharacter: (char: string) => void;
  startTimer: () => void;
  stopTimer: () => void;
  calculateSnippetStatistics: () => void;
  calculateCurrentWordsPerMinute: () => void;
  updateWordsPerMinuteHistory: () => void;
  calculateAverageWordsPerMinute: () => void;
  resetKeyboardProgress: () => void;
}

// Regular expression to filter valid character keys
const validCharRegex = /^[a-zA-Z0-9`~!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]$/;

const useKeyboardStore = create<KeyboardState>((set, get) => ({
  pressedKeys: new Set<string>(),
  isShiftActive: false,
  isCapsLockActive: false,
  currentLineIndex: 0,
  currentCharIndex: 0,
  incorrectKey: false,
  startTime: null,
  endTime: null,
  charactersTyped: 0,
  correctCharacters: 0,
  incorrectCharacters: 0,
  wordsPerMinute: 0,
  wordsPerMinuteHistory: JSON.parse(
    localStorage.getItem('wordsPerMinuteHistory') || '[]'
  ),
  averageWordsPerMinute: 0,
  showModal: false,

  handleKeyDown: (event: KeyboardEvent) => {
    const { key, code, repeat } = event;
    if (repeat) return;
    const { pressedKeys, showModal, advanceCharacter } = get();

    if (showModal) return;

    if (key === 'Tab' || key === ' ' || key === 'Enter' || key === "'" || key === '/') {
      // Prevent default browser behavior
      event.preventDefault();
    }

    const newPressedKeys = new Set(pressedKeys);

    if (event.getModifierState('CapsLock')) {
      set({ isCapsLockActive: true });
    }

    if (code === 'ShiftLeft' || code === 'ShiftRight') {
      set({ isShiftActive: true });
      newPressedKeys.add(code);
    } else {
      newPressedKeys.add(key === ' ' ? 'Space' : key);
    }

    // Only process if the key is a valid character
    if (validCharRegex.test(key) || key === 'Enter' || key === 'Tab') {
      advanceCharacter(key);
    }

    set({ pressedKeys: newPressedKeys });
  },

  handleKeyUp: (event: KeyboardEvent) => {
    const { key, code, repeat } = event;
    if (repeat) return;
    const { pressedKeys, showModal } = get();

    if (showModal) return;

    const newPressedKeys = new Set(pressedKeys);
    const shiftReleased = code === 'ShiftLeft' || code === 'ShiftRight';

    if (!event.getModifierState('CapsLock')) {
      set({ isCapsLockActive: false });
    }

    if (shiftReleased) {
      set({ isShiftActive: false });
      newPressedKeys.delete('ShiftLeft');
      newPressedKeys.delete('ShiftRight');
    } else {
      newPressedKeys.delete(key === ' ' ? 'Space' : key);
    }

    set({ pressedKeys: newPressedKeys });
  },

  isKeyPressed: (key: string): boolean => {
    const { pressedKeys } = get();
    return pressedKeys.has(key);
  },

  advanceCharacter: (char: string) => {
    const {
      currentCharIndex,
      startTime,
      charactersTyped,
      correctCharacters,
      incorrectCharacters,
      showModal,
      startTimer,
      stopTimer,
      calculateSnippetStatistics,
    } = get();
    const { currentSnippet, autoOptions } = useCodeSnippetStore.getState();
    const { autoTab, autoNewline } = autoOptions;

    if (!currentSnippet || showModal) {
      return;
    }

    const codeSnippet = currentSnippet.code;
    const targetChar = codeSnippet[currentCharIndex];

    // Check if the typed character matches the current character in the snippet
    if (
      (targetChar === '\n' && char === 'Enter') ||
      (targetChar === '\t' && char === 'Tab') ||
      char === targetChar
    ) {
      let nextIndex = currentCharIndex + 1;

      // Automatically advance through tabs/newlines if auto options are enabled
      if (nextIndex < codeSnippet.length) {
        while (
          nextIndex < codeSnippet.length &&
          targetChar === '\n' &&
          ((autoTab && codeSnippet[nextIndex] === '\t') ||
            (autoNewline && codeSnippet[nextIndex] === '\n'))
        ) {
          nextIndex++;
        }
      }

      // Update state after advancing through auto characters
      set({
        currentCharIndex: nextIndex,
        charactersTyped: charactersTyped + 1,
        correctCharacters: correctCharacters + 1,
        incorrectKey: false,
      });

      // Start timer if this is the first character typed
      if (currentCharIndex === 0) {
        startTimer();
      }

      // Check if the snippet is complete
      if (nextIndex === codeSnippet.length) {
        stopTimer();
        calculateSnippetStatistics();
        set({ showModal: true, pressedKeys: new Set() });
      }
    } else {
      // Mark as incorrect if the character doesn’t match
      set({ incorrectKey: true });
      if (startTime !== null) {
        set({
          charactersTyped: charactersTyped + 1,
          incorrectCharacters: incorrectCharacters + 1,
        });
      }
    }
  },

  startTimer: () => {
    const { startTime } = get();
    if (startTime === null) {
      set({
        startTime: Date.now(),
      });
    }
  },

  stopTimer: () => {
    const { startTime } = get();
    if (startTime !== null) {
      set({
        endTime: Date.now(),
      });
    }
  },

  calculateSnippetStatistics: () => {
    const {
      calculateCurrentWordsPerMinute,
      calculateAverageWordsPerMinute,
      updateWordsPerMinuteHistory,
    } = get();

    calculateCurrentWordsPerMinute();
    updateWordsPerMinuteHistory();
    calculateAverageWordsPerMinute();
  },

  calculateCurrentWordsPerMinute: () => {
    const { startTime, endTime, charactersTyped } = get();
    if (startTime !== null && endTime !== null) {
      const timeElapsed = (endTime - startTime) / MILLISECONDS_PER_SECOND;
      const wordsPerMinute = Math.round(
        (charactersTyped / AVERAGE_WORD_LENGTH) * (SECONDS_PER_MINUTE / timeElapsed)
      );
      set({ wordsPerMinute });
    }
  },

  updateWordsPerMinuteHistory: () => {
    const { wordsPerMinuteHistory, wordsPerMinute } = get();
    const updatedHistory = [...wordsPerMinuteHistory, wordsPerMinute];
    localStorage.setItem('wordsPerMinuteHistory', JSON.stringify(updatedHistory));
    set({ wordsPerMinuteHistory: updatedHistory });
  },

  calculateAverageWordsPerMinute: () => {
    const { wordsPerMinuteHistory } = get();
    const total = wordsPerMinuteHistory.reduce((acc, wpm) => acc + wpm, 0);
    const average =
      wordsPerMinuteHistory.length > 0 ? total / wordsPerMinuteHistory.length : 0;
    set({ averageWordsPerMinute: Math.round(average) });
    localStorage.setItem('averageWordsPerMinute', JSON.stringify(Math.round(average)));
  },

  resetKeyboardProgress: () => {
    set({
      currentCharIndex: 0,
      currentLineIndex: 0,
      incorrectKey: false,
      startTime: null,
      endTime: null,
      charactersTyped: 0,
      wordsPerMinute: 0,
      showModal: false,
      pressedKeys: new Set(),
    });
  },
}));

export default useKeyboardStore;

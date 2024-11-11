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
  showModal: boolean;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  isKeyPressed: (key: string) => boolean;
  advanceCharacter: (char: string) => void;
  startTimer: () => void;
  stopTimer: () => void;
  calculateSnippetStatistics: () => void;
  resetKeyboardProgress: () => void;
}

// Regular expression to filter valid character keys
const validCharRegex = /^[a-zA-Z0-9`~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/? ]$/;

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
  showModal: false,

  handleKeyDown: (event: KeyboardEvent) => {
    const { key, code } = event;
    const { pressedKeys, advanceCharacter } = get();

    if (key === 'Tab') {
      // Prevent default browser behavior for Tab key+
      event.preventDefault();
    }
    if (key === ' ') {
      // Prevent auto scrolling down on overflowing content in CodeSecton
      event.preventDefault();
    }
    if (key === 'Enter') {
      event.preventDefault();
    }

    const newPressedKeys = new Set(pressedKeys);
    if (code === 'ShiftLeft' || code === 'ShiftRight') {
      set({ isShiftActive: true });
      event.preventDefault();
    }

    if (event.getModifierState('CapsLock')) {
      set({ isCapsLockActive: true });
    }

    newPressedKeys.add(key === ' ' ? 'Space' : key);
    if (code === 'ShiftLeft') newPressedKeys.add('ShiftLeft');
    if (code === 'ShiftRight') newPressedKeys.add('ShiftRight');

    // Only process if the key is a valid character
    if (validCharRegex.test(key) || key === 'Enter' || key === 'Tab') {
      advanceCharacter(key);
    }

    set({ pressedKeys: newPressedKeys });
  },

  handleKeyUp: (event: KeyboardEvent) => {
    const { key, code } = event;
    const { pressedKeys } = get();

    const newPressedKeys = new Set(pressedKeys);

    if (code === 'ShiftLeft' || code === 'ShiftRight') {
      set({ isShiftActive: false });
    }

    if (!event.getModifierState('CapsLock')) {
      set({ isCapsLockActive: false });
    }

    newPressedKeys.delete(key === ' ' ? 'Space' : key);
    if (code === 'ShiftLeft') newPressedKeys.delete('ShiftLeft');
    if (code === 'ShiftRight') newPressedKeys.delete('ShiftRight');

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
    const { currentSnippet } = useCodeSnippetStore.getState();
    if (!currentSnippet || showModal) {
      return;
    }
    const codeSnippet = currentSnippet.code;
    const targetChar = codeSnippet[currentCharIndex];

    // Handling Enter and Tab specifically for newline and tab characters
    if (
      (targetChar === '\n' && char === 'Enter') ||
      (targetChar === '\t' && char === 'Tab') ||
      char === targetChar
    ) {
      // If the typed character matches, move to the next character
      if (targetChar === '\n') {
        // Advance to the next character after the newline
        let nextIndex = currentCharIndex + 1;

        // Automatically advance through tab characters
        while (
          nextIndex < codeSnippet.length &&
          (codeSnippet[nextIndex] === '\t' || codeSnippet[nextIndex] === '\n')
        ) {
          nextIndex++;
        }

        set({
          currentCharIndex: nextIndex, // Move to the first non-tab character
          incorrectKey: false,
        });
      } else {
        // Move to the next character for other matches

        if (currentCharIndex === 0) {
          startTimer();
        }

        set({
          currentCharIndex: currentCharIndex + 1,
          charactersTyped: charactersTyped + 1,
          correctCharacters: correctCharacters + 1,
          incorrectKey: false,
        });

        if (currentCharIndex + 1 === codeSnippet.length) {
          stopTimer();
          calculateSnippetStatistics();
          set({ showModal: true });
        }
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
    const { startTime, endTime, charactersTyped } = get();
    if (startTime !== null && endTime !== null) {
      const timeElapsed = (endTime - startTime) / MILLISECONDS_PER_SECOND;
      const wordsPerMinute = Math.round(
        (charactersTyped / AVERAGE_WORD_LENGTH) * (SECONDS_PER_MINUTE / timeElapsed)
      );
      set({ wordsPerMinute });
    }
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
    });
  },
}));

export default useKeyboardStore;

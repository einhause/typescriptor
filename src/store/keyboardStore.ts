import { create } from 'zustand';
import useCodeSnippetStore from './codeSnippetStore';

interface KeyboardState {
  pressedKeys: Set<string>;
  isShiftActive: boolean;
  isCapsLockActive: boolean;
  currentCharIndex: number;
  currentLineIndex: number;
  incorrectKey: boolean;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
  isKeyPressed: (key: string) => boolean;
  advanceCharacter: (char: string) => void;
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

  handleKeyDown: (event: KeyboardEvent) => {
    const { key, code } = event;
    const { pressedKeys, advanceCharacter } = get();

    if (key === 'Tab') {
      // Prevent default browser behavior for Tab key+
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
    const { currentCharIndex } = get();
    const { currentSnippet } = useCodeSnippetStore.getState();
    if (!currentSnippet) {
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
        while (nextIndex < codeSnippet.length && codeSnippet[nextIndex] === '\t') {
          nextIndex++;
        }

        set({
          currentCharIndex: nextIndex, // Move to the first non-tab character
          incorrectKey: false,
        });
      } else {
        // Move to the next character for other matches
        set({
          currentCharIndex: currentCharIndex + 1,
          incorrectKey: false,
        });
      }
    } else {
      // Mark as incorrect if the character doesn’t match
      set({ incorrectKey: true });
    }
  },

  resetKeyboardProgress: () => {
    set({
      currentCharIndex: 0,
      currentLineIndex: 0,
      incorrectKey: false,
    });
  },
}));

export default useKeyboardStore;

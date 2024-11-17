import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import VirtualKeyboard from '../VirtualKeyboard';
import useKeyboardStore from '@/store/keyboardStore';

describe('VirtualKeyboard Component', () => {
  // Reset the Zustand store before each test
  beforeEach(() => {
    useKeyboardStore.setState({
      pressedKeys: new Set(),
      isShiftActive: false,
      isCapsLockActive: false,
      currentCharIndex: 0,
      currentLineIndex: 0,
      incorrectKey: false,
      charactersTyped: 0,
      correctCharacters: 0,
      incorrectCharacters: 0,
      showModal: false,
    });
  });

  it('displays regular keys when no modifiers are active', () => {
    render(<VirtualKeyboard />);

    // Check for some regular keys
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('Backspace')).toBeInTheDocument();
  });

  it('displays shifted keys when Shift is active', () => {
    // Update the Zustand store state to simulate Shift being active
    useKeyboardStore.setState({ isShiftActive: true });

    render(<VirtualKeyboard />);

    // Check for shifted keys
    expect(screen.getByText('!')).toBeInTheDocument();
    expect(screen.getByText('@')).toBeInTheDocument();
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('displays caps lock keys when Caps Lock is active', () => {
    // Update the Zustand store state to simulate Caps Lock being active
    useKeyboardStore.setState({ isCapsLockActive: true });

    render(<VirtualKeyboard />);

    // Check for caps lock keys
    expect(screen.getByText('Q')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Z')).toBeInTheDocument();
  });

  it('updates pressedKeys on key down and key up', () => {
    render(<VirtualKeyboard />);

    // Simulate a keydown event for the "a" key
    fireEvent.keyDown(window, { key: 'a' });
    let { pressedKeys } = useKeyboardStore.getState();
    expect(pressedKeys.has('a')).toBe(true);

    // Simulate a keyup event for the "a" key
    fireEvent.keyUp(window, { key: 'a' });
    pressedKeys = useKeyboardStore.getState().pressedKeys;
    expect(pressedKeys.has('a')).toBe(false);
  });

  it('toggles Shift and Caps Lock state correctly', () => {
    render(<VirtualKeyboard />);

    // Simulate pressing the Shift key
    fireEvent.keyDown(window, { key: 'Shift', code: 'ShiftLeft' });
    expect(useKeyboardStore.getState().isShiftActive).toBe(true);

    // Simulate releasing the Shift key
    fireEvent.keyUp(window, { key: 'Shift', code: 'ShiftLeft' });
    expect(useKeyboardStore.getState().isShiftActive).toBe(false);

    // Simulate pressing the Caps Lock key (toggle on)
    fireEvent.keyDown(window, { key: 'CapsLock' });
    useKeyboardStore.setState((state) => ({
      isCapsLockActive: !state.isCapsLockActive,
    }));
    expect(useKeyboardStore.getState().isCapsLockActive).toBe(true);

    // Simulate pressing the Caps Lock key again (toggle off)
    fireEvent.keyDown(window, { key: 'CapsLock' });
    useKeyboardStore.setState((state) => ({
      isCapsLockActive: !state.isCapsLockActive,
    }));
    expect(useKeyboardStore.getState().isCapsLockActive).toBe(false);
  });

  it('handles Space key correctly', () => {
    render(<VirtualKeyboard />);

    // Simulate pressing the Space key
    fireEvent.keyDown(window, { key: ' ' });
    const { pressedKeys } = useKeyboardStore.getState();
    expect(pressedKeys.has('Space')).toBe(true);

    // Simulate releasing the Space key
    fireEvent.keyUp(window, { key: ' ' });
    expect(useKeyboardStore.getState().pressedKeys.has('Space')).toBe(false);
  });
});

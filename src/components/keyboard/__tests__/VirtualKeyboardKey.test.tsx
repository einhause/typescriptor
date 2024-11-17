import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import VirtualKeyboardKey from '../VirtualKeyboardKey';
import useKeyboardStore from '@/store/keyboardStore';

describe('VirtualKeyboardKey', () => {
  const renderComponent = (keyboardKey: string) =>
    render(<VirtualKeyboardKey keyboardKey={keyboardKey} />);

  it('renders the component correctly with the given key', () => {
    renderComponent('A');
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('A');
  });

  it('applies the correct width class based on key type', () => {
    const testCases = [
      { key: 'Backspace', expectedWidth: 'w-28' },
      { key: 'Caps Lock', expectedWidth: 'w-24' },
      { key: 'Space', expectedWidth: 'w-64' },
      { key: 'A', expectedWidth: 'w-10' },
    ];

    testCases.forEach(({ key, expectedWidth }) => {
      renderComponent(key);
      const button = screen.getByRole('button');
      expect(button).toHaveClass(expectedWidth);
      cleanup();
    });
  });

  it('applies active styles when key is pressed', () => {
    // Set `isKeyPressed` state to simulate the key being pressed
    useKeyboardStore.setState({ isKeyPressed: (key) => key === 'A' });

    renderComponent('A');
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white text-blue-500');
  });

  it('applies active styles when Caps Lock is active', () => {
    // Set `isCapsLockActive` state to simulate Caps Lock being active
    useKeyboardStore.setState({ isCapsLockActive: true });

    renderComponent('Caps Lock');
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white text-blue-500');
  });

  it('applies inactive styles when key is not pressed', () => {
    // Ensure key is not pressed
    useKeyboardStore.setState({ isKeyPressed: (key) => key !== 'A' });

    renderComponent('A');
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-500 text-white');
  });

  it('renders Shift as label when ShiftLeft or ShiftRight is passed', () => {
    renderComponent('ShiftLeft');
    renderComponent('ShiftRight');

    expect(screen.getAllByText('Shift')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Shift')[1]).toBeInTheDocument();
  });
});

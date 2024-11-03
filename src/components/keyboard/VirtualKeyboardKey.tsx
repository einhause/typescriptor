import useKeyboardStore from '../../store/keyboardStore';

interface VirtuakKeyboardKeyProps {
  keyboardKey: string;
}

export default function VirtuakKeyboardKey({ keyboardKey }: VirtuakKeyboardKeyProps) {
  const { isKeyPressed, isCapsLockActive } = useKeyboardStore();

  const getKeyWidth = (keyboardKey: string): string => {
    switch (keyboardKey) {
      case 'Backspace':
      case 'Enter':
      case 'ShiftLeft':
      case 'ShiftRight':
        return 'w-28';
      case 'Caps Lock':
      case 'Tab':
        return 'w-24';
      case 'Space':
        return 'w-64';
      default:
        return 'w-10';
    }
  };

  return (
    <button
      tabIndex={-1}
      disabled
      className={`p-2 ${getKeyWidth(
        keyboardKey
      )} rounded flex items-center justify-center cursor-grab
                ${
                  isKeyPressed(keyboardKey) ||
                  (keyboardKey === 'Caps Lock' && isCapsLockActive)
                    ? 'bg-white text-blue-500'
                    : 'bg-blue-500 text-white'
                }`}
    >
      <span className="select-none">
        {keyboardKey.startsWith('Shift') ? 'Shift' : keyboardKey}
      </span>
    </button>
  );
}

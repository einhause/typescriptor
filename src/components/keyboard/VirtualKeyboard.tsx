import { Fragment } from 'react/jsx-runtime';
import useKeyboardStore from '../../store/keyboardStore';
import VirtuakKeyboardKey from './VirtualKeyboardKey';

const regularKeys: string[][] = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps Lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
  ['Space'],
];

const shiftedKeys: string[][] = [
  ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|'],
  ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'],
  ['ShiftLeft', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'ShiftRight'],
  ['Space'],
];

const capsLockKeys: string[][] = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['ShiftLeft', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'ShiftRight'],
  ['Space'],
];

export default function VirtualKeyboard() {
  const { isShiftActive, isCapsLockActive } = useKeyboardStore();

  const getKeysToShow = (): string[][] => {
    if (isShiftActive) {
      return shiftedKeys;
    } else if (isCapsLockActive) {
      return capsLockKeys;
    } else {
      return regularKeys;
    }
  };

  return (
    <div className="bg-gray-700 p-2 rounded-lg shadow-md border border-l-fuchsia-50 inline-block">
      {getKeysToShow().map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2 my-2">
          {row.map((keyboardKey, keyIndex) => (
            <Fragment key={keyIndex}>
              <VirtuakKeyboardKey keyboardKey={keyboardKey} />
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

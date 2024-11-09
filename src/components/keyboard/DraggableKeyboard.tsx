import { useState, useRef, useEffect } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import VirtualKeyboard from './VirtualKeyboard';

type DraggableKeyboardProps = {
  codeSectionWidth: number;
};

export default function DraggableKeyboard({ codeSectionWidth }: DraggableKeyboardProps) {
  const [keyboardPosition, setKeyboardPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const keyboardRef = useRef<HTMLDivElement | null>(null);

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setKeyboardPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    if (keyboardRef.current) {
      const bottomOfScreen: number = window.scrollY + window.innerHeight;
      const keyboardHeight: number = keyboardRef.current.offsetHeight;
      const yOffset: number = 32;

      const keyboardWidth: number = keyboardRef.current.offsetWidth;

      setKeyboardPosition((_prev) => {
        return {
          x: (codeSectionWidth - keyboardWidth) / 2,
          y: bottomOfScreen - keyboardHeight - yOffset,
        };
      });
    }
  }, [codeSectionWidth]);

  return (
    <Draggable bounds="parent" position={keyboardPosition} onDrag={handleDrag}>
      <div className="absolute cursor-grab" ref={keyboardRef}>
        <VirtualKeyboard />
      </div>
    </Draggable>
  );
}

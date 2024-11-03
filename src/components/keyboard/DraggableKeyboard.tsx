import { useState, useRef, useEffect } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import VirtualKeyboard from './VirtualKeyboard';

export default function DraggableKeyboard() {
  const [keyboardPosition, setKeyboardPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const ref = useRef<HTMLDivElement | null>(null);

  const handleDrag = (_e: DraggableEvent, data: DraggableData) => {
    setKeyboardPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    if (ref.current) {
      const bottomOfScreen: number = window.scrollY + window.innerHeight;
      const height: number = ref.current.offsetHeight;
      const yOffset: number = 32;
      const innerWidth = window.innerWidth;
      const width: number = ref.current.offsetWidth;

      setKeyboardPosition((_prev) => {
        return {
          x: (innerWidth - width) / 2,
          y: bottomOfScreen - height - yOffset,
        };
      });
    }
  }, []);

  return (
    <Draggable bounds="parent" position={keyboardPosition} onDrag={handleDrag}>
      <div className="absolute cursor-grab" ref={ref}>
        <VirtualKeyboard />
      </div>
    </Draggable>
  );
}

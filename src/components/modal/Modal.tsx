import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-[80%] max-w-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white font-bold text-lg"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

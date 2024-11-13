import { ChangeEvent } from 'react';

type RadioProps = {
  value: string;
  label: string;
  checked: boolean;
  onChangeCallback: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Radio({ value, label, checked, onChangeCallback }: RadioProps) {
  return (
    <label className="inline-flex items-center">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChangeCallback}
        className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="ml-2">{label}</span>
    </label>
  );
}

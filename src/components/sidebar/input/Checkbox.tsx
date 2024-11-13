import { ChangeEvent } from 'react';

type CheckboxProps = {
  name: string;
  label: string;
  checked: boolean;
  onChangeCallback: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox({
  name,
  label,
  checked,
  onChangeCallback,
}: CheckboxProps) {
  return (
    <label className="inline-flex items-center my-1">
      <input
        type="checkbox"
        name={name}
        className="h-5 w-5 rounded"
        checked={checked}
        onChange={onChangeCallback}
      />
      <span className="ml-2">{label}</span>
    </label>
  );
}

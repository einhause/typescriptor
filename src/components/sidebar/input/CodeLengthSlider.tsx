import MultiRangeSlider from 'multi-range-slider-react';

type CodeLengthSiderProps = {
  minCodeValue: number;
  maxCodeValue: number;
  minValueChanged: React.Dispatch<React.SetStateAction<number>>;
  maxValueChanged: React.Dispatch<React.SetStateAction<number>>;
};

export default function CodeLengthSlider({
  minCodeValue,
  maxCodeValue,
  minValueChanged,
  maxValueChanged,
}: CodeLengthSiderProps) {
  return (
    <MultiRangeSlider
      min={10}
      max={30}
      step={5}
      stepOnly={true}
      minValue={minCodeValue}
      maxValue={maxCodeValue}
      canMinMaxValueSame={false}
      onChange={(e) => {
        minValueChanged(e.minValue);
        maxValueChanged(e.maxValue);
      }}
      label={true}
      ruler={false}
      className="border-none shadow-none"
      barLeftColor="gray"
      barInnerColor="rgb(30 64 175)"
      barRightColor="gray"
      thumbLeftColor="white"
      thumbRightColor="white"
    />
  );
}

import {
  ChevronLeft,
  CodeXml,
  SlidersHorizontal,
  ArrowUpDown,
  LucideIcon,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';
import MultiRangeSlider from 'multi-range-slider-react';

type Languages = {
  python: boolean;
  cpp: boolean;
  java: boolean;
  javascript: boolean;
};
type SortType = 'ascending' | 'descending' | 'random';

export function Sidebar() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [languages, setLanguages] = useState<Languages>({
    python: true,
    cpp: false,
    java: false,
    javascript: false,
  });
  const [minLinesOfCode, setMinLinesOfCode] = useState<number>(10);
  const [maxLinesOfCode, setMaxLinesOfCode] = useState<number>(30);
  const [sortType, setSortType] = useState<SortType>('random');

  const handleLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setLanguages((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSidebarExpandButtonClicked = () => {
    setExpanded((prev) => !prev);
  };

  const handleApplyFiltersSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <aside className="float-end">
      <div className="h-full flex flex-col bg-gray-600 border-l border-indigo-300 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center mb-4">
          <button
            className="p-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 border border-indigo-300 mr-2"
            onClick={handleSidebarExpandButtonClicked}
          >
            <ChevronLeft />
          </button>
          <div className={`${expanded ? 'block' : 'hidden'}`}>
            <h2 className="text-2xl">Customization Menu</h2>
          </div>
        </div>
        <ul className={`flex-1 px-3 ${expanded ? 'block' : 'hidden'}`}>
          <SidebarItem Icon={CodeXml} text="Languages">
            <div className="flex flex-col">
              <label className="inline-flex items-center my-1">
                <input
                  type="checkbox"
                  name="python"
                  className="h-5 w-5 rounded"
                  checked={languages.python}
                  onChange={handleLanguageChange}
                />
                <span className="ml-2">Python</span>
              </label>
              <label className="inline-flex items-center my-1">
                <input
                  type="checkbox"
                  name="cpp"
                  className="h-5 w-5 rounded"
                  checked={languages.cpp}
                  onChange={handleLanguageChange}
                />
                <span className="ml-2">C++</span>
              </label>
              <label className="inline-flex items-center my-1">
                <input
                  type="checkbox"
                  name="java"
                  className="h-5 w-5 rounded"
                  checked={languages.java}
                  onChange={handleLanguageChange}
                />
                <span className="ml-2">Java</span>
              </label>
              <label className="inline-flex items-center my-1">
                <input
                  type="checkbox"
                  name="javascript"
                  className="h-5 w-5 rounded"
                  checked={languages.javascript}
                  onChange={handleLanguageChange}
                />
                <span className="ml-2">JavaScript</span>
              </label>
            </div>
          </SidebarItem>
          <SidebarItem Icon={SlidersHorizontal} text="Lines of Code">
            <MultiRangeSlider
              min={10}
              max={30}
              step={5}
              stepOnly={true}
              minValue={minLinesOfCode}
              maxValue={maxLinesOfCode}
              canMinMaxValueSame={false}
              onChange={(e) => {
                setMinLinesOfCode(e.minValue);
                setMaxLinesOfCode(e.maxValue);
              }}
              label={true}
              ruler={false}
              className="border-none shadow-none"
              barLeftColor="gray"
              barInnerColor="rgb(30 64 175)"
              barRightColor="gray"
              thumbLeftColor="white"
              thumbRightColor="white"
            ></MultiRangeSlider>
          </SidebarItem>
          <SidebarItem Icon={ArrowUpDown} text="Sorting">
            <div className="flex flex-col">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="random"
                  checked={sortType === 'random'}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                  className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2">Random Order</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="ascending"
                  checked={sortType === 'ascending'}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                  className="form-radio h-5 w-5 text-blue-800 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2">Ascending Lines of Code</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="descending"
                  checked={sortType === 'descending'}
                  onChange={(e) => setSortType(e.target.value as SortType)}
                  className="form-radio h-5 w-5 text-blue-800 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2">Descending Lines of Code</span>
              </label>
            </div>
          </SidebarItem>
        </ul>
        <div className={`p-4 ${expanded ? 'block' : 'hidden'}`}>
          <button
            className="w-full p-1 bg-blue-900 hover:bg-blue-800 border border-indigo-300 rounded-lg text-lg"
            type="submit"
            onClick={(e) => handleApplyFiltersSubmit(e)}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}

type SidebarItemProps = {
  Icon: LucideIcon;
  text: string;
  children: React.ReactNode;
};

function SidebarItem({ Icon, text, children }: SidebarItemProps) {
  return (
    <li>
      <div className="flex items-center gap-2 mb-4">
        <Icon />
        <span className="text-lg">{text}</span>
      </div>
      <div className="mb-4 mx-4">{children}</div>
    </li>
  );
}

import { useState, useRef, useEffect } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthYearPicker({ onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);

  const dropdownRef = useRef(null);
  const currentDateRef = useRef({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const months = [
    "Jan", "Feb", "Mar",
    "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep",
    "Okt", "Nov", "Des",
  ];

  const handlePrevYear = () => {
    setTempYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setTempYear((prev) => prev + 1);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkCurrentDate = () => {
      const now = new Date();

      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const previous = currentDateRef.current;

      if (
        currentMonth !== previous.month ||
        currentYear !== previous.year
      ) {
        currentDateRef.current = {
          month: currentMonth,
          year: currentYear,
        };

        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);

        setTempMonth(currentMonth);
        setTempYear(currentYear);

        if (onChange) {
          onChange({
            month: currentMonth,
            year: currentYear,
          });
        }
      }
    };

    const interval = setInterval(checkCurrentDate, 60 * 1000);

    return () => clearInterval(interval);
  }, [onChange]);

  const handleToggleOpen = () => {
    if (!isOpen) {
      setTempYear(selectedYear);
      setTempMonth(selectedMonth);
    }
    setIsOpen(!isOpen);
  };

  const handleApply = () => {
    setSelectedYear(tempYear);
    setSelectedMonth(tempMonth);
    setIsOpen(false);

    if (onChange) {
      onChange({ month: tempMonth, year: tempYear });
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggleOpen}
        className="flex items-center justify-between w-60 px-4 py-2.5 bg-white border border-slate-300 rounded-xl shadow-sm hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-700">
            {months[selectedMonth]} {selectedYear}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Tahun
            </h3>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrevYear}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="w-20 text-center text-lg font-semibold text-slate-800">
                {tempYear}
              </span>

              <button
                type="button"
                onClick={handleNextYear}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => setTempMonth(index)}
                  className={`py-2 rounded-lg text-sm transition font-medium cursor-pointer ${
                    tempMonth === index
                      ? "bg-slate-900 text-white shadow-xs"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition cursor-pointer shadow-xs"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
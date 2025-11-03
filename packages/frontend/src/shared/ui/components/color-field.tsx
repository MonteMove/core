'use client';

import React, { useEffect, useRef, useState } from 'react';

import { HexColorPicker } from 'react-colorful';

type ColorFieldProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full lg:w-[240px] h-[38px] border rounded-md flex items-center justify-between px-3 cursor-pointer"
      onClick={() => setOpen((prev) => !prev)}
    >
      <span className="select-none text-sm">{label}</span>

      <div
        className="w-5 h-5 border rounded-sm"
        style={{ backgroundColor: value }}
      ></div>

      {open && (
        <div
          className="absolute top-full left-1/2 mt-2"
          style={{ transform: 'translateX(-50%)', zIndex: 50 }}
        >
          <HexColorPicker
            className="border-4 border-primary rounded-[12]"
            color={value}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
}

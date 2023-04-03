import React, { useState } from "react";

export default function Dropdown({title, elements}) {
  const [dropped, setDropped] = useState(false);

  return (
    <>
    <div className="relative inline-block text-left w-full">
      <div>
        <button 
          className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={(e) => setDropped(!dropped)}
        >
          {title}
          <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className={`absolute right-0 w-full z-10 mt-2 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none
        ${!dropped && 'hidden'}
      `}>
        <div className="py-1">
          {elements.map((element) => <p key={element} className="text-gray-700 block px-4 py-2 text-center text-sm">{element}</p>)}
        </div>
      </div>
    </div>
    </>
  );
}
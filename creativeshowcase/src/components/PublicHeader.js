export default function PublicHeader() {
  return (
    <header className="w-full white border-b border-gray-200">
      {/*full width, white background, 1px border on btm, */}
      <div className="max-w px-22 py-4">
        {/*max wdith, px-6 padds 6 pixels horiz, py-3 on vert, div to adjust header below, include flex, items-center, etc when adding logo, justify-between*/}
        <h1 className="text-xl font-bold text-emerald-800 ">
          {/*font size to Tailwind’s 2xl size, tracking-wide seperates characters*/}
          Creative Showcase
        </h1>
      </div>
    </header>
  );
}
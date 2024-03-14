export const DatosComponent = ({ title, total, totalDos, icono }) => {
  return (
    <div class="flex flex-col gap-2 rounded-lg border border-slate-300 shadow bg-white px-3 py-5">
      <div class="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>

        <span class="text-xs font-medium"> {totalDos}% </span>
      </div>
      <div className="flex gap-1 flex-col justify-center w-full items-center">
        <p className="font-normal text-slate-800 flex items-center gap-2">
          {title}
          {icono}
        </p>
        <p className="font-bold text-indigo-500 mt-2">{total}</p>
      </div>
    </div>
  );
};

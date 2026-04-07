export const classNameBody = "h-screen flex flex-col overflow-hidden";

// export const classNameMain = "";

export const classNameMain = "flex-1 flex items-center justify-center py-4";

export const classNameFooter = "footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4";

export function returnScheduleTable(isSelected: boolean, isClickable: boolean, mode: "edit" | "select" | "watch") {
  return `transition-colors ${
    isSelected ? "!bg-green-900/50" : "!bg-gray-500/20"
  } ${
    mode === "watch"
      ? "cursor-default"
      : isClickable
        ? "cursor-pointer hover:bg-green-900/70"
        : "cursor-not-allowed"
  }`;
}
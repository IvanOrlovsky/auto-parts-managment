import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateCSV(data: any[]): string {
	const headers = Object.keys(data[0]); // Заголовки (ключи объектов)
	const rows = data.map((item) =>
		headers.map((header) => item[header]).join(";")
	);
	return [headers.join(";"), ...rows].join("\n");
}

export function downloadCSV(filename: string, data: string) {
	const BOM = "\uFEFF"; // Добавляем BOM для UTF-8
	const blob = new Blob([BOM + data], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", filename);
	link.style.display = "none";
	document.body.appendChild(link);

	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

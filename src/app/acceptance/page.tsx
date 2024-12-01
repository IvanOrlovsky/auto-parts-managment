"use client";

import { getAcceptanceParts } from "@/actions/read";
import { Part, Supplier } from "@prisma/client";
import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

import toast, { Toaster } from "react-hot-toast";
import { updatePriceForSale } from "@/actions/update";

import axios from "axios";

type SupplierType = {
	supplier: Supplier;
};
type PartSupplierJoinType = Part & SupplierType;

export default function AcceptancePage() {
	const [parts, setParts] = useState<PartSupplierJoinType[]>([]);

	const [selectedPart, setSelectedPart] =
		useState<PartSupplierJoinType | null>(null);

	const [error, setError] = useState<string>("");

	useEffect(() => {
		const getParts = async () => {
			const parts: PartSupplierJoinType[] = await getAcceptanceParts();

			setParts(parts);
		};
		getParts();
	}, []);

	const handleAcceptSubmit = async (e: FormEvent<HTMLFormElement>) => {
		const formData = new FormData(e.currentTarget);
		const priceForSale = Number(formData.get("priceForSale")?.toString());
		e.preventDefault();
		if (!selectedPart) {
			return;
		}
		if (!priceForSale) {
			setError("Вы не заполнили цену продажи!");
			return;
		}
		if (selectedPart.priceForPurchase >= priceForSale) {
			setError(
				"Цена продажи не может быть меньше или равной стоимости закупки!"
			);
			return;
		}

		const response = await axios.post("/api/parts/accept", {
			id: selectedPart.id,
			priceForSale,
		});

		if (response.status === 200) {
			toast.success(response.data.message || "Запчасть успешно принята!");
		} else {
			toast.error("При изменении цены продажи произошла ошибка!");
		}

		await updatePriceForSale(selectedPart?.id, priceForSale);

		const parts: PartSupplierJoinType[] = await getAcceptanceParts();

		setParts(parts);

		setSelectedPart(null);

		setError("");
	};
	return (
		<>
			<Toaster />
			<div className="container mx-auto p-6">
				<h1 className="text-4xl font-bold mb-6">Приемка запчастей</h1>
				<div className="overflow-x-auto">
					<table className="min-w-full border border-gray-300">
						<thead className="bg-gray-100">
							<tr>
								<th className="border px-4 py-2 text-left">
									ID (Артикул)
								</th>
								<th className="border px-4 py-2 text-left">
									Название
								</th>
								<th className="border px-4 py-2 text-left">
									Описание
								</th>
								<th className="border px-4 py-2 text-left">
									Стоимость закупки
								</th>
								<th className="border px-4 py-2 text-left">
									Поставщик
								</th>
								<th className="border px-4 py-2 text-center">
									Действие
								</th>
							</tr>
						</thead>
						<tbody>
							{parts.map((part: PartSupplierJoinType) => (
								<tr key={part.id} className="hover:bg-gray-50">
									<td className="border px-4 py-2">
										{part.id}
									</td>
									<td className="border px-4 py-2">
										{part.name}
									</td>
									<td className="border px-4 py-2">
										{part.description}
									</td>
									<td className="border px-4 py-2">
										{part.priceForPurchase}
									</td>
									<td className="border px-4 py-2">
										{part.supplier.name}
									</td>
									<td className="border px-4 py-2 text-center">
										<button
											className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
											onClick={() => {
												setSelectedPart(part);
												setError("");
											}}
										>
											Принять
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			{selectedPart && (
				<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-30">
					<div className="relative p-4 w-full max-w-md max-h-full bg-slate-400">
						<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
							<h3 className="text-lg font-semibold text-gray-900 ">
								Приемка товара &quot;{selectedPart.name}&quot;
							</h3>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
								onClick={() => {
									setSelectedPart(null);
									setError("");
								}}
							>
								<X color="black" />
							</button>
						</div>
						<form
							className="p-4 md:p-5 flex flex-col gap-3"
							onSubmit={handleAcceptSubmit}
						>
							<Label className="font-semibold">
								Введите цену продажи:
							</Label>
							<Input
								name="priceForSale"
								type="number"
								defaultValue={selectedPart.priceForPurchase}
							/>
							{error && (
								<Label className="text-red-500">{error}</Label>
							)}
							<Button className="mt-2">Подтвердить</Button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

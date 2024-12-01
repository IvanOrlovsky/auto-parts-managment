"use client";

import { addPartToWarehouse } from "@/actions/create";
import { deletePartInWarhouse } from "@/actions/delete";
import {
	getAllPartsInWareHouse,
	getAllPartsOutOfWarehouse,
	getAllWareHouses,
} from "@/actions/read";
import { updatePlaceDate } from "@/actions/update";
import { Button } from "@/components/ui/button";
import { Part, PartsOnWarehouse, Warehouse } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const successMessage = (message: string) => toast.success(message);
const errorMessage = (message: string) => toast.error(message);

type partsInWarehousesType = {
	warehouse: ({
		warehouse: {
			name: string;
			id: string;
			maxCount: number;
		};
	} & {
		partId: string;
		warehouseId: string;
	})[];
} & {
	name: string;
	id: string;
	description: string;
	priceForSale: number | null;
	priceForPurchase: number;
	dateOfPlace: Date | null;
	dateOfPurchase: Date | null;
	dateOfSelling: Date | null;
	orderId: string | null;
	supplierId: string;
};

export default function InventoryPage() {
	const [warehouses, setWarehouses] = useState<
		(Warehouse & { parts: (PartsOnWarehouse & { part: Part })[] })[]
	>([]);

	const [parts, setParts] = useState<Part[]>([]);
	const [partsInWarehouses, setPartsInWarehouses] = useState<
		partsInWarehousesType[]
	>([]);

	const [selectedPart, setSelectedPart] = useState<Part | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const warehouses = await getAllWareHouses();
			const parts = await getAllPartsOutOfWarehouse();
			const partsInWarehouses: partsInWarehousesType[] =
				await getAllPartsInWareHouse();

			setPartsInWarehouses(partsInWarehouses);
			setParts(parts);
			setWarehouses(warehouses);
		};
		fetchData();
	}, []);

	const handlePutPart = async (partId: string, warehouseId: string) => {
		if (!selectedPart) {
			errorMessage("Выберите запчасть для перемещения");
			return;
		}

		await addPartToWarehouse(partId, warehouseId);
		await updatePlaceDate(partId);

		successMessage("Запчасть успешно размещена!");

		const warehouses = await getAllWareHouses();
		const parts = await getAllPartsOutOfWarehouse();
		const partsInWarehouses = await getAllPartsInWareHouse();

		setPartsInWarehouses(partsInWarehouses);
		setParts(parts);
		setWarehouses(warehouses);
		setSelectedPart(null);
	};

	const handleDeletePartFromWarehouse = async (
		partId: string,
		warehouseId: string
	) => {
		await deletePartInWarhouse(partId, warehouseId);

		successMessage("Запчасть успешно убрана из ячейки!");

		const warehouses = await getAllWareHouses();
		const parts = await getAllPartsOutOfWarehouse();
		const partsInWarehouses = await getAllPartsInWareHouse();

		setPartsInWarehouses(partsInWarehouses);
		setParts(parts);
		setWarehouses(warehouses);
		setSelectedPart(null);
	};

	return (
		<>
			<div className="container mx-auto p-6">
				<h1 className="text-4xl font-bold mb-6">Инвентаризация</h1>
				<h2 className="text-2xl font-semibold mb-4">
					Неразмещенные запчасти
				</h2>
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
							<th className="border px-4 py-2 text-center">
								Действие
							</th>
						</tr>
					</thead>
					<tbody>
						{parts.map((part: Part) => (
							<tr key={part.id} className="hover:bg-gray-50">
								<td className="border px-4 py-2">{part.id}</td>
								<td className="border px-4 py-2">
									{part.name}
								</td>
								<td className="border px-4 py-2">
									{part.description}
								</td>
								<td className="border px-4 py-2 text-center">
									<button
										className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
										onClick={() => {
											setSelectedPart(part);
										}}
									>
										Разместить
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<h2 className="text-2xl font-semibold mb-4 mt-8">
					Запчасти в ячейках
				</h2>
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
								Ячейка на складе
							</th>
							<th className="border px-4 py-2 text-center">
								Действие
							</th>
						</tr>
					</thead>
					<tbody>
						{partsInWarehouses.map(
							(part: partsInWarehousesType) => (
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
										{part.warehouse[0].warehouse.name}
									</td>
									<td className="border px-4 py-2 text-center">
										<button
											className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
											onClick={() => {
												handleDeletePartFromWarehouse(
													part.id,
													part.warehouse[0]
														.warehouseId
												);
											}}
										>
											Удалить из ячейки
										</button>
									</td>
								</tr>
							)
						)}
					</tbody>
				</table>
			</div>
			{selectedPart && (
				<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-30">
					<div className="relative p-4 w-full max-w-md max-h-full bg-slate-400">
						<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
							<h3 className="text-lg font-semibold text-gray-900 ">
								Размещение товара &quot;{selectedPart.name}
								&quot;
							</h3>
							<button
								type="button"
								className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center "
								onClick={() => {
									setSelectedPart(null);
								}}
							>
								<X color="black" />
							</button>
						</div>
						<div className="p-4 md:p-5 flex flex-col gap-3">
							<Label className="font-semibold">
								Выберите ячейку для размещения на складе:
							</Label>
							<div className="overflow-x-auto flex flex-col gap-2">
								{warehouses.map((warehouse) => (
									<div
										className="p-4 bg-slate-300 rounded-lg flex flex-col gap-2"
										key={warehouse.id}
									>
										<span className="text-md text-black font-semibold">
											{warehouse.name}
										</span>
										<span className="text-sm text-black">
											Свободного места в ячейке:{" "}
											{warehouse.maxCount -
												warehouse.parts.length}
										</span>
										<span className="text-sm text-black">
											Детали в ячейке:{" "}
											<ul>
												{warehouse.parts.map((part) => (
													<li key={part.part.id}>
														{part.part.name}
													</li>
												))}
											</ul>
										</span>
										<Button
											className="mt-2"
											onClick={() => {
												handlePutPart(
													selectedPart.id,
													warehouse.id
												);
											}}
										>
											Разместить
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
			<Toaster />
		</>
	);
}

"use server";

import { getAllWareHouses } from "@/actions/read";
import { Warehouse } from "@prisma/client";
import toast, { Toaster } from "react-hot-toast";

const successMessage = (message: string) => toast.success(message);
const errorMessage = (message: string) => toast.error(message);

export default async function InventoryPage() {
	const warehouses: Warehouse[] = await getAllWareHouses();

	if (warehouses.length === 0) {
		errorMessage("Нет складов в системе.");
		return <></>;
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-4xl font-bold mb-6">Инвентаризация</h1>
			<div className="overflow-x-auto">
				{warehouses.map((warehouse) => (
					<WareHouseCard key={warehouse.id} warehouse={warehouse} />
				))}
				<Toaster />
			</div>
		</div>
	);
}

function WareHouseCard({ warehouse }: { warehouse: Warehouse }) {
	return <>{warehouse.name}</>;
}

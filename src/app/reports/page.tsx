"use client";

import {
	getPurchaseReport,
	getSellingReport,
	getWarehouseReport,
} from "@/actions/read";
import { Button } from "@/components/ui/button";
import { downloadCSV, generateCSV } from "@/lib/utils";
import {
	Order,
	Part,
	PartsOnWarehouse,
	Supplier,
	User,
	Warehouse,
} from "@prisma/client";

type SellPurchaseReportType = Part & {
	order: (Order & { customer: User }) | null;
	supplier: Supplier;
};

type WarehouseReportType = {
	warehouse: Warehouse;
	part: { supplier: Supplier } & Part;
} & PartsOnWarehouse;

export default function ReportsPage() {
	const downloadSellingReport = async () => {
		const report: SellPurchaseReportType[] = await getSellingReport();

		const parsedReport = [];
		for (const part of report) {
			parsedReport.push({
				"Артикул запчасти": part.id,
				"Название запчасти": part.name,
				"Описание запчасти": part.description,
				"Цена продажи": part.priceForSale,
				"Дата закупки": part.dateOfPurchase,
				"Дата продажи": part.dateOfSelling,
				"Дата размещения на складе": part.dateOfPlace,
				"Номер заказа": part.order?.id,
				"Имя заказчика": part.order?.customer?.name,
				"Фамилия заказчика": part.order?.customer?.surname,
				"Телефон заказчика": part.order?.customer?.phone,
				"E-mail заказчика": part.order?.customer?.email,
				"Адрес заказчкиа": part.order?.customer?.address,
				"ID поставщика": part.supplier.id,
				"Название поставщика": part.supplier.name,
				"Телефон поставщика": part.supplier.phone,
				"E-mail поставщика": part.supplier.email,
				"Адрес поставщика": part.supplier.address,
			});

			const csv = generateCSV(parsedReport);

			downloadCSV(
				`Отчет_продаж_от_${new Date().toLocaleString()}.csv`,
				csv
			);
		}
	};
	const downloadPurchaseReport = async () => {
		const report: SellPurchaseReportType[] = await getPurchaseReport();

		const parsedReport = [];
		for (const part of report) {
			parsedReport.push({
				"Артикул запчасти": part.id,
				"Название запчасти": part.name,
				"Описание запчасти": part.description,
				"Цена продажи": part.priceForSale,
				"Дата закупки": part.dateOfPurchase,
				"Дата продажи": part.dateOfSelling,
				"Дата размещения на складе": part.dateOfPlace,
				"Номер заказа": part.order?.id,
				"Имя заказчика": part.order?.customer?.name,
				"Фамилия заказчика": part.order?.customer?.surname,
				"Телефон заказчика": part.order?.customer?.phone,
				"E-mail заказчика": part.order?.customer?.email,
				"Адрес заказчкиа": part.order?.customer?.address,
				"ID поставщика": part.supplier.id,
				"Название поставщика": part.supplier.name,
				"Телефон поставщика": part.supplier.phone,
				"E-mail поставщика": part.supplier.email,
				"Адрес поставщика": part.supplier.address,
			});

			const csv = generateCSV(parsedReport);

			downloadCSV(
				`Отчет_закупок_от_${new Date().toLocaleString()}.csv`,
				csv
			);
		}
	};

	const downloadWarehouseReport = async () => {
		const reports: WarehouseReportType[] = await getWarehouseReport();

		const parsedReport = [];

		for (const report of reports) {
			parsedReport.push({
				"Артикул запчасти": report.part.id,
				"Название запчасти": report.part.name,
				"Описание запчасти": report.part.description,
				"Цена продажи": report.part.priceForSale,
				"Дата закупки": report.part.dateOfPurchase,
				"Дата продажи": report.part.dateOfSelling,
				"Дата размещения на складе": report.part.dateOfPlace,
				"ID Ячейки склада": report.warehouse.id,
				"Название ячейки склада": report.warehouse.name,
				"Максимальная вместимость склада": report.warehouse.maxCount,
				"ID поставщика": report.part.supplier.id,
				"Название поставщика": report.part.supplier.name,
				"Телефон поставщика": report.part.supplier.phone,
				"E-mail поставщика": report.part.supplier.email,
				"Адрес поставщика": report.part.supplier.address,
			});
		}

		const csv = generateCSV(parsedReport);

		downloadCSV(`Отчет_запасов_от_${new Date().toLocaleString()}.csv`, csv);
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-4xl font-bold mb-6">Отчеты</h1>
			<div className="w-full flex flex-col gap-4">
				<Button onClick={downloadSellingReport}>
					Отчет по продажам
				</Button>
				<Button onClick={downloadPurchaseReport}>
					Отчет по закупкам
				</Button>
				<Button onClick={downloadWarehouseReport}>
					Отчет по запасам
				</Button>
			</div>
		</div>
	);
}

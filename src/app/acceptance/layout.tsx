import SideBar from "@/components/SideBar";

export default function AcceptanceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<SideBar />
			<main className="ml-64">{children}</main>
		</>
	);
}

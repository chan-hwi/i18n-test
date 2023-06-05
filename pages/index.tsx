import { Inter } from "next/font/google";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	useEffect(() => {
		fetch("/api/sheets").then(console.log).catch(console.error);
	}, []);
	return <>hello world</>;
}

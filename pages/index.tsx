import { Inter } from "next/font/google";
import { UseTranslation, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const { t } = useTranslation("common");

	return <>hello world {t("이름")}</>;
}

type Props = {};

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "ko", ["common"])),
			// Will be passed to the page component as props
		},
	};
};

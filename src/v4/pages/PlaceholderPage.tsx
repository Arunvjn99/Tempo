import { useTranslation } from "react-i18next";
import { PageLayout } from "@/ui/patterns";

type PlaceholderPageProps = {
  titleKey: string;
  defaultTitle: string;
};

export function PlaceholderPage({ titleKey, defaultTitle }: PlaceholderPageProps) {
  const { t } = useTranslation();
  return (
    <PageLayout>
      <h1 className="text-xl font-semibold text-primary">
        {t(titleKey, { defaultValue: defaultTitle })}
      </h1>
      <p className="mt-md text-sm text-secondary">
        {t("v4.placeholderBody", {
          defaultValue: "This area will be implemented in a future release.",
        })}
      </p>
    </PageLayout>
  );
}

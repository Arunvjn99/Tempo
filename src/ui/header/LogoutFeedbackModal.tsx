import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";
import { cn } from "@/core/lib/utils";

export type LogoutFeedbackModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitFeedback: (rating: number, comment: string) => void | Promise<void>;
  onSkip: () => void | Promise<void>;
  busy?: boolean;
};

export function LogoutFeedbackModal({
  open,
  onOpenChange,
  onSubmitFeedback,
  onSkip,
  busy = false,
}: LogoutFeedbackModalProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (open) {
      setRating(null);
      setComment("");
    }
  }, [open]);

  const title = t("logoutFeedback.title", { defaultValue: "Before you go" });
  const description = t("logoutFeedback.description", {
    defaultValue: "Optional: tell us how your experience was. Then we’ll sign you out.",
  });

  const handleSubmit = async () => {
    if (rating === null || rating < 1 || rating > 5) return;
    await onSubmitFeedback(rating, comment.trim());
  };

  const handleSkip = async () => {
    await onSkip();
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <div className="space-y-md">
        <div>
          <p className="mb-sm text-sm font-medium text-primary">
            {t("logoutFeedback.ratingLabel", { defaultValue: "Rating (1–5)" })}
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label={title}>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                type="button"
                disabled={busy}
                onClick={() => setRating(n)}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-md border border-default text-sm font-medium transition-colors",
                  rating === n
                    ? "border-primary bg-primary/10 text-brand"
                    : "bg-background text-secondary hover:bg-muted/60",
                )}
                aria-pressed={rating === n}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="logout-feedback-comment" className="mb-sm block text-sm font-medium text-primary">
            {t("logoutFeedback.commentLabel", { defaultValue: "Comment (optional)" })}
          </label>
          <textarea
            id="logout-feedback-comment"
            rows={3}
            disabled={busy}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full resize-none rounded-md border border-default bg-background px-md py-sm text-sm text-primary placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder={t("logoutFeedback.commentPlaceholder", {
              defaultValue: "Anything we should know?",
            })}
          />
        </div>
        <div className="flex flex-col-reverse gap-sm pt-sm sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={busy}
            onClick={() => void handleSkip()}
          >
            {t("logoutFeedback.skip", { defaultValue: "Skip & Logout" })}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={busy || rating === null}
            onClick={() => void handleSubmit()}
          >
            {t("logoutFeedback.submit", { defaultValue: "Submit & Logout" })}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

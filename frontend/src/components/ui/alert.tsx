import * as React from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircleIcon, AlertTriangleIcon, CheckCircle2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative grid w-full grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 rounded-lg border px-4 py-3 text-sm shadow-xs [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/50 dark:bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 text-sm font-semibold leading-none tracking-normal", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 text-xs leading-5 text-current/80", className)}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("col-start-2 mt-2 flex items-center gap-2", className)}
      {...props}
    />
  );
}

type AppAlertProps = Omit<React.ComponentProps<typeof Alert>, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
};

function BasicAlert({ title, description, children, className, ...props }: AppAlertProps) {
  return (
    <Alert className={className} {...props}>
      <CheckCircle2Icon className="text-emerald-500" />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {description ? <AlertDescription>{description}</AlertDescription> : null}
      {children}
    </Alert>
  );
}

function DestructiveAlert({ title, description, children, className, ...props }: AppAlertProps) {
  return (
    <Alert variant="destructive" className={className} {...props}>
      <AlertCircleIcon />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {description ? <AlertDescription>{description}</AlertDescription> : null}
      {children}
    </Alert>
  );
}

function WarningAlert({ title, description, children, className, ...props }: AppAlertProps) {
  return (
    <Alert
      className={cn(
        "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50",
        className
      )}
      {...props}
    >
      <AlertTriangleIcon />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {description ? <AlertDescription>{description}</AlertDescription> : null}
      {children}
    </Alert>
  );
}

function ActionAlert({
  title,
  description,
  actionLabel,
  onAction,
  children,
  className,
  ...props
}: AppAlertProps & { actionLabel?: string; onAction?: () => void }) {
  return (
    <Alert className={className} {...props}>
      <CheckCircle2Icon className="text-emerald-500" />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {description ? <AlertDescription>{description}</AlertDescription> : null}
      {(actionLabel && onAction) || children ? (
        <AlertAction>
          {actionLabel && onAction ? <Button size="sm" onClick={onAction}>{actionLabel}</Button> : null}
          {children}
        </AlertAction>
      ) : null}
    </Alert>
  );
}

function FloatingAlert({
  type = "basic",
  title,
  description,
  message,
  className,
}: {
  type?: "basic" | "destructive" | "warning";
  title?: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
  className?: string;
}) {
  const alertClassName = cn(
    "fixed left-1/2 top-6 z-[2147483647] w-[min(calc(100vw-2rem),28rem)] -translate-x-1/2 shadow-lg",
    className
  );
  const alertTitle = title ?? message;
  const content = type === "destructive"
    ? <DestructiveAlert title={alertTitle} description={description} className={alertClassName} />
    : type === "warning"
    ? <WarningAlert title={alertTitle} description={description} className={alertClassName} />
    : <BasicAlert title={alertTitle} description={description} className={alertClassName} />;

  if (typeof document === "undefined") return content;
  return createPortal(content, document.body);
}

export { Alert, AlertAction, AlertDescription, AlertTitle, ActionAlert, BasicAlert, DestructiveAlert, FloatingAlert, WarningAlert };
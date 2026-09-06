"use client";

import { useState } from "react";
import { CvUploadForm } from "@/components/cv/cv-upload-form";
import { ErrorBanner, type CvErrorCode } from "@/components/cv/error-banner";
import { CvResultView } from "@/components/cv/cv-result-view";
import type { ParseCvErrorResponse, ParseCvResponse } from "@/app/api/parse-cv/route";

type PageState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: ParseCvResponse }
  | { status: "error"; code: CvErrorCode; message: string };

export default function Home() {
  const [state, setState] = useState<PageState>({ status: "idle" });

  async function handleSubmit(file: File) {
    setState({ status: "loading" });
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/parse-cv", { method: "POST", body: formData });

      if (!response.ok) {
        const body = (await response.json()) as ParseCvErrorResponse;
        setState({ status: "error", code: body.error, message: body.message });
        return;
      }

      const result = (await response.json()) as ParseCvResponse;
      setState({ status: "success", result });
    } catch {
      setState({
        status: "error",
        code: "processing_failed",
        message: "Could not reach the server. Please try again.",
      });
    }
  }

  function handleValidationError(message: string) {
    setState({ status: "error", code: "client_validation", message });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">easyparse-cv</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a CV PDF to extract personal info, experience, education, certifications, and
          skills - entirely locally, no third-party services.
        </p>
      </header>

      <CvUploadForm
        isLoading={state.status === "loading"}
        onSubmit={handleSubmit}
        onValidationError={handleValidationError}
      />

      {state.status === "error" && <ErrorBanner code={state.code} message={state.message} />}
      {state.status === "success" && <CvResultView result={state.result} />}
    </div>
  );
}

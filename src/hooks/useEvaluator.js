import { useState } from "react";
import client from "../api/client";

function useEvaluator() {
  const [jobDescription, setJobDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!jobDescription.trim()) {
      setStatus("error");
      setErrorMessage("Please enter a job description.");
      return;
    }

    if (!file) {
      setStatus("error");
      setErrorMessage("Please upload a PDF resume.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      formData.append("prompt", prompt);
      formData.append("resume", file);

      const response = await client.post("/evaluate", formData);

      setStatus("success");
      setResult(response.data.result);
    } catch {
      setStatus("error");
      setErrorMessage("Evaluation failed. Please try again.");
    }
  }

  return {
    jobDescription,
    setJobDescription,
    prompt,
    setPrompt,
    file,
    setFile,
    status,
    errorMessage,
    result,
    handleSubmit,
  };
}

export default useEvaluator;
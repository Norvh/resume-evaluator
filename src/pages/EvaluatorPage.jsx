import useEvaluator from "../hooks/useEvaluator";

function EvaluatorPage() {
  const {
    jobDescription,
    setJobDescription,
    prompt,
    setPrompt,
    setFile,
    status,
    errorMessage,
    result,
    handleSubmit,
  } = useEvaluator();

  return (
    <main>
      <section>
        <h2>Form</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="job-description">Job Description</label>
          <textarea
            id="job-description"
            rows="8"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <label htmlFor="custom-prompt">Custom Prompt</label>
          <textarea
            id="custom-prompt"
            rows="4"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <label htmlFor="resume">Upload Resume (PDF)</label>
          <input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Evaluating..." : "Evaluate"}
          </button>
        </form>
      </section>

      <section>
        <h2>Results</h2>

        {status === "idle" && (
          <p>Results will appear here after you submit.</p>
        )}

        {status === "loading" && <p>Evaluating...</p>}

        {status === "error" && <p className="error">{errorMessage}</p>}

        {status === "success" && <p>{result}</p>}
      </section>
    </main>
  );
}

export default EvaluatorPage;
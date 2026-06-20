def evaluate_resume(
    job_description: str,
    prompt: str,
    resume_text: str,
) -> str:
    return f"""
Match Score: 7/10

Key Strengths:
- Resume text extracted successfully
- Job description received

Gaps:
- OpenAI API key not configured yet

Additional Instructions:
{prompt}

Resume Length:
{len(resume_text)} characters
"""
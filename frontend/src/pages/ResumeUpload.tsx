import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../services/api';

const ResumeUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setResult(null);
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setProgress(0);
    setResult(null);

    if (!file) {
      setError('Please choose a PDF resume to upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await uploadResume(formData, (event) => {
        if (!event.total) return;
        setProgress(Math.round((event.loaded * 100) / event.total));
      });

      setResult(response.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Upload Resume</h1>
            <p className="mt-2 text-slate-600">Upload a PDF resume and extract skills, education, and experience.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-full bg-slate-200 px-5 py-3 text-slate-700 hover:bg-slate-300"
          >
            Back to Dashboard
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Resume PDF</label>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700"
            />
          </div>

          {progress > 0 && (
            <div className="rounded-full bg-slate-200 p-1">
              <div className="h-3 rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {progress > 0 && <p className="text-sm text-slate-500">Upload progress: {progress}%</p>}

          {error && <div className="rounded-2xl bg-red-50 p-4 text-red-700">{error}</div>}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
          >
            Upload and Parse
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-2xl font-semibold">Parsed Resume</h2>
              <p className="mt-2 text-sm text-slate-600">File: {result.originalFileName}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-100">
                <h3 className="text-xl font-semibold">Skills</h3>
                {result.skills.length ? (
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {result.skills.map((skill: string) => (
                      <li key={skill} className="rounded-xl bg-slate-100 px-3 py-2">
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-slate-500">No skills detected.</p>
                )}
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-100">
                <h3 className="text-xl font-semibold">Education</h3>
                {result.education.length ? (
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {result.education.map((line: string, index: number) => (
                      <li key={index} className="rounded-xl bg-slate-100 px-3 py-2">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-slate-500">No education section found.</p>
                )}
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-100">
                <h3 className="text-xl font-semibold">Experience</h3>
                {result.experience.length ? (
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {result.experience.map((line: string, index: number) => (
                      <li key={index} className="rounded-xl bg-slate-100 px-3 py-2">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-slate-500">No experience section found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPage;

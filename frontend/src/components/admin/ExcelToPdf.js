import React, { useState } from 'react';
import './ExcelToPdf.css';

const ExcelToPdf = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (
      !selectedFile.name.endsWith('.xlsx') &&
      !selectedFile.name.endsWith('.xls')
    ) {
      setStatus({
        type: 'error',
        message: 'Зөвхөн Excel (.xlsx, .xls) файл оруулна уу.',
      });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', message: 'Хөрвүүлэх Excel файл оруулна уу.' });
      return;
    }

    setIsConverting(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/excel-to-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Хөрвүүлэх үед алдаа гарлаа.');
      }

      // Expecting backend to send PDF as blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace(/\.(xlsx|xls)$/i, '')}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: 'Файл амжилттай PDF боллоо.' });
    } catch (error) {
      console.error('Excel to PDF error:', error);
      setStatus({
        type: 'error',
        message:
          error.message ||
          'Файлыг хөрвүүлэх боломжгүй байна. Дараа дахин оролдоно уу.',
      });
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="excel-section">
      <h1 className="section-title">Excel → PDF хөрвүүлэгч</h1>

      <p className="excel-description">
        Excel тайлан, тооцоолол, хүснэгтийг PDF файл болгон хөрвүүлэхэд ашиглана.
        Хөрвүүлсэн PDF файлыг автоматаар татаж авах болно.
      </p>

      <form className="excel-form" onSubmit={handleSubmit}>
        <div className="excel-upload">
          <label htmlFor="excel-file" className="excel-upload-label">
            <span className="upload-icon">📂</span>
            <div className="upload-text">
              <span className="upload-title">
                {file ? file.name : 'Excel файл сонгох'}
              </span>
              <span className="upload-subtitle">
                .xlsx, .xls өргөтгөлтэй файл оруулна уу
              </span>
            </div>
            <input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {status.message && (
          <div className={`excel-status ${status.type}`}>{status.message}</div>
        )}

        <button
          type="submit"
          className="excel-submit-btn"
          disabled={isConverting}
        >
          {isConverting ? 'Хөрвүүлж байна...' : 'PDF болгож хөрвүүлэх'}
        </button>
      </form>

      <div className="excel-hint">
        <p>
          <strong>Анхаарах зүйлс:</strong>
        </p>
        <ul>
          <li>Файлын хэмжээ хэт том биш байх (жишээ нь &lt; 10MB).</li>
          <li>Хөрвүүлэх лист (sheet) нь Excel файл дээр default сонгогдсон байх.</li>
          <li>Хэрэв хөрвүүлэх боломжгүй бол системийн админтай холбогдоно уу.</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelToPdf;



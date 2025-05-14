import React, { useState, useEffect } from "react";
import axios from "../services/api";
import "./ReportGenerator.css";

const ReportGenerator = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [format, setFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/reports");
      setReports(response.data.reports || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch reports. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      setIsGenerating(true);

      const response = await axios.post("/reports/transactions", {
        startDate,
        endDate,
        format,
      });

      setSuccess("Report generated successfully!");
      fetchReports(); // Refresh the reports list

      // Open the report in a new tab
      window.open(response.data.reportUrl, "_blank");
    } catch (err) {
      console.error("Error generating report:", err);
      setError(err.response?.data?.message || "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="report-container">
      <h2>Transaction Reports</h2>

      <div className="report-form-container">
        <h3>Generate New Report</h3>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>

          <button
            type="submit"
            className="generate-btn"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Report"}
          </button>
        </form>
      </div>

      <div className="reports-list-container">
        <h3>Previous Reports</h3>

        {reports.length === 0 ? (
          <p>No reports found. Generate your first report above.</p>
        ) : (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date Range</th>
                <th>Format</th>
                <th>Generated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.key}>
                  <td>
                    {report.startDate} to {report.endDate}
                  </td>
                  <td>{report.format.toUpperCase()}</td>
                  <td>{new Date(report.lastModified).toLocaleString()}</td>
                  <td>
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;

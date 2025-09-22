import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./MyResults.css";

const API_BASE = "http://localhost:8085/quiz-builder-backend-0.0.1-SNAPSHOT/api/quizzes";

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("fullName");

  useEffect(() => {
    if (!username) {
      setError("Username not found. Please login.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE}/quiz-results/users/${username}`)
      .then((res) => setResults(res.data))
      .catch((err) => {
        console.error("AxiosError:", err);
        setError("Failed to fetch quiz results. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [username]);

  // ✅ Certificate Generator with Decoration & Signature
  const generateCertificate = (res) => {
    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Background
    doc.setFillColor(255, 255, 245); // light cream background
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Outer Blue Border
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(12);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Inner Gold Border
    doc.setDrawColor(212, 175, 55); // gold
    doc.setLineWidth(6);
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(34);
    doc.setTextColor(0, 102, 204);
    doc.text("Certificate of Achievement", pageWidth / 2, 120, {
      align: "center",
    });

    // Subtitle
    doc.setFont("times", "italic");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("This certificate is proudly presented to", pageWidth / 2, 170, {
      align: "center",
    });

    // Participant Name
    doc.setFont("courier", "bold");
    doc.setFontSize(36);
    doc.setTextColor(34, 34, 34);
    doc.text(username, pageWidth / 2, 230, { align: "center" });

    // Quiz details
    doc.setFont("times", "normal");
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 50);
    doc.text(
      `For successfully completing the quiz "${res.quizTitle}" in the ${res.quizDomain} domain.`,
      pageWidth / 2,
      280,
      { align: "center", maxWidth: 700 }
    );

    // Score
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 0);
    doc.text(`Score: ${res.score} / ${res.total}`, pageWidth / 2, 330, {
      align: "center",
    });

    // Date
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.setTextColor(80);
    doc.text(
      `Date: ${new Date(res.submittedAt).toLocaleDateString()}`,
      pageWidth / 2,
      370,
      { align: "center" }
    );

    // ✅ Signature Image (place signature.png in public/ folder)
    const signatureImg = "/signature.png"; 
    doc.addImage(signatureImg, "PNG", pageWidth / 2 - 60, 400, 120, 60);

    // Signature Line
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 100, 470, pageWidth / 2 + 100, 470);

    // Label under signature
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Authorized Signature", pageWidth / 2, 490, { align: "center" });

    // Footer
    doc.setFontSize(12);
    doc.setTextColor(120);
    doc.text(
      "Quiz Platform © 2025",
      pageWidth / 2,
      pageHeight - 30,
      { align: "center" }
    );

    // Save PDF
    doc.save(`${username}-certificate-${res.quizTitle}.pdf`);
  };

  return (
    <div className="results-container">
      <h1 className="results-header">My Quiz Results</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading results...</p>
      ) : error ? (
        <p className="text-red-600 text-center">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-gray-600 text-center">No quiz attempts yet.</p>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>Quiz Title</th>
              <th>Domain</th>
              <th>Score</th>
              <th>Total</th>
              <th>Date</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.id}>
                <td>{res.quizTitle || "Untitled Quiz"}</td>
                <td>{res.quizDomain || "N/A"}</td>
                <td>{res.score}</td>
                <td>{res.total}</td>
                <td>{new Date(res.submittedAt).toLocaleString()}</td>
                <td>
                  <button
                    className="download-btn"
                    onClick={() => generateCertificate(res)}
                  >
                    🎓 Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

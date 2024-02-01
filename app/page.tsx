"use client";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { FaSpinner } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
interface Row {
  id: number;
  name: string;
  value: string;
}
const Home: React.FC = () => {
  const [apiLink, setApiLink] = useState<string>("");
  const [tableData, setTableData] = useState<Row[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<Row[]> = await axios.get(apiLink);
      setTableData(response.data);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      setTableData(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (!tableData) return;
    const csvContent = [
      Object.keys(tableData[0]).join(","),
      ...tableData.map((row) => Object.values(row).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table_data.csv";
    link.click();
  };

  const saveAsPdf = () => {
    if (!tableData) return;
    const pdf = new jsPDF();
    pdf.autoTable({
      head: [Object.keys(tableData[0])],
      body: tableData.map((row) => Object.values(row)),
    });
    pdf.save("table_data.pdf");
  };

  return (
    <div className="container mx-auto p-8 h-screen flex flex-col">
      <h1 className="text-4xl font-bold mb-4">JSON API Table Viewer</h1>

      <div className="mb-4">
        <label className="block mb-2">
          API Link:
          <input
            className="border p-2 w-full"
            type="text"
            value={apiLink}
            onChange={(e) => setApiLink(e.target.value)}
          />
        </label>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded flex items-center"
          onClick={fetchData}
          disabled={loading}
        >
          {loading && <FaSpinner className="animate-spin mr-2" />}
          {loading ? "Fetching..." : "Fetch Data"}
        </button>
      </div>
      <div className=" flex-grow">
        {tableData && (
          <div className="max-h-80">
            <div className=" flex gap-2">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={downloadCsv}
              >
                Download CSV
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={saveAsPdf}
              >
                Save as PDF
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-2">Data Table</h2>
            <div className="max-h-[60vh] overflow-y-auto outline">
              <table className="w-full border">
                <thead className=" bg-white">
                  <tr>
                    {Object.keys(tableData[0]).map((key) => (
                      <th key={key} className="border p-2">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td key={idx} className="border p-2">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

import React from "react";
import { Button } from "reactstrap";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const ExportCSV = ({ csvData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

  const exportToCSV = (csvData, fileName) => {
    var data = [];
    csvData.forEach((value) => {
      data.push({
        name: value.name,
        totaL: value.total,
        assigned: value.assigned,
        available: value.available,
        notavailable: value.notAvailable,
        waitingForRecycling: value.waitingForRecycling,
        recycled: value.recycled,
      });
    });
    let header = [
      "Category",
      "Total",
      "Assigned",
      "Available",
      "Not available",
      "Waiting for recycling",
      "Recycled",
    ];

    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(ws, [header]);
    XLSX.utils.sheet_add_json(ws, data, { origin: "A2", skipHeader: true });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const finalData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(finalData, "Report.xlsx");
  };

  return (
    <Button color="danger" onClick={(e) => exportToCSV(csvData, fileName)}>
      Export
    </Button>
  );
};
export default ExportCSV;

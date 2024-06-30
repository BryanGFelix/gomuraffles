import * as XLSX from 'xlsx';

type Winner = {
    address: string;
}

export const downloadExcel = (winners: Winner[]) => {
    // Convert array of strings to an array of objects with a single property for each
    const formattedData = winners.map(address => ({ Address: address }));

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Addresses");

    // Define a file name
    const fileName = "raffleData.xlsx";

    // Write the workbook to a file and trigger download
    XLSX.writeFile(workbook, fileName);
};
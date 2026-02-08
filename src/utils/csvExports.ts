export const exportToCSV = (data: any[], fileName: string) => {
    if (data.length ===0) return;

    const headers = Object.keys(data[0]).join(",");

    const rows = data.map (obj =>
        Object.values(obj).map(val => `"${val}"`).join(",") ).join("\n");
    
    const csvContent= "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodeUri =  encodeURI(csvContent);

    const link= document.createElement("a");
    link.setAttribute("href", encodeUri);
    link.setAttribute("download", `${fileName}.csv` );
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
};

import * as XLSX from "xlsx"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(
      data.title.map((title, index) => ({
        Title: title,
        Price: data.prices[index] || "N/A",
        Rating: data.stars[index] || "N/A",
        ImageURL: data.image[index] || "N/A",
      })),
    )

    // Set column widths
    const columnWidths = [
      { wch: 50 }, // Title
      { wch: 15 }, // Price
      { wch: 10 }, // Rating
      { wch: 70 }, // ImageURL
    ]
    worksheet["!cols"] = columnWidths

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })

    // Return the Excel file as a response
    return new Response(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="scraped-products.xlsx"',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate Excel file" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}


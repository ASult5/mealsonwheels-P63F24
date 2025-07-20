app.get('/getdata', async (req, res) => {
  try {
    const collections = [
      "ProfessionalDB",
      "UserDB",
      "orders",
      "proLogin",
      "tableBookings",
      "userLogin",
    ];

    let allTablesHTML = '';

    for (const col of collections) {
      const data = await fetchCollection(col);

      const tableRows = data.map((doc, index) => {
        const cells = Object.entries(doc)
          .map(([key, value]) => `<td>${typeof value === 'object' ? JSON.stringify(value) : value}</td>`)
          .join('');

        return `
          <tr>
            <td>${index + 1}</td>
            ${cells}
            <td>
              <form method="GET" action="/edit/${col}/${doc.id}" style="display:inline;">
                <button type="submit" class="btn btn-warning btn-sm">Edit</button>
              </form>
              <form method="POST" action="/delete/${col}/${doc.id}" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this entry?');">
                <button type="submit" class="btn btn-danger btn-sm">Delete</button>
              </form>
            </td>
          </tr>
        `;
      }).join('');

      const headers = data.length > 0
        ? Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')
        : '';

      const tableHTML = `
        <div class="mb-5">
          <h4 class="mb-3">${col}</h4>
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  ${headers}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows || '<tr><td colspan="100%">No data available</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      `;

      allTablesHTML += tableHTML;
    }

    res.send(`
      <!doctype html>
      <html lang="en">
      <head>
          <meta charset="utf-8">
          <title>Firebase Data Table</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body {
              padding: 20px;
              background: #f9f9f9;
            }
            h4 {
              color: #e29521;
              border-bottom: 2px solid black;
              padding-bottom: 5px;
              margin-top: 40px;
            }
            .btn {
              margin-right: 5px;
            }
          </style>
      </head>
      <body>
        <div class="container">
          <h2 class="mb-4 text-center">📋 Firebase Collections Viewer</h2>
          ${allTablesHTML}
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});


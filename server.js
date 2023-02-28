const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const bankDetails = [];

fs.createReadStream('bank_branches.csv')
  .pipe(csv())
  .on('data', (data) => {
    bankDetails.push(data);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.get('/api/search', (req, res) => {
  const { q, limit, offset } = req.query;

  const filteredBranches = bankDetails.filter((branch) =>
    Object.values(branch).some((value) => value.toLowerCase().includes(q.toLowerCase()))
  );

  const sortedBranches = filteredBranches.sort((a, b) => (a.ifsc > b.ifsc ? 1 : -1));

  const paginatedBranches = sortedBranches.slice(offset, offset + limit);

  res.json({ branches: paginatedBranches });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
app.get('/api/branch', (req, res) => {
  const { q, limit, offset } = req.query;

  const filteredBranches = bankDetails.filter((branch) =>
    branch.branch.toLowerCase().includes(q.toLowerCase())
  );

  const sortedBranches = filteredBranches.sort((a, b) => (a.ifsc < b.ifsc ? 1 : -1));

  const paginatedBranches = sortedBranches.slice(offset, offset + limit);

  res.json({ branches: paginatedBranches });
});

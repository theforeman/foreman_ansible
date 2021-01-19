export const prepareResult = rows => {
  const result = {};
  const selectRows = rows.filter(row => row.selected === true);
  selectRows.forEach(row => {
    result[row.kind] = {};
  });
  selectRows.forEach(row => {
    result[row.kind][row.role.name] = row.role;
  });
  return result;
};

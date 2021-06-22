module.exports = (nodes) => {
  // nodes === workManifestByLoanId.reviews.nodes
  let response = nodes;

  // Filter the list down to just reviews that contain tasks

  // ... Filter logic here

  const filtered = response.filter((node) => node.lists.nodes.length > 0);

  return filtered;
};

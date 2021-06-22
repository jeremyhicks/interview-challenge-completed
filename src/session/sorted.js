module.exports = (reviews) => {
  let response = reviews;

  // Sort reviews showing the most recently updated review last

  // ... Sort logic here
  const sorted = [...response].sort(
    (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
  );

  return sorted;
};

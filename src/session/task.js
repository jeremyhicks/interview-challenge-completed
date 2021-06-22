module.exports = (reviews) => {
  let response = reviews;

  // Pull out all the task codes and combine them into a single list

  // ...Task logic here

  const tasks = response.map((node) =>
    node.lists.nodes.map((secondNode) =>
      secondNode.tasks.nodes.map((thirdNode) => thirdNode.code)
    )
  );

  const reduceTask = response.reduce((acc, node) => {
    // acc.concat(node.lists.nodes.tasks.nodes);

    return [
      ...acc,
      ...node.lists.nodes.map((second) =>
        second.tasks.nodes.map((third) => third.code)
      )
    ].flat();
  }, []);

  return reduceTask;

  // return tasks;
};

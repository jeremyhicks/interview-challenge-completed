const Koa = require("koa");
const app = new Koa();

const { performance } = require("perf_hooks");
const fs = require("fs");

const task = require("./session/task");
const filter = require("./session/filter");
const sort = require("./session/sorted");

// x-response-time for client dev
const readFile = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

const formattedJSON = (data) =>
  JSON.stringify(data).replace(/\n( *)/g, function (match, p1) {
    return "<br>" + "&nbsp;".repeat(p1.length);
  });

// response
app.use(async (ctx) => {
  const t0 = performance.now();

  const data = await readFile("src/reviews.json");
  const reviews = data.workManifestByLoanId.reviews.nodes;

  /*
   - Filter the reviews to status = OPEN
   - Filter the reviews to only show reviews with Tasks
  */

  let filtered = filter(reviews);
  const t1 = performance.now();
  let sorted = sort(filtered);
  const t2 = performance.now();
  let tasks = task(sorted);
  const t3 = performance.now();

  ctx.type = "html";
  ctx.body = `<html><body>
  <div><h1>Filtered</h1><h4>Passing: ${
    filtered.length === 2
  }</h4><pre>${formattedJSON(filtered)}</pre><span>${
    t1 - t0
  } millisec</span></div>
  <div><h1>Sorted</h1><h4>Passing: ${
    sorted[0].description === "Eligibility Review"
  }</h4><pre>${formattedJSON(sorted)}</pre><span>${
    t2 - t1
  } millisec</span></div>
  <div><h1>Tasks</h1><h4>Passing: ${
    tasks.length === 46
  }</h4><pre>${formattedJSON(tasks)}</pre><span>${t3 - t2} millisec</span></div>
  </body>
  <style>
    h1, h4 { margin: 0; padding: 0; }
    pre { white-space:initial; word-break: break-word; height: 400; overflow: auto; border: 1px solid; width: 32vw; height: 76vh}
    div + div { margin-left: 4px; }
    body { font-family: sans-serif; display:flex; flex-direction: row}
  </style>`;
});

app.listen(3000);

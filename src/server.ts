import cluster, { Worker } from "node:cluster";
import { cpus } from "os";

if (cluster.isPrimary) {
  const workers: Worker[] = [];

  function restartWorker() {
    const worker: Worker = cluster.fork();
    workers.push(worker);
    worker.on("exit", (_) => {
      const index = workers.indexOf(worker);
      workers.splice(index, 1);
      restartWorker();
    });
  }
  const cpuCoreCount = cpus().length;
  for (let i = 0; i < cpuCoreCount; i++) {
    const worker: Worker = cluster.fork();
    workers.push(worker);
    worker.on("exit", (_) => {
      const index = workers.indexOf(worker);
      workers.splice(index, 1);
      restartWorker();
    });
    workers.push(worker);
  }
}

if (cluster.isWorker) {
  import("./app");
}

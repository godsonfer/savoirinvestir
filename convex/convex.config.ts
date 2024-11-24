// convex/convex.config.ts:
import { defineApp } from "convex/server";
import aggregate from "@convex-dev/aggregate/convex.config";
import actionCache from "@convex-dev/action-cache/convex.config";
import shardedCounter from "@convex-dev/sharded-counter/convex.config";
import ratelimiter from "@convex-dev/ratelimiter/convex.config";
import migrations from "@convex-dev/migrations/convex.config";

const app = defineApp();

app.use(aggregate, { name: "leaderboard" });
app.use(actionCache);
app.use(shardedCounter);
app.use(ratelimiter);
app.use(migrations);

export default app;

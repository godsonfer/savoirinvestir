
import { ourFileRouter } from "./core";
// import { createNextRouteHandler } from "uploadthing/next";
 
// // Export routes for Next App Router
// export const { GET, POST } = createNextRouteHandler({
//   router: ourFileRouter,
// });

import { createRouteHandler } from "uploadthing/next";


// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});

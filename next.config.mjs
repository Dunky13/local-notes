// const {
//   PHASE_DEVELOPMENT_SERVER,
//   PHASE_PRODUCTION_BUILD,
// } = require("next/constants");

import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

export default (phase, { defaultConfig }) => {
  console.log({ phase });
  if (phase === PHASE_PRODUCTION_BUILD) {
    return {
      output: "export",
      basePath: "/local-notes",
      images: {
        unoptimized: true,
      },
    };
  }

  return {
    output: "export",
    images: {
      unoptimized: true,
    },
  };
};

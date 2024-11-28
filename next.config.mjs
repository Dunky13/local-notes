import {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants.js";

export default (phase, { defaultConfig }) => {
  if ([PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER].includes(phase)) {
    return {
      output: "export",
      basePath: "/local-notes",
      publicRuntimeConfig: {
        basePath: "/local-notes",
      },
      images: {
        unoptimized: true,
      },
    };
  }

  return {
    output: "export",
    publicRuntimeConfig: {
      basePath: "",
    },
    images: {
      unoptimized: true,
    },
  };
};

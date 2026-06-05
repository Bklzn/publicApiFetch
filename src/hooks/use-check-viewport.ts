import { useMediaQuery } from "@chakra-ui/react";

export function useCheckViewport() {
  return useMediaQuery(["(max-width: 1000px)"], {
    ssr: true,
    fallback: [false],
  });
}

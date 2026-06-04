import { useMediaQuery } from "@chakra-ui/react";

export function useCheckViewport() {
  return useMediaQuery(["(max-width: 767px)"], {
    ssr: true,
    fallback: [false],
  });
}

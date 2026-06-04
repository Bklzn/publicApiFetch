import { Box, Image, HStack, Carousel, IconButton } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type Props = {
  title: string;
  thumbnail: string;
  images: string[];
};

export function ProductImages({ title, thumbnail, images }: Props) {
  return (
    <Box>
      <Carousel.Root slideCount={images.length} maxW="2xl" gap="4">
        <Carousel.Control justifyContent="center" gap="4" width="full">
          <Carousel.PrevTrigger asChild>
            <IconButton size="xs" variant="outline">
              <LuChevronLeft />
            </IconButton>
          </Carousel.PrevTrigger>

          <Carousel.ItemGroup width="full">
            {images.map((image, i) => (
              <Carousel.Item key={i} index={i}>
                <Image
                  aspectRatio="16/9"
                  src={image}
                  alt={`${title} ${i + 1}`}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>

          <Carousel.NextTrigger asChild>
            <IconButton size="xs" variant="outline">
              <LuChevronRight />
            </IconButton>
          </Carousel.NextTrigger>
        </Carousel.Control>

        <Carousel.IndicatorGroup>
          {images.map((image, i) => (
            <Carousel.Indicator
              key={i}
              index={i}
              unstyled
              _current={{
                outline: "2px solid currentColor",
                outlineOffset: "2px",
              }}
            >
              <Image
                w="20"
                aspectRatio="16/9"
                src={image}
                alt={`${title} ${i + 1}`}
                objectFit="cover"
              />
            </Carousel.Indicator>
          ))}
        </Carousel.IndicatorGroup>
      </Carousel.Root>
    </Box>
  );
}

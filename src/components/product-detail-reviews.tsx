import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

type Props = {
  reviews: Review[];
};

function formatDate(raw: string) {
  if (!raw) return "-";
  return new Date(raw).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProductReviews({ reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <Box>
      <Heading size="sm" mb={2}>
        Reviews ({reviews.length})
      </Heading>
      <VStack gap={3} align="stretch">
        {reviews.map((r, i) => (
          <Box key={i} p={3} borderRadius="md" bg="bg.subtle">
            <HStack justify="space-between" mb={1}>
              <Text fontWeight="medium" fontSize="sm">
                {r.reviewerName}
              </Text>
              <Text fontWeight="bold" fontSize="sm">
                {r.rating}/5
              </Text>
            </HStack>
            <Text fontSize="sm" color="fg.muted" mb={1}>
              {r.comment}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {formatDate(r.date)}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

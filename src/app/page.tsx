"use client";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { usePosts } from "@/hooks/use-posts";

export default function Home() {
  const { data: posts, isLoading, error } = usePosts();

  return (
    <Container maxW="4xl" py={10}>
      <VStack gap={6} align="stretch">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="3xl">publicApiFetch</Heading>
        </Box>

        <Text color="fg.muted">
          Next.js + TanStack Query + Chakra UI v3 + Zod
        </Text>

        {isLoading && <Text>Loading posts...</Text>}

        {error && (
          <Text color="red.500">Error: {(error as Error).message}</Text>
        )}

        {posts?.map((post) => (
          <Box key={post.id} p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={2}>
              {post.title}
            </Heading>
            <Text>{post.body}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}

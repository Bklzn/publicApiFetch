"use client";

import { Button, HStack, Text } from "@chakra-ui/react";

const RANGE = 2;

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

function range(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

export function PaginationBar({ page, totalPages, onChange }: Props) {
  const start = Math.max(1, page - RANGE);
  const end = Math.min(totalPages, page + RANGE);
  const pages = range(start, end);

  return (
    <HStack gap={1} justify="center">
      <Button
        size="sm"
        variant="ghost"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </Button>

      {start > 1 && (
        <>
          <Button size="sm" variant="ghost" onClick={() => onChange(1)}>
            1
          </Button>
          {start > 2 && <Text px={1}>...</Text>}
        </>
      )}

      {pages.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === page ? "solid" : "ghost"}
          onClick={() => onChange(p)}
        >
          {p}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <Text px={1}>...</Text>}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="ghost"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </HStack>
  );
}

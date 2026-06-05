"use client";

import { useCheckViewport } from "@/hooks/use-check-viewport";
import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const RANGE = 2;

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function PaginationBar({ page, totalPages, onChange }: Props) {
  const [isMobile] = useCheckViewport();
  return (
    <Pagination.Root
      count={totalPages}
      pageSize={1}
      defaultPage={page}
      siblingCount={RANGE}
      onPageChange={(p) => onChange(p.page)}
    >
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        {isMobile ? (
          <Pagination.PageText />
        ) : (
          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "solid" }}>
                {page.value}
              </IconButton>
            )}
          />
        )}

        <Pagination.NextTrigger asChild>
          <IconButton>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
}

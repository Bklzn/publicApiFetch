"use client";

import { useState, useEffect, useRef } from "react";
import { Input, NativeSelect, HStack, Field } from "@chakra-ui/react";
import type { ProductsParams, SortByField } from "@/lib/api";

const SORT_OPTIONS: { label: string; value: SortByField }[] = [
  { label: "Title", value: "title" },
  { label: "Category", value: "category" },
  { label: "Price", value: "price" },
];

type Props = {
  params: ProductsParams;
  onChange: (params: ProductsParams) => void;
  categories: string[];
};

export function FilterBar({ params, onChange, categories }: Props) {
  const [search, setSearch] = useState(params.q ?? "");
  const paramsRef = useRef(params);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    paramsRef.current = params;
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (search) {
      url.searchParams.set("q", search);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState(null, "", url.toString());
  }, [search]);

  useEffect(() => {
    if (search.length === 0 || search.length >= 3) {
      const timer = setTimeout(() => {
        onChangeRef.current({
          ...paramsRef.current,
          q: search || undefined,
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [search]);

  return (
    <HStack
      gap={4}
      flexDirection="row"
      alignItems="space-between"
      flexWrap="wrap"
    >
      <Field.Root minW="200px" flexGrow={1} width="auto">
        <Field.Label>Search</Field.Label>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
        />
      </Field.Root>

      <Field.Root
        disabled={search.length > 0}
        minW="200px"
        width="auto"
        display="inline-flex"
        flexGrow={1}
      >
        <Field.Label>Category</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            value={params.category ?? ""}
            onChange={(e) =>
              onChange({ ...params, category: e.target.value || undefined })
            }
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Field.Root>

      <Field.Root minW="200px" width="auto" display="inline-flex" flexGrow={1}>
        <Field.Label>Sort by</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field
            value={params.sortBy ?? ""}
            onChange={(e) =>
              onChange({
                ...params,
                sortBy: (e.target.value || undefined) as SortByField,
              })
            }
          >
            <option value="">None</option>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Field.Root>

      <Field.Root
        minW="200px"
        width="auto"
        display="inline-flex"
        style={params.sortBy ? {} : { opacity: 0, pointerEvents: "none" }}
        flexGrow={1}
      >
        <Field.Label>Order</Field.Label>
        <NativeSelect.Root minW="120px">
          <NativeSelect.Field
            value={params.order ?? "asc"}
            onChange={(e) =>
              onChange({ ...params, order: e.target.value as "asc" | "desc" })
            }
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </NativeSelect.Field>
        </NativeSelect.Root>
      </Field.Root>
    </HStack>
  );
}

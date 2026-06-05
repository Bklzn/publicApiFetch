"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Input,
  HStack,
  Field,
  Select,
  createListCollection,
  Portal,
  Button,
} from "@chakra-ui/react";
import { FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";
import type { ProductsParams, SortByField } from "@/lib/api";

const SORT_OPTIONS: { label: string; value: SortByField }[] = [
  { label: "Default", value: "default" },
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
  const sortOptions = createListCollection({
    items: SORT_OPTIONS,
  });
  const [sortBy, setSortBy] = useState([params.sortBy ?? "default"]);
  const [order, setOrder] = useState(params.order ?? "asc");

  const categoriesSelect = useMemo(
    () =>
      createListCollection({
        items: ["all", ...categories],
      }),
    [categories],
  );
  const initialRenderRef = useRef(true);

  const [categoryValue, setCategoryValue] = useState([
    params.category ?? "all",
  ]);

  useEffect(() => {
    if (initialRenderRef.current) return;
    onChangeRef.current({
      ...paramsRef.current,
      category: categoryValue[0] === "all" ? undefined : categoryValue[0],
      sortBy: sortBy[0] === "default" ? undefined : sortBy[0],
      order: sortBy[0] === "default" ? undefined : order,
    });
  }, [categoryValue, sortBy, order]);

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
    if (initialRenderRef.current) return;
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

  useEffect(() => {
    initialRenderRef.current = false;
  }, []);

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

      <Select.Root
        minW="200px"
        flexGrow={1}
        width="auto"
        collection={categoriesSelect}
        value={categoryValue}
        onValueChange={(e) => setCategoryValue(e.value)}
        disabled={search.length > 0}
      >
        <Select.HiddenSelect />
        <Select.Label>Category</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Choose a category" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {categoriesSelect.items.map((category) => (
                <Select.Item item={category} key={category}>
                  {category}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      <HStack minW="200px" flexGrow={1}>
        <Select.Root
          width="100%"
          collection={sortOptions}
          value={sortBy}
          onValueChange={(e) => {
            setSortBy(e.value as SortByField[]);
            if (e.value[0] === "default") {
              setOrder("asc");
            }
          }}
        >
          <Select.HiddenSelect />
          <Select.Label>Sort by</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="-" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {sortOptions.items.map((sort) => (
                  <Select.Item item={sort} key={sort.value}>
                    {sort.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Button
          variant="ghost"
          mt="auto"
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
          disabled={sortBy[0] === "default"}
        >
          {!!order && order === "asc" ? (
            <FaSortAmountDownAlt />
          ) : (
            <FaSortAmountDown />
          )}
        </Button>
      </HStack>
    </HStack>
  );
}

"use client";

import { Select, Portal, createListCollection } from "@chakra-ui/react";
import { VALID_LIMITS, type Limit } from "@/lib/api";
import { useState } from "react";

type Props = {
  value: Limit;
  onChange: (limit: Limit) => void;
};

export function LimitSelect({ value, onChange }: Props) {
  const limitOptions = createListCollection({
    items: VALID_LIMITS.map(String),
  });
  const [limit, setLimit] = useState([value.toString()]);

  console.log(limit, limitOptions);

  return (
    <Select.Root
      minW="60px"
      flexGrow={1}
      collection={limitOptions}
      value={limit}
      onValueChange={(e) => {
        setLimit(e.value);
        onChange(Number(e.value) as Limit);
      }}
    >
      <Select.HiddenSelect />
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
            {limitOptions.items.map((limit) => (
              <Select.Item item={limit} key={limit}>
                {limit}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

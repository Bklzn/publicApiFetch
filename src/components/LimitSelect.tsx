"use client";

import { NativeSelect, Field, Text } from "@chakra-ui/react";
import { VALID_LIMITS, type Limit } from "@/lib/api";

type Props = {
  value: Limit;
  onChange: (limit: Limit) => void;
};

export function LimitSelect({ value, onChange }: Props) {
  return (
    <Field.Root orientation="horizontal" gap={2}>
      <Text fontSize="sm">Showing</Text>
      <NativeSelect.Root>
        <NativeSelect.Field
          value={value}
          onChange={(e) => onChange(Number(e.target.value) as Limit)}
          paddingInline={"10px"}
        >
          {VALID_LIMITS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </NativeSelect.Field>
      </NativeSelect.Root>
    </Field.Root>
  );
}

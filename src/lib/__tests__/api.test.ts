import { describe, it, expect } from "vitest";
import { parsePage, parseLimit, buildQueryString } from "../api";

describe("parsePage", () => {
  it("returns the number for a valid positive integer string", () => {
    expect(parsePage("1", 1)).toBe(1);
    expect(parsePage("5", 1)).toBe(5);
    expect(parsePage("100", 1)).toBe(100);
  });

  it("returns fallback for null", () => {
    expect(parsePage(null, 1)).toBe(1);
    expect(parsePage(null, 3)).toBe(3);
  });

  it("returns fallback for decimal string", () => {
    expect(parsePage("2.5", 1)).toBe(1);
    expect(parsePage("1.9", 1)).toBe(1);
  });

  it("returns fallback for negative number", () => {
    expect(parsePage("-1", 1)).toBe(1);
    expect(parsePage("-5", 1)).toBe(1);
  });

  it("returns fallback for zero", () => {
    expect(parsePage("0", 1)).toBe(1);
  });

  it("returns fallback for NaN", () => {
    expect(parsePage("abc", 1)).toBe(1);
  });

  it("returns fallback for empty string", () => {
    expect(parsePage("", 1)).toBe(1);
  });

  it("returns fallback for undefined", () => {
    expect(parsePage(undefined as unknown as string, 1)).toBe(1);
  });
});

describe("parseLimit", () => {
  it("returns 10 for '10'", () => {
    expect(parseLimit("10", 10)).toBe(10);
  });

  it("returns 25 for '25'", () => {
    expect(parseLimit("25", 10)).toBe(25);
  });

  it("returns 50 for '50'", () => {
    expect(parseLimit("50", 10)).toBe(50);
  });

  it("returns fallback for invalid limit value", () => {
    expect(parseLimit("15", 10)).toBe(10);
    expect(parseLimit("30", 25)).toBe(25);
    expect(parseLimit("100", 50)).toBe(50);
  });

  it("returns fallback for null", () => {
    expect(parseLimit(null, 10)).toBe(10);
    expect(parseLimit(null, 25)).toBe(25);
  });

  it("returns fallback for NaN", () => {
    expect(parseLimit("abc", 10)).toBe(10);
  });

  it("returns fallback for negative number", () => {
    expect(parseLimit("-5", 10)).toBe(10);
  });

  it("returns fallback for zero", () => {
    expect(parseLimit("0", 10)).toBe(10);
  });
});

describe("buildQueryString", () => {
  it("returns empty string for empty params", () => {
    expect(buildQueryString({})).toBe("");
  });

  it("builds limit-only query", () => {
    expect(buildQueryString({ limit: 10 })).toBe("limit=10");
  });

  it("includes skip when page > 1", () => {
    expect(buildQueryString({ limit: 10, page: 2 })).toBe("limit=10&skip=10");
  });

  it("calculates skip correctly for page 3 with limit 25", () => {
    expect(buildQueryString({ limit: 25, page: 3 })).toBe("limit=25&skip=50");
  });

  it("omits skip for page 1", () => {
    expect(buildQueryString({ limit: 10, page: 1 })).toBe("limit=10");
  });

  it("includes select", () => {
    expect(buildQueryString({ select: "id,title" })).toBe("select=id,title");
  });

  it("includes sortBy and order", () => {
    expect(buildQueryString({ sortBy: "price", order: "asc" })).toBe(
      "sortBy=price&order=asc",
    );
  });

  it("builds full query string with all params", () => {
    const result = buildQueryString({
      limit: 25,
      page: 3,
      select: "id,title,price",
      sortBy: "price",
      order: "desc",
    });
    expect(result).toBe(
      "limit=25&skip=50&select=id,title,price&sortBy=price&order=desc",
    );
  });
});

import { signal } from "@preact/signals-react";

const currentPage = signal("default");
const results = signal(null);

export { currentPage, results };

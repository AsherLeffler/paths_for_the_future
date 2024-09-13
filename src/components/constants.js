import { signal } from "@preact/signals-react";

const careerToLearnAbout = signal(null);
const currentPage = signal("default");

export { careerToLearnAbout, currentPage };
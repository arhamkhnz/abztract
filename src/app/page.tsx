import { Suspense } from "react";
import { Generator } from "./_components/generator";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Generator />
    </Suspense>
  );
}

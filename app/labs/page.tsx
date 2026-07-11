import type { Metadata } from "next";
import { LabsView } from "@/features/labs/labs-view";

export const metadata: Metadata = {
  title: "Interactive Labs",
  description:
    "Learn the core ideas of AI hands-on — attention, convolution, object detection, gradient descent, and token sampling. No paper reading required.",
};

export default function LabsPage() {
  return <LabsView />;
}

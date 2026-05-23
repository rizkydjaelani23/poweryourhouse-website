import type { Metadata } from "next";
import ConsultationForm from "./ConsultationForm";

export const metadata: Metadata = {
  title: "Free Consultation | Power Your House Social Media Automation",
  description:
    "Book a free 30-minute Google Meet with the Power Your House team. Tell us about your business and we'll show you exactly how we'd automate your Facebook and Instagram.",
};

export default function ConsultationPage() {
  return <ConsultationForm />;
}

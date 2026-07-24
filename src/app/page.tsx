import { RomanticExperience } from "@/components/experience/RomanticExperience";

export const dynamic = "force-dynamic";

export default function Home() {
  // eslint-disable-next-line react-hooks/purity -- request-time SSR prevents post-arrival countdown flash.
  return <RomanticExperience initialNow={Date.now()} />;
}

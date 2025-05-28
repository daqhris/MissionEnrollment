import { Metadata } from "next";
import { getPageMetadata } from "../../../utils/seo/getPageMetadata";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return getPageMetadata('attestation', params);
}

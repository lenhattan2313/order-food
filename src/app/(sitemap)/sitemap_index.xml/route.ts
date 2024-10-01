import { NextResponse } from "next/server";
import { dishActions } from "../../../actions/dish/dishActions";

// Calculate and output sitemap URLs ex sitemap/1.xml
async function generateSitemaps() {
  //call DB or API
  const dish = await dishActions.getList();

  // Calculate the number of sitemaps needed (3 products per sitemap)
  const productsPerSitemap = 2;
  const numberOfSitemaps = Math.ceil(dish.data.length / productsPerSitemap);
  // Generate an array of sitemap objects
  const sitemaps = Array.from({ length: numberOfSitemaps }, (_, index) => ({
    id: index,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/dish/sitemap/${index}.xml`,
  }));

  return sitemaps;
}

// cache test
export async function GET() {
  try {
    // Generate sitemaps
    const dynamicSitemaps = await generateSitemaps();

    // Combine static and dynamic sitemaps
    const sitemaps = [
      `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
      ...dynamicSitemaps.map((sitemap) => sitemap.url),
    ];

    console.log("Generated sitemaps:", sitemaps);

    const sitemapIndexXML = await buildSitemapIndex(sitemaps);

    return new NextResponse(sitemapIndexXML, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return NextResponse.error();
  }
}

async function buildSitemapIndex(sitemaps: string[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const sitemapURL of sitemaps) {
    xml += "<sitemap>";
    xml += `<loc>${sitemapURL}</loc>`;
    xml += "</sitemap>";
  }

  xml += "</sitemapindex>";
  return xml;
}

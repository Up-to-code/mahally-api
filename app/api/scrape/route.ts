import axios from "axios"
import * as cheerio from "cheerio"

async function scrapePage(url: string) {
  const response = await axios(url)
  const html = response.data
  const $ = cheerio.load(html)

  const prices = $(".styles_productCard__price__uGOio")
    .map((i, elem) => $(elem).text())
    .get()
  const title = $(".styles_productCard__name__pakbB")
    .map((i, elem) => $(elem).text())
    .get()
  const stars = $(".flex.items-center.gap-1.text-yellow-500 .text-sm.font-bold")
    .map((i, elem) => $(elem).text())
    .get()
  const image = $(".ais-Hits-item .object-cover")
    .map((i, elem) => $(elem).attr("src"))
    .get()

  return { prices, title, stars, image }
}

export async function POST(request: Request) {
  const { siteUrl, scrapeAllPages } = await request.json()

  try {
    const initialData = await scrapePage(siteUrl)
    const $ = cheerio.load((await axios(siteUrl)).data)
    const endPageText = $(".styles_firstLastPage__OjfGZ").text()
    const endPageNumber = Number.parseInt(endPageText.replace(/\D/g, ""), 10)

    let allData = initialData

    if (scrapeAllPages && endPageNumber > 1) {
      for (let i = 2; i <= endPageNumber; i++) {
        const pageUrl = `${siteUrl}?page=${i}`
        const pageData = await scrapePage(pageUrl)
        allData = {
          prices: [...allData.prices, ...pageData.prices],
          title: [...allData.title, ...pageData.title],
          stars: [...allData.stars, ...pageData.stars],
          image: [...allData.image, ...pageData.image],
        }
      }
    }

    return new Response(JSON.stringify({ ...allData, endPage: endPageNumber }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to scrape data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}


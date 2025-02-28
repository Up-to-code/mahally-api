import axios from "axios";
import * as cheerio from "cheerio";
 
export async function POST(request: Request) {
    const { siteUrl } = await request.json();
    const data = await axios(siteUrl)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const endPageText = $('.styles_firstLastPage__OjfGZ').text();
            const endPageNumber = parseInt(endPageText.replace(/\D/g, ''), 10);
            const prices = $('.styles_productCard__price__uGOio').map((i, elem) => $(elem).text()).get();
            const title = $('.styles_productCard__name__pakbB').map((i, elem) => $(elem).text()).get();
            const stars = $('.flex.items-center.gap-1.text-yellow-500 .text-sm.font-bold').map((i, elem) => $(elem).text()).get();
            const image = $('.ais-Hits-item .object-cover').map((i, elem) => $(elem).attr('src')).get();
            return {
                title,
                prices,
                stars,
                image,
                endPage: endPageNumber
            };
        });
    
    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

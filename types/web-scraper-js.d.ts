declare module 'web-scraper-js' {
    interface ScrapeOptions {
        url: string;
        tags: {
            text?: Record<string, string>;
            [key: string]: any;
        };
    }

    interface WebScraper {
        scrape(options: ScrapeOptions): Promise<any>;
    }

    const webscraper: WebScraper;
    export default webscraper;
} 
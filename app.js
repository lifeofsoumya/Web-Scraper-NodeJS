const puppeteer = require('puppeteer')

async function scrapeChannel(url) { // init function with to be scraped url argument

    const browser = await puppeteer.launch();      // launch puppeteer
    const page = await browser.newPage();       // generate a headless browser
    await page.goto(url);       // open argument passed url

    const [el] = await page.$x('/html/body/div[1]/div/div/main/div/article[1]/div/header/h2/a');        // select specific element on the url fetched page with 'xpath' & assign it to el
    const text = await el.getProperty('textContent');       // choose type of data needed
    const name = await text.jsonValue();    // extract the data type

    const [el2] = await page.$x('/html/body/div[1]/div/div/main/div/article[1]/div/div[1]/a/img');
    const src = await el2.getProperty('src');
    const avatarIMG = await src.jsonValue();

    browser.close();    // close the temporary headless browser

    console.log(name, avatarIMG)      // print the result text and Image src on console
    
}

scrapeChannel('https://indgeek.com/index/');    // passing argument and calling function 
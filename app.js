const puppeteer = require('puppeteer')
const fs = require('fs/promises') // adding file handling capability

async function scrapeChannel(url) { // init function with to be scraped url argument

    const browser = await puppeteer.launch();      // launch puppeteer
    const page = await browser.newPage();       // generate a headless browser
    await page.goto(url);       // open argument passed url
    await page.screenshot({path : "preview.png", fullPage: true}) // upon visiting take a fullPage screenShot of the page

    const [el] = await page.$x('/html/body/div[1]/div/div/main/div/article[1]/div/header/h2/a');        // select specific element on the url fetched page with 'xpath' & assign it to el
    const text = await el.getProperty('textContent');       // choose type of data needed
    const name = await text.jsonValue();    // extract the data type

    const [el2] = await page.$x('/html/body/div[1]/div/div/main/div/article[1]/div/div[1]/a/img');
    const src = await el2.getProperty('src');
    const avatarIMG = await src.jsonValue();

    // scraping and saving the information to a text file

    const title = await page.evaluate(()=>{ //write any client side js inside the function
        return Array.from(document.querySelectorAll('.entry-title')).map(x => x.textContent) // selecting all the headings having same class and creating an array from the text content of them using map
    })

    await fs.writeFile("headings.txt", title.join("\r\n"))

    browser.close();    // close the temporary headless browser

    console.log(title, name, avatarIMG)      // print the result text and Image src on console
    
}

scrapeChannel('https://indgeek.com/index/');    // passing argument and calling function 
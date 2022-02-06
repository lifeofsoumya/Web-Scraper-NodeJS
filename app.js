const puppeteer = require('puppeteer')
const fs = require('fs/promises') // adding file handling capability

async function scrapeChannel(url) { // init function with to be scraped url argument

    const browser = await puppeteer.launch();      // launch puppeteer
    const page = await browser.newPage();       // generate a headless browser
    await page.goto(url);       // open argument passed url
    await page.screenshot({path : "preview.png", fullPage: true}) // upon visiting take a fullPage screenShot of the page

    // 1. saving simple heading and img src using xpath

    const [el] = await page.$x('/html/body/div[1]/div/div/main/div/article[1]/div/header/h2/a');        // select specific element on the url fetched page with 'xpath' & assign it to el
    const text = await el.getProperty('textContent');       // choose type of data needed
    const name = await text.jsonValue();    // extract the data type

    const [el2] = await page.$x('/html/body/div[1]/div/div/main/div/article[1]/div/div[1]/a/img');
    const src = await el2.getProperty('src');
    const avatarIMG = await src.jsonValue();

    // 2. scraping and saving the information to a text file using page.evaluate and css selectors

    const title = await page.evaluate(()=>{ //write any client side js inside the function
        return Array.from(document.querySelectorAll('.entry-title')).map(x => x.textContent) // selecting all the headings having same class and creating an array from the text content of them using map
    })

    await fs.writeFile("headings.txt", title.join("\r\n"))  // join the content of array of headings store in title, and join it with \r\n return new line, and write then to headings.txt

    // 3. Clicking a button and grabbing inside

    await page.evaluate(() => document.querySelector('.header-image').click()); // 'page.click' was not working, clicks on navbar button on the page using css class
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // setTimeout(() => {  console.log("Waiting till the page loads"); }, 5000); // waiting for 5 seconds after clicking
    
    await page.screenshot({path : "afterClick.png"}) // saves a screenshot after visiting a page by clicking

    // const clicked = page.$eval(".data", el => el.textContent) // upon opening link it finds the .data class selector and gets text content inside that class

    browser.close();    // close the temporary headless browser

    console.log( name, avatarIMG)      // print the result text and Image src on console
    
}

scrapeChannel('https://indgeek.com/index/');    // passing argument and calling function 
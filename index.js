const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const notifier = require('node-notifier');


async function main(){
    const browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.1.1', headless: false });
    const metamask = await dappeteer.setupMetamask(browser);
    await metamask.addNetwork({
        networkName: "Avalanche Network",
        rpc: "https://api.avax.network/ext/bc/C/rpc",
        chainId: "43114",
        symbol: "AVAX",
        explorer: "https://snowtrace.io/"
    })
    
    const page = await browser.newPage();
    await page.goto("https://abracadabra.money/stand");
    page.evaluate('ethereum.request({ method: \'eth_requestAccounts\' })');
    await metamask.approve();
    await page.goto("https://abracadabra.money/stand");
    let prev = '0';
    for (;;) {
        await new Promise((r) => setTimeout(r, 6000));
        const wmemo = await page.waitForSelector('.stand-table-item:nth-of-type(5)');
        const quant = await wmemo.evaluate((w) => w.children[2].children[0].children[0].innerHTML);
        if(quant != '0' && quant != prev){
            notifier.notify({
              title: 'MIM Tracker',
              message: quant + ' mims available!'
            });
            prev = quant;
        }
        await page.reload();
    }
}

main()


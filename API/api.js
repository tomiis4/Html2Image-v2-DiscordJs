const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

(async () => {
	const browser = await puppeteer.launch({ headless: true, args: [ '--no-sandbox' ] }); // defines headless browser 

	app.post('/api', (req, res) => {
			if (req.body.html && req.body.css) { // if contains html & css
				(async () => {
					const page = await browser.newPage();  // create page
					
					await page.setContent(
						`<style>
							${req.body.css}
						</style>
						<div id="main-screenshot" style="height: 720px; width: 1280px">
							${req.body.html}
						</div>`
					);
					const content = await page.$('#main-screenshot'); // get div to screenshot
					const buffer = await content.screenshot({ type: 'png' });
					await page.close();
					
					res.status(200).send(buffer.toString('base64'));
				})();
			}  else if (req.body.html) { // if contains only html
				(async () => {
					const page = await browser.newPage(); // create page
					
					await page.setContent(
						`<div id="main-screenshot" style="height: 720px; width: 1280px">
							${req.body.html}
						</div>`
					);
					const content = await page.$('#main-screenshot'); // get div to screenshot
					const buffer = await content.screenshot({ type: 'png' });
					await page.close();

					res.status(200).send(buffer.toString('base64'))
				})();
			} else {
				console.log("[ERROR] There isnt HTML")
			};
	});
})();

// Start server
app.listen(3000, () => {
	console.log("[SERVER]  Running on http://localhost:3000");
})
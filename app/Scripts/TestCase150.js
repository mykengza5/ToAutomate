const { Builder, By, Key, until } = require("selenium-webdriver")
require("chromedriver");
const should = require('chai').should();
const modulMain = require('../Module/ModulMain.js');
const moduleC2C = require('../Module/ModulC2C.js');
const moduleScan = require('../Module/ModulScan.js');
const moduleTM = require('../Module/ModulTM.js');
const dataConstant = require("../dataConstant.js")

// 1.สร้าง order ปลายทาง ลาดพร้าว
// 2.เอา Tag สแกน เข้าพื้นที่รับ ลาดพร้าว
// 3.สร้งแผน lastmile ลาดพร้าว
// 5.สแกนขึ่นรถ lastmile ลาดพร้าว
// 6.ปล่อยรถ

run();
async function run() {
    describe('Create C2C', async function () {
        var driver = new Builder().forBrowser("chrome").build();
        driver.manage().window().maximize();
    
        it('LoginPage', async function () {
            await modulMain.loginBrowser(driver);
        });

        let TO_id = "";
        it('Create C2C', async function () {

            const dtAddJOb = [
                { name: "บรูส แบรนเนอร์", tel: "0966654471", address: "550/12 รัสเวกัส ถนนโล่ง", province: "กรุงเทพมหานคร", district: "ลาดพร้าว", subDistrict: "จรเข้บัว" },
                // { name: "selenium 2", tel: "888888", address: "88/88", province: "เชียงราย", district: "แม่สาย", subDistrict: "เวียงพางคำ" },
            ];

            const dtAddParcel = [
                { type: "Box", name: "M : กล่อง M", amount: "25", unit: "Box" },
                { type: "Box", name: "M : กล่อง M", amount: "30", unit: "Box" }
            ];

            TO_id = await moduleC2C.CreateC2C(driver, dtAddJOb, dtAddParcel);
            await modulMain.waitloadend(driver, 1000);
        });

        let dtScan = [];
        it('GetTag', async function () {
            dtScan = await moduleC2C.GetTag(driver, TO_id);
            await modulMain.waitloadend(driver, 1000);
        });
            //สแกนเข้าพื้นที่รับ
        it('scanLoadDc', async function () {
            const dtSet = { dc: "DC ลาดพร้าว" }
            await moduleScan.scanLoadDc(driver, dtScan, dtSet);
            await modulMain.waitloadend(driver, 2000);
        });
            //สร้างแผน LastMile
        let Tm_id = "";
        it('CreateTM_Lastmile', async function () {
            const dtSet = { dc: "สำนักงานใหญ่", dcform: "DC ลาดพร้าว", driver: "นาย บักเก่ง แอบนอน", vehicle: "4กว4665" }
            Tm_id = await moduleTM.CreateTM_Lastmile(driver, dtSet);
            await modulMain.waitloadend(driver, 2000);
        });
            //สแกนขึ้นรถ LastMile
        it('scanLoadLastMile', async function () {
            const dtSet = { tm: Tm_id }
            await moduleScan.scanLoadLastMile(driver, dtScan, dtSet);
            await modulMain.waitloadend(driver, 2000);
        });
            //ปิดแจ้งเตือน
        it('DeliceyCarAndCloseAlertTM', async function () {
            await driver.get(dataConstant.webapi + "tms/assign-delivery-view");
            await modulMain.waitloadend(driver, 1000);
            await modulMain.waitloadend(driver, 1000);
            await moduleTM.DeliceyCarAndCloseAlertTM(driver, Tm_id);
        });

        it('Close', async function () {
            await modulMain.CloseBrowser(driver);
        });

    });
}

module.exports = {
    run
}
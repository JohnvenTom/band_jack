/**
 * BanG jack - 主入口文件
 * @description 游戏主入口，初始化游戏核心模块
 * @version 1.0
 */

(function() {
    'use strict';
    
    let game = null;
    let preloader = null;
    let preloadUI = null;
    
    /**
     * 初始化预加载系统
     */
    function initPreloader() {
        console.log('[Main] 初始化预加载系统...');
        
        preloader = new ResourcePreloader();
        preloadUI = new PreloadUI(preloader);
        
        // 收集需要预加载的资源
        collectResources();
        
        // 初始化UI
        preloadUI.init();
        
        // 开始预加载
        preloader.start();
    }
    
    /**
     * 收集所有需要预加载的资源
     */
    function collectResources() {
        console.log('[Main] 收集资源列表...');
        
        const basePath = './assets';
        
        // 1. 数字图片 (0-9, 星星)
        const numberImages = [];
        for (let i = 0; i <= 9; i++) {
            numberImages.push(`${basePath}/art/cards/numbers/${i}.png`);
        }
        numberImages.push(`${basePath}/art/cards/numbers/star.png`);
        numberImages.push(`${basePath}/art/cards/numbers/s_star.png`);
        numberImages.push(`${basePath}/art/cards/numbers/nor-star.png`);
        preloader.addImages(numberImages);
        
        // 2. 角色头像 (Poppin'Party) - 所有图片
        const characterImages = [
            "山吹沙绫_1056_ca.png",
            "山吹沙绫_1056_cn.png",
            "山吹沙绫_1141_ca.png",
            "山吹沙绫_1141_cn.png",
            "山吹沙绫_1166_ca.png",
            "山吹沙绫_1166_cn.png",
            "山吹沙绫_117_ca.png",
            "山吹沙绫_117_cn.png",
            "山吹沙绫_1188_ca.png",
            "山吹沙绫_1241_ca.png",
            "山吹沙绫_1241_cn.png",
            "山吹沙绫_1279_ca.png",
            "山吹沙绫_1279_cn.png",
            "山吹沙绫_1349_ca.png",
            "山吹沙绫_1349_cn.png",
            "山吹沙绫_1369_ca.png",
            "山吹沙绫_1369_cn.png",
            "山吹沙绫_143_ca.png",
            "山吹沙绫_143_cn.png",
            "山吹沙绫_1489_ca.png",
            "山吹沙绫_1489_cn.png",
            "山吹沙绫_1513_ca.png",
            "山吹沙绫_1540_ca.png",
            "山吹沙绫_1540_cn.png",
            "山吹沙绫_1548_ca.png",
            "山吹沙绫_1548_cn.png",
            "山吹沙绫_15_ca.png",
            "山吹沙绫_15_cn.png",
            "山吹沙绫_1673_ca.png",
            "山吹沙绫_1673_cn.png",
            "山吹沙绫_16_ca.png",
            "山吹沙绫_16_cn.png",
            "山吹沙绫_171_ca.png",
            "山吹沙绫_171_cn.png",
            "山吹沙绫_1729_ca.png",
            "山吹沙绫_1729_cn.png",
            "山吹沙绫_1752_ca.png",
            "山吹沙绫_1752_cn.png",
            "山吹沙绫_1773_ca.png",
            "山吹沙绫_1773_cn.png",
            "山吹沙绫_1797_ca.png",
            "山吹沙绫_1797_cn.png",
            "山吹沙绫_1861_ca.png",
            "山吹沙绫_1861_cn.png",
            "山吹沙绫_1963_cn.png",
            "山吹沙绫_2000_ca.png",
            "山吹沙绫_2000_cn.png",
            "山吹沙绫_2053_ca.png",
            "山吹沙绫_2053_cn.png",
            "山吹沙绫_2118_ca.png",
            "山吹沙绫_2118_cn.png",
            "山吹沙绫_2134_ca.png",
            "山吹沙绫_2134_cn.png",
            "山吹沙绫_2166_ca.png",
            "山吹沙绫_2166_cn.png",
            "山吹沙绫_2220_ca.png",
            "山吹沙绫_2220_cn.png",
            "山吹沙绫_2226_ca.png",
            "山吹沙绫_2226_cn.png",
            "山吹沙绫_286_ca.png",
            "山吹沙绫_286_cn.png",
            "山吹沙绫_335_ca.png",
            "山吹沙绫_335_cn.png",
            "山吹沙绫_429_ca.png",
            "山吹沙绫_429_cn.png",
            "山吹沙绫_459_ca.png",
            "山吹沙绫_459_cn.png",
            "山吹沙绫_491_ca.png",
            "山吹沙绫_491_cn.png",
            "山吹沙绫_553_ca.png",
            "山吹沙绫_553_cn.png",
            "山吹沙绫_599_ca.png",
            "山吹沙绫_599_cn.png",
            "山吹沙绫_616_ca.png",
            "山吹沙绫_616_cn.png",
            "山吹沙绫_691_ca.png",
            "山吹沙绫_691_cn.png",
            "山吹沙绫_722_ca.png",
            "山吹沙绫_722_cn.png",
            "山吹沙绫_745_ca.png",
            "山吹沙绫_745_cn.png",
            "山吹沙绫_771_ca.png",
            "山吹沙绫_771_cn.png",
            "山吹沙绫_834_ca.png",
            "山吹沙绫_834_cn.png",
            "山吹沙绫_868_ca.png",
            "山吹沙绫_868_cn.png",
            "山吹沙绫_972_ca.png",
            "山吹沙绫_972_cn.png",
            "山吹沙绫_979_ca.png",
            "山吹沙绫_979_cn.png",
            "市谷有咲_102_ca.png",
            "市谷有咲_102_cn.png",
            "市谷有咲_1058_ca.png",
            "市谷有咲_1058_cn.png",
            "市谷有咲_1092_ca.png",
            "市谷有咲_1092_cn.png",
            "市谷有咲_1111_ca.png",
            "市谷有咲_1111_cn.png",
            "市谷有咲_1164_ca.png",
            "市谷有咲_1164_cn.png",
            "市谷有咲_1242_ca.png",
            "市谷有咲_1242_cn.png",
            "市谷有咲_1281_ca.png",
            "市谷有咲_1281_cn.png",
            "市谷有咲_1320_ca.png",
            "市谷有咲_1320_cn.png",
            "市谷有咲_1323_ca.png",
            "市谷有咲_132_ca.png",
            "市谷有咲_132_cn.png",
            "市谷有咲_1363_ca.png",
            "市谷有咲_1363_cn.png",
            "市谷有咲_1371_ca.png",
            "市谷有咲_1371_cn.png",
            "市谷有咲_1462_ca.png",
            "市谷有咲_1462_cn.png",
            "市谷有咲_1492_ca.png",
            "市谷有咲_1492_cn.png",
            "市谷有咲_1543_ca.png",
            "市谷有咲_1543_cn.png",
            "市谷有咲_1633_ca.png",
            "市谷有咲_1675_ca.png",
            "市谷有咲_1675_cn.png",
            "市谷有咲_1685_ca.png",
            "市谷有咲_1685_cn.png",
            "市谷有咲_1725_ca.png",
            "市谷有咲_1725_cn.png",
            "市谷有咲_173_ca.png",
            "市谷有咲_173_cn.png",
            "市谷有咲_1751_ca.png",
            "市谷有咲_1751_cn.png",
            "市谷有咲_1784_ca.png",
            "市谷有咲_1798_ca.png",
            "市谷有咲_1798_cn.png",
            "市谷有咲_1844_ca.png",
            "市谷有咲_1844_cn.png",
            "市谷有咲_1859_ca.png",
            "市谷有咲_1859_cn.png",
            "市谷有咲_1960_ca.png",
            "市谷有咲_1960_cn.png",
            "市谷有咲_19_ca.png",
            "市谷有咲_19_cn.png",
            "市谷有咲_2004_ca.png",
            "市谷有咲_2004_cn.png",
            "市谷有咲_2052_ca.png",
            "市谷有咲_2052_cn.png",
            "市谷有咲_2094_ca.png",
            "市谷有咲_2094_cn.png",
            "市谷有咲_20_ca.png",
            "市谷有咲_20_cn.png",
            "市谷有咲_2107_ca.png",
            "市谷有咲_2107_cn.png",
            "市谷有咲_2164_ca.png",
            "市谷有咲_2164_cn.png",
            "市谷有咲_2223_ca.png",
            "市谷有咲_2223_cn.png",
            "市谷有咲_2242_ca.png",
            "市谷有咲_2242_cn.png",
            "市谷有咲_287_ca.png",
            "市谷有咲_287_cn.png",
            "市谷有咲_373_ca.png",
            "市谷有咲_373_cn.png",
            "市谷有咲_428_ca.png",
            "市谷有咲_428_cn.png",
            "市谷有咲_461_ca.png",
            "市谷有咲_461_cn.png",
            "市谷有咲_472_ca.png",
            "市谷有咲_472_cn.png",
            "市谷有咲_522_ca.png",
            "市谷有咲_522_cn.png",
            "市谷有咲_554_ca.png",
            "市谷有咲_554_cn.png",
            "市谷有咲_618_ca.png",
            "市谷有咲_618_cn.png",
            "市谷有咲_666_ca.png",
            "市谷有咲_666_cn.png",
            "市谷有咲_688_ca.png",
            "市谷有咲_688_cn.png",
            "市谷有咲_718_ca.png",
            "市谷有咲_718_cn.png",
            "市谷有咲_770_ca.png",
            "市谷有咲_770_cn.png",
            "市谷有咲_826_ca.png",
            "市谷有咲_826_cn.png",
            "市谷有咲_829_ca.png",
            "市谷有咲_829_cn.png",
            "市谷有咲_853_ca.png",
            "市谷有咲_853_cn.png",
            "市谷有咲_977_ca.png",
            "市谷有咲_977_cn.png",
            "户山香澄_101_ca.png",
            "户山香澄_101_cn.png",
            "户山香澄_1023_ca.png",
            "户山香澄_1023_cn.png",
            "户山香澄_1045_ca.png",
            "户山香澄_1045_cn.png",
            "户山香澄_1097_ca.png",
            "户山香澄_1097_cn.png",
            "户山香澄_1113_ca.png",
            "户山香澄_1113_cn.png",
            "户山香澄_1163_ca.png",
            "户山香澄_1163_cn.png",
            "户山香澄_1222_ca.png",
            "户山香澄_122_ca.png",
            "户山香澄_122_cn.png",
            "户山香澄_1238_ca.png",
            "户山香澄_1280_ca.png",
            "户山香澄_1280_cn.png",
            "户山香澄_1348_ca.png",
            "户山香澄_1348_cn.png",
            "户山香澄_1475_ca.png",
            "户山香澄_1490_ca.png",
            "户山香澄_1490_cn.png",
            "户山香澄_1544_ca.png",
            "户山香澄_1544_cn.png",
            "户山香澄_1545_ca.png",
            "户山香澄_1545_cn.png",
            "户山香澄_1580_ca.png",
            "户山香澄_1622_ca.png",
            "户山香澄_1622_cn.png",
            "户山香澄_1703_ca.png",
            "户山香澄_1703_cn.png",
            "户山香澄_1727_ca.png",
            "户山香澄_1727_cn.png",
            "户山香澄_1769_ca.png",
            "户山香澄_1769_cn.png",
            "户山香澄_1858_ca.png",
            "户山香澄_1858_cn.png",
            "户山香澄_1869_ca.png",
            "户山香澄_1869_cn.png",
            "户山香澄_1964_ca.png",
            "户山香澄_1964_cn.png",
            "户山香澄_2002_ca.png",
            "户山香澄_2002_cn.png",
            "户山香澄_2015_ca.png",
            "户山香澄_2015_cn.png",
            "户山香澄_2051_ca.png",
            "户山香澄_2051_cn.png",
            "户山香澄_2060_ca.png",
            "户山香澄_2060_cn.png",
            "户山香澄_2091_ca.png",
            "户山香澄_2091_cn.png",
            "户山香澄_2122_ca.png",
            "户山香澄_2122_cn.png",
            "户山香澄_2131_ca.png",
            "户山香澄_2131_cn.png",
            "户山香澄_2219_ca.png",
            "户山香澄_2219_cn.png",
            "户山香澄_2243_ca.png",
            "户山香澄_2243_cn.png",
            "户山香澄_2285_ca.png",
            "户山香澄_2285_cn.png",
            "户山香澄_271_ca.png",
            "户山香澄_277_ca.png",
            "户山香澄_277_cn.png",
            "户山香澄_333_ca.png",
            "户山香澄_333_cn.png",
            "户山香澄_3_ca.png",
            "户山香澄_3_cn.png",
            "户山香澄_402_ca.png",
            "户山香澄_402_cn.png",
            "户山香澄_425_ca.png",
            "户山香澄_425_cn.png",
            "户山香澄_444_ca.png",
            "户山香澄_444_cn.png",
            "户山香澄_457_ca.png",
            "户山香澄_457_cn.png",
            "户山香澄_492_ca.png",
            "户山香澄_492_cn.png",
            "户山香澄_4_ca.png",
            "户山香澄_4_cn.png",
            "户山香澄_556_ca.png",
            "户山香澄_556_cn.png",
            "户山香澄_577_ca.png",
            "户山香澄_577_cn.png",
            "户山香澄_614_ca.png",
            "户山香澄_614_cn.png",
            "户山香澄_686_ca.png",
            "户山香澄_686_cn.png",
            "户山香澄_717_ca.png",
            "户山香澄_717_cn.png",
            "户山香澄_725_ca.png",
            "户山香澄_725_cn.png",
            "户山香澄_774_ca.png",
            "户山香澄_774_cn.png",
            "户山香澄_795_ca.png",
            "户山香澄_795_cn.png",
            "户山香澄_832_ca.png",
            "户山香澄_832_cn.png",
            "户山香澄_939_ca.png",
            "户山香澄_939_cn.png",
            "户山香澄_976_ca.png",
            "户山香澄_976_cn.png",
            "牛込里美_1057_ca.png",
            "牛込里美_1057_cn.png",
            "牛込里美_1103_ca.png",
            "牛込里美_1103_cn.png",
            "牛込里美_1109_ca.png",
            "牛込里美_1109_cn.png",
            "牛込里美_1154_ca.png",
            "牛込里美_1165_ca.png",
            "牛込里美_1165_cn.png",
            "牛込里美_116_ca.png",
            "牛込里美_116_cn.png",
            "牛込里美_11_ca.png",
            "牛込里美_11_cn.png",
            "牛込里美_1240_ca.png",
            "牛込里美_1240_cn.png",
            "牛込里美_1283_ca.png",
            "牛込里美_1283_cn.png",
            "牛込里美_12_ca.png",
            "牛込里美_12_cn.png",
            "牛込里美_1308_ca.png",
            "牛込里美_1308_cn.png",
            "牛込里美_1347_ca.png",
            "牛込里美_1347_cn.png",
            "牛込里美_141_ca.png",
            "牛込里美_141_cn.png",
            "牛込里美_1479_ca.png",
            "牛込里美_1542_ca.png",
            "牛込里美_1542_cn.png",
            "牛込里美_1547_ca.png",
            "牛込里美_1547_cn.png",
            "牛込里美_1624_ca.png",
            "牛込里美_1624_cn.png",
            "牛込里美_1674_ca.png",
            "牛込里美_1674_cn.png",
            "牛込里美_1767_ca.png",
            "牛込里美_1767_cn.png",
            "牛込里美_1796_ca.png",
            "牛込里美_1796_cn.png",
            "牛込里美_1851_ca.png",
            "牛込里美_1851_cn.png",
            "牛込里美_1961_ca.png",
            "牛込里美_1961_cn.png",
            "牛込里美_2055_ca.png",
            "牛込里美_2055_cn.png",
            "牛込里美_2082_ca.png",
            "牛込里美_2082_cn.png",
            "牛込里美_2090_ca.png",
            "牛込里美_2090_cn.png",
            "牛込里美_2133_ca.png",
            "牛込里美_2133_cn.png",
            "牛込里美_2168_ca.png",
            "牛込里美_2168_cn.png",
            "牛込里美_2180_ca.png",
            "牛込里美_2180_cn.png",
            "牛込里美_2221_ca.png",
            "牛込里美_2221_cn.png",
            "牛込里美_2247_ca.png",
            "牛込里美_2247_cn.png",
            "牛込里美_288_ca.png",
            "牛込里美_288_cn.png",
            "牛込里美_337_ca.png",
            "牛込里美_337_cn.png",
            "牛込里美_426_ca.png",
            "牛込里美_426_cn.png",
            "牛込里美_494_ca.png",
            "牛込里美_494_cn.png",
            "牛込里美_515_ca.png",
            "牛込里美_515_cn.png",
            "牛込里美_552_ca.png",
            "牛込里美_552_cn.png",
            "牛込里美_615_ca.png",
            "牛込里美_615_cn.png",
            "牛込里美_713_ca.png",
            "牛込里美_713_cn.png",
            "牛込里美_720_ca.png",
            "牛込里美_720_cn.png",
            "牛込里美_747_ca.png",
            "牛込里美_747_cn.png",
            "牛込里美_772_ca.png",
            "牛込里美_772_cn.png",
            "牛込里美_790_ca.png",
            "牛込里美_790_cn.png",
            "牛込里美_833_ca.png",
            "牛込里美_833_cn.png",
            "牛込里美_917_ca.png",
            "牛込里美_917_cn.png",
            "牛込里美_978_ca.png",
            "牛込里美_978_cn.png",
            "花园多惠_1016_cn.png",
            "花园多惠_1019_ca.png",
            "花园多惠_1019_cn.png",
            "花园多惠_1059_cn.png",
            "花园多惠_1110_ca.png",
            "花园多惠_1110_cn.png",
            "花园多惠_1131_ca.png",
            "花园多惠_1131_cn.png",
            "花园多惠_1167_ca.png",
            "花园多惠_1167_cn.png",
            "花园多惠_118_ca.png",
            "花园多惠_118_cn.png",
            "花园多惠_1239_ca.png",
            "花园多惠_1239_cn.png",
            "花园多惠_1317_ca.png",
            "花园多惠_1317_cn.png",
            "花园多惠_133_ca.png",
            "花园多惠_133_cn.png",
            "花园多惠_1351_ca.png",
            "花园多惠_1351_cn.png",
            "花园多惠_1365_ca.png",
            "花园多惠_1488_ca.png",
            "花园多惠_1488_cn.png",
            "花园多惠_1546_ca.png",
            "花园多惠_1546_cn.png",
            "花园多惠_1592_ca.png",
            "花园多惠_1623_ca.png",
            "花园多惠_1623_cn.png",
            "花园多惠_1654_ca.png",
            "花园多惠_1664_ca.png",
            "花园多惠_1664_cn.png",
            "花园多惠_1726_ca.png",
            "花园多惠_1726_cn.png",
            "花园多惠_172_ca.png",
            "花园多惠_172_cn.png",
            "花园多惠_1800_ca.png",
            "花园多惠_1800_cn.png",
            "花园多惠_1857_ca.png",
            "花园多惠_1857_cn.png",
            "花园多惠_1930_ca.png",
            "花园多惠_1930_cn.png",
            "花园多惠_1951_ca.png",
            "花园多惠_1951_cn.png",
            "花园多惠_1962_ca.png",
            "花园多惠_1962_cn.png",
            "花园多惠_2001_ca.png",
            "花园多惠_2001_cn.png",
            "花园多惠_2059_ca.png",
            "花园多惠_2059_cn.png",
            "花园多惠_2092_ca.png",
            "花园多惠_2092_cn.png",
            "花园多惠_2132_ca.png",
            "花园多惠_2132_cn.png",
            "花园多惠_2165_ca.png",
            "花园多惠_2165_cn.png",
            "花园多惠_2213_ca.png",
            "花园多惠_2213_cn.png",
            "花园多惠_262_ca.png",
            "花园多惠_262_cn.png",
            "花园多惠_334_ca.png",
            "花园多惠_334_cn.png",
            "花园多惠_427_ca.png",
            "花园多惠_427_cn.png",
            "花园多惠_430_ca.png",
            "花园多惠_430_cn.png",
            "花园多惠_474_ca.png",
            "花园多惠_474_cn.png",
            "花园多惠_490_ca.png",
            "花园多惠_490_cn.png",
            "花园多惠_581_ca.png",
            "花园多惠_581_cn.png",
            "花园多惠_609_ca.png",
            "花园多惠_609_cn.png",
            "花园多惠_623_ca.png",
            "花园多惠_623_cn.png",
            "花园多惠_719_ca.png",
            "花园多惠_719_cn.png",
            "花园多惠_782_ca.png",
            "花园多惠_782_cn.png",
            "花园多惠_7_ca.png",
            "花园多惠_7_cn.png",
            "花园多惠_819_ca.png",
            "花园多惠_819_cn.png",
            "花园多惠_836_ca.png",
            "花园多惠_836_cn.png",
            "花园多惠_8_ca.png",
            "花园多惠_8_cn.png",
            "花园多惠_944_ca.png",
            "花园多惠_944_cn.png",
            "花园多惠_980_ca.png",
            "花园多惠_980_cn.png"
        ].map(filename => `${basePath}/art/cards/faces/Popin'Party/${filename}`);
        preloader.addImages(characterImages);
        
        // 3. Logo/Stamp 图片
        const stampImages = [];
        const stampIds = [
            '001001', '001002', '001003', '001004', '001005', 
            '001006', '001007', '001008', '001009', '001010',
            '001012', '001013', '001014', '001015', '001016',
            '001017', '001018', '001019', '001020',
            '002001', '002002', '002003', '002004', '002005',
            '002006', '002007', '002008', '002009', '002010',
            '002011', '002012',
            '003001', '003002', '003003', '003004', '003005',
            '003006', '003007', '003008', '003009', '003010',
            '003011', '003012',
            '004001', '004002', '004003', '004004', '004005',
            '004006', '004007', '004008', '004009', '004010',
            '004011', '004012', '004013',
            '005001', '005002', '005003', '005004', '005005',
            '005006', '005007', '005008', '005009', '005010',
            '005011', '005012', '005013', '005014', '005015', '005016'
        ];
        stampIds.forEach(id => {
            stampImages.push(`${basePath}/logo/stamp_${id}.png`);
        });
        preloader.addImages(stampImages);
        
        // 4. 音频文件 (关键音效)
        const audioFiles = [];
        
        // Bingo音效
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_01.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_02.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_03.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_04.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/2021birthday_05.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/SE_RESULT_SUCCESS.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/SE_RHYTHM_FULLCOMBO.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bingo/SE_RESULT_HIGHSCORE.mp3`);
        
        // Win音效
        audioFiles.push(`${basePath}/audio/sfx/win/SE_FANFARE.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_SHOCKING_SUCCESS.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_ARISA_KY.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_KASUMI_GT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_SAYA_DR.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/SE_TAE_GT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/ksm/full_combo_001_01.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/ksm/full_combo_001_02.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/ksm/full_combo_001_03.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/shout/SE_AUDIENCE_BIG_SHORT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/shout/SE_CHEER_BIG_2.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/win/shout/SE_CLAPS_MID_SHORT.mp3`);
        
        // Failed音效
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_GUITAR_DROP.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_DRAM_ROLL.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_GUITER_SHARP.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_KASUMI_GT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_RIMI_BA.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/failed/SE_WHISTLE.mp3`);
        
        // Bomb音效
        audioFiles.push(`${basePath}/audio/sfx/bomb/SE_QUIZ_CORRECT.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bomb/SE_QUIZ_MISS.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bomb/SE_MISSION_JINGLE.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/bomb/SE_GUITAR_HIT_2.mp3`);
        
        // Short音效
        audioFiles.push(`${basePath}/audio/sfx/short/SE_GACHA_STAR_01.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/short/SE_HEART_FLY.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/short/SE_BOTTLE_CHEERS.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/short/SE_JUGGLING.mp3`);
        audioFiles.push(`${basePath}/audio/sfx/short/SE_POPS_OUT.mp3`);
        
        // Logo目录下的音频
        audioFiles.push(`${basePath}/logo/stamp_001016.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_001017.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_001019.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_002011.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_002012.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_003009.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_003010.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_003011.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_004011.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_004012.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_005013.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_005014.mp3`);
        audioFiles.push(`${basePath}/logo/stamp_005015.mp3`);
        
        preloader.addAudio(audioFiles);
        
        console.log('[Main] 资源收集完成！');
    }
    
    /**
     * 预加载完成后初始化游戏
     */
    function initGame() {
        console.log('[Main] 初始化游戏...');
        
        try {
            game = new GameController();
            game.init();
            
            window.game = game;
            
            console.log('[Main] 游戏启动完成！');
        } catch (error) {
            console.error('[Main] 游戏初始化失败:', error);
            showErrorMessage('游戏加载失败，请刷新页面重试');
        }
    }
    
    /**
     * DOM加载完成后开始预加载
     */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('BanG jack - 游戏启动中...');
        
        // 监听预加载完成事件
        document.addEventListener('preloadComplete', function() {
            console.log('[Main] 预加载完成，开始初始化游戏...');
            initGame();
        });
        
        // 初始化预加载系统
        initPreloader();
    });
    
    /**
     * 显示错误消息
     * @param {string} message - 错误消息
     */
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.9);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 9999;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }
    
    /**
     * 页面卸载前保存游戏
     */
    window.addEventListener('beforeunload', function() {
        if (game) {
            game.saveGame();
        }
    });
    
    /**
     * 处理页面可见性变化
     */
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && game) {
            game.saveGame();
        }
    });
})();

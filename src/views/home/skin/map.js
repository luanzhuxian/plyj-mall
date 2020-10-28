// 各个皮肤对应的类名
export const skinClassNameMap = {
    1: 'skinXmas',
    2: 'skinYuanDan',
    3: 'skinNewYear',
    4: 'skinXiaoNian',
    5: 'skinYuanXiao',
    6: 'skinWomenDay',
    7: 'skinNianNianFan',
    8: 'skinEarthDay',
    9: 'skinLabourDay',
    10: 'skinMothersDay',
    11: 'skinChildrenDay',
    12: 'skinFathersDay',
    13: 'skinDragonBoat',
    14: 'skinMidAutumnFestival',
    15: 'skinNationalDay',
    16: 'skinCulture',
    17: 'skinSports',
    18: 'skinArts',
    19: 'skinDouble12',
    // 99: 'skinCampaign',
    has (id) {
        return Reflect.has(this, id)
    }
}

export const skinNavMap = {
    1: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/239b454f-454c-4ca5-93e7-a51bbd65a85a.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/ca59969d-77ed-48a0-964b-46ebc21401e1.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/b7e2cc35-63a7-4e84-8b35-7d487ccff31f.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/8821569b-35de-4a65-8e2d-60017edb6f1c.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/e476c8f8-8b5c-4772-9afc-67e68e678cda.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/665c6191-c62d-4ede-a10b-8cbfab239240.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/b036f6b9-0b78-424b-b1f1-94a240d5c1ff.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xmas/f1d79dbd-1756-449f-ae9a-d5ba092459ce.png'
    },
    2: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d164934f-0da6-49e2-a5bb-f057abab1831.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d2275816-8002-4ada-bb49-495e7202ed76.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/ddd9128a-9193-4df4-ad5f-74d8ed2a0a0c.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/c349a743-3c97-4b20-a1c4-e981701d171b.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d164934f-0da6-49e2-a5bb-f057abab1831.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/d2275816-8002-4ada-bb49-495e7202ed76.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/2f0c5143-0ee6-4e07-b57e-287506b503d2.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-dan/f6b46a80-9624-467a-a46f-d92716e55789.png'
    },
    3: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ed448ad5-d03d-445c-92dd-26e47a345d0f.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ca40f2d6-03c8-43e2-ac61-1a3d8cb312dd.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/524bb459-1629-476a-87a5-2c87c4e88629.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/12c032c0-a345-47e4-950f-8e750314492f.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/ec9ab607-450c-4b0a-8fc8-a8f48ef18ea2.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/f62c7aea-7a94-4810-8e50-71af4b64747a.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/12d8a7da-d145-4394-876f-3452e6111818.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/new-year/5506a573-d1de-4388-ae48-5f616865bfbe.png'
    },
    4: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/59d33c43-0c92-4188-8bd1-7262d3f22e6f.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/78b43fa6-6a94-4d8e-a6cf-3593eb466d2e.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/370856d4-8bf8-4c8c-a16b-8b6023adb347.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/c7caf9d7-23e8-4fc7-bf5d-feae82e60c12.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/0ae4ba75-10e9-45ca-8338-009d8079c12f.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/ced7151b-9366-4050-95eb-3b46ef11bbee.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/e8ed38d7-ca0c-440d-9f17-d67edd4e54ce.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/xiao-nian/515a432b-738b-4517-b20b-b0f96d054b09.png'
    },
    5: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/86b85967-0b8e-4949-992c-5cd5f83d8c51.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/93845c73-12ba-4627-acd0-d5dfe29cffc7.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/231fb96b-75b0-4957-afed-16069aeae381.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/bf6cfe7c-fb87-4f00-a56f-aed22d8bc0b9.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/6de53dcc-e94d-47ae-a1da-3dbe919b842f.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/a0597aa9-d126-4c7b-8fad-999d52c9dffd.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/6cee4a1f-4a99-4199-88d1-0746f0597d1d.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/yuan-xiao/8638a408-644e-4ab6-962a-3338aac2b09a.png'
    },
    6: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/home-active.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/classify-active.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/cart-active.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/women-day/my-active.png'
    },
    7: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/nian-nian-fan/my.png'
    },
    8: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/earth-day/my.png'
    },
    9: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/homt.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/homt.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/labour-day/my.png'
    },
    10: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/mothers-day/my.png'
    },
    11: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/children-day/my.png'
    },
    12: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/fathers-day/my.png'
    },
    13: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/dragon-boat/my.png'
    },
    14: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/mid-autumn-festival/my.png'
    },
    15: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/national-day/my.png'
    },
    16: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/culture/my.png'
    },
    17: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/sports/my.png'
    },
    18: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/art/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/art/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/art/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/art/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/art/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/art/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/art/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/art/my.png'
    },
    19: {
        home: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/home.png',
        homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/home.png',
        classify: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/classify.png',
        classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/classify.png',
        shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/cart.png',
        shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/cart.png',
        my: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/my.png',
        myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/double-12/my.png'
    }
//     99: {
//         home: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/98e32f2b-679b-485d-8a9a-6e62659f91b1.png',
//         homeActive: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/98e32f2b-679b-485d-8a9a-6e62659f91b1.png',
//         classify: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/0961a842-6724-45d2-b804-33bf81278b54.png',
//         classifyActive: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/0961a842-6724-45d2-b804-33bf81278b54.png',
//         shoppingCart: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/f3f17e23-c82d-405f-848f-e7ba14b49d43.png',
//         shoppingCartActive: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/f3f17e23-c82d-405f-848f-e7ba14b49d43.png',
//         my: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/8a291b28-fb88-4292-968b-c1f02de91e03.png',
//         myActive: 'https://mallcdn.youpenglai.com/static/admall/skin/cmapagin/8a291b28-fb88-4292-968b-c1f02de91e03.png'
//     }
}

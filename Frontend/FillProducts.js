const productsRowId = document.getElementById("productsRowId");

const PopularCat = document.getElementById("PopularCat");
const VegetablesCat = document.getElementById("VegetablesCat");
const FruitsCat = document.getElementById("FruitsCat");
const DrinksCat = document.getElementById("DrinksCat");
const SnacksCat = document.getElementById("SnacksCat");




let FruitsimagesPath = [
    "Assets/Images/Fruits/Apeicot.jpg",
    "Assets/Images/Fruits/BananaCard400x400.jpg",
    "Assets/Images/Fruits/GreenApple.jpg",
    "Assets/Images/Fruits/Kiwi.jpg",
    "Assets/Images/Fruits/Lemon.jpg",
    "Assets/Images/Fruits/Mandarin.jpg",
    "Assets/Images/Fruits/Mango.jpg",
    "Assets/Images/Fruits/Orange.jpg",
    "Assets/Images/Fruits/Peach.jpg",
    "Assets/Images/Fruits/RedApple.jpg",
];

let VegetablesImagesPath = [
    "Assets/Images/Vegetables/Tomato.jpg",
    "Assets/Images/Vegetables/Svekla.jpg",
    "Assets/Images/Vegetables/Potato.jpg",
    "Assets/Images/Vegetables/Pepper.jpg",
    "Assets/Images/Vegetables/Onion.jpg",
    "Assets/Images/Vegetables/Garlic.jpg",
    "Assets/Images/Vegetables/Eggplant.jpg",
    "Assets/Images/Vegetables/Cucomber.jpg",
    "Assets/Images/Vegetables/Carrot.jpg",
    "Assets/Images/Vegetables/Cabbage.jpg",
];

let SnacksImagesPath = [
    "Assets/Images/Snacks/BabkiniSun.jpg",
    "Assets/Images/Snacks/CashYou.jpg",
    "Assets/Images/Snacks/ChesstisCheese.jpg",
    "Assets/Images/Snacks/Kusya.jpg",
    "Assets/Images/Snacks/LaysGreenOnion.jpg",
    "Assets/Images/Snacks/LaysKrab.jpg",
    "Assets/Images/Snacks/Popcorn.jpg",
    "Assets/Images/Snacks/Semexrb.jpg",
    "Assets/Images/Snacks/Suhariki.jpg",
    "Assets/Images/Snacks/TucPizza.jpg",
];

let DrinksImagesPath = [
    "Assets/Images/Water/ChernoGolovka.jpg",
    "Assets/Images/Water/CocacolaDobriy.jpg",
    "Assets/Images/Water/FantaDobriy.jpg",
    "Assets/Images/Water/FantaDobriy15.jpg",
    "Assets/Images/Water/FreshBar.jpg",
    "Assets/Images/Water/SpriteStreet.jpg",
    "Assets/Images/Water/KvasAlive.jpg",
    "Assets/Images/Water/KvasOchak.jpg",
    "Assets/Images/Water/MohitoLime.jpg",
    "Assets/Images/Water/MohitoStrawBerry.jpg",
];

let FruitsName = [
    "Абрикос",
    "Банан",
    "Яблоки зеленые",
    "Киви",
    "Лимон",
    "Мандарин",
    "Манго",
    "Апельсин",
    "Нектарин",
    "Яблоко сезонное"
];

let VegetablesName = [
    "Томаты вес",
    "Свекла мытая",
    "Картофель вес",
    "Перец красный",
    "Лук репчатый вес",
    "Чеснок вес",
    "Баклажаны вес",
    "Огурцы сред.плод",
    "Морковь вес",
    "Салат Айсберг",
];
let SnacksName = [
    "Семечки Бабкины",
    "Кешью сырой",
    "Cheetos Сыр",
    "Кукуруза Кузя",
    "Чипсы Lay`s лук",
    "Чипсы Lay`s Краб",
    "Попкорн MixBar",
    "Семечки Мартина",
    "Хрусteam",
    "Крекер Tuc Pizza",
];
let DrinksName = [
    "Кола",
    "Добрый Кола",
    "Добрый апельсин",
    "Добрый апельсин",
    "Fresh Bar Kiwi",
    "Спрайт Street",
    "Живой квас",
    "Квас Очаковский",
    "Мохито",
    "Мохито Клубника",
];

let FruitsPrices = [60, 75, 80, 93, 49, 95, 200, 112, 108, 57];
let VegetablesPrices = [78, 110, 85, 117, 34, 47, 125, 49, 21, 160];
let SnackPrices = [156, 340, 81, 70, 180, 180, 99, 125, 23, 71];
let DrinksPrices = [135, 140, 62, 140, 70, 115, 167, 150, 80, 80];

let FruitsWeight = [300, 500, 500, 300, 200, 500, 500, 800, 300, 500];
let VegetablesWeight = [500, 1000, 500, 200, 800, 200, 500, 500, 600, 350];
let SnackWeight = [300, 100, 50, 140, 140, 140, 100, 150, 40, 100];
let DrinksWeight = [2000, 1500, 250, 1500, 450, 1000, 2000, 450, 450, 1500];

function ProductsCatLoad(ImagesPath, Prices, Weight, ProdName, id) {
    productsRowId.innerHTML = "";
    for (let i = 0; i < 10; i++) {
        productsRowId.innerHTML +=
            `
        <div class="productCard">
            <div class="cardContainer">
                <img id="prodImg" src="${ImagesPath[i]}" alt="RedApplePhoto">
                    <span>${Prices[i]}₽</span>
                    <h6>${Weight[i]}г</h6>
                    <h5>${ProdName[i]}</h5>
                   
                    <button  onclick="ProductToBasket(${i},${id})"><img src="Assets/Images/Icons/PlusBtnSim.svg" alt="PlusBtn"></button>
            </div>
        `;
        console.log("FDUNASD");
    }
}


VegetablesCat.addEventListener("click", () => ProductsCatLoad(VegetablesImagesPath, VegetablesPrices, VegetablesWeight, VegetablesName, 0));
FruitsCat.addEventListener("click", () => ProductsCatLoad(FruitsimagesPath, FruitsPrices, FruitsWeight, FruitsName, 1));
DrinksCat.addEventListener("click", () => ProductsCatLoad(DrinksImagesPath, DrinksPrices, DrinksWeight, DrinksName, 2));
SnacksCat.addEventListener("click", () => ProductsCatLoad(SnacksImagesPath, SnackPrices, SnackWeight, SnacksName, 3));

let SendObjects = [];
let SendObjectsId = 0;
let totalSum = 0;
let dataToSend = {};

function ProductToBasket(id, CategoryId) {
    let objToSend = {};
    switch (CategoryId) {
        case 0:
            objToSend = {
                name: VegetablesName[id],
                price: VegetablesPrices[id],
                weight: VegetablesWeight[id]
            }
            SendObjects[SendObjectsId] = objToSend;
            SendObjectsId++;
            totalSum += objToSend.price;

            console.log(objToSend);
            break;
        case 1:
            objToSend = {
                name: FruitsName[id],
                price: FruitsPrices[id],
                weight: FruitsWeight[id]
            }
            SendObjects[SendObjectsId] = objToSend;
            SendObjectsId++;
            totalSum += objToSend.price;
            console.log(objToSend);
            break;
        case 2:
            objToSend = {
                name: DrinksName[id],
                price: DrinksPrices[id],
                weight: DrinksWeight[id]
            }
            SendObjects[SendObjectsId] = objToSend;
            SendObjectsId++;
            totalSum += objToSend.price;
            console.log(objToSend);
            break;
        case 3:
            objToSend = {
                name: SnacksName[id],
                price: SnackPrices[id],
                weight: SnackWeight[id]
            }
            SendObjects[SendObjectsId] = objToSend;
            SendObjectsId++;
            totalSum += objToSend.price;
            console.log(objToSend);
            break;
    }
    dataToSend = {
        products: SendObjects,
        total: totalSum
    };
    console.log(SendObjects);
    console.log(dataToSend);
    // let JsonSendObj = JSON.stringify(dataToSend);
    //console.log(JsonSendObj);
    //localStorage.setItem("busketList", JsonSendObj);


}

const button = document.getElementById("flex-basket");


button.addEventListener("click", async () => {

    window.location.href = "/basket";
    console.log(dataToSend);
    localStorage.setItem("listProd", JSON.stringify(dataToSend));

    /*
    try {
        const response = await fetch("/api/buyProd", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        const data = await response.json();

        console.log("Сервкер ответил:", data);
    }
    catch {
        console.error("пРОИЗОШЛАС ОШ");
    }
        */
});


/*
VegetablesCat.addEventListener("click", () => {
    console.log("Veg");
});
SnacksCat.addEventListener("click", () => {
    console.log("SNACK");
});
DrinksCat.addEventListener("click", () => {
    console.log("dRINK");
});
FruitsCat.addEventListener("click", () => {
    console.log("fRUITS");
});
*/






/*
абрикос - 60руб 300г
банан  - 75 руб  500г
Яблоки гренни смит - 80 руб  500г
Киви - 93 руб  300г
Лимон - 49 руб  200г
мандарин - 95 руб  500г
манго - 200 руб  500г
апельсин - 112 руб  800г
Нектарин - 108 руб  300г
яблоко сез - 57 руб  500г
 */
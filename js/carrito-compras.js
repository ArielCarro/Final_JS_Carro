// ***************************************Se traen productos del .json********************************************

async function getProds() {
    const response = await fetch("./products.json");
    const prods = response.json();
    return prods;
}
getProds().then(function (prodList) {
    let prodListString = JSON.stringify(prodList);
    localStorage.setItem("prodList", prodListString);
})
let prodList = JSON.parse(localStorage.getItem("prodList"));

// ***************************************Se definen funciones de filtro********************************************

//subTypeFilter es una funcion utilizada dentro de typeFilter para simplificar parte de la lógica y ahorrar código. Mapea el array ingresado buscando cual es tiene la
//propiedad type igual al valor item ingresado
function subTypeFilter(array, item) {
    filter = array.map(function (prod) {
        if (prod.type == item) {
            return prod;
        }
    }).filter(Boolean); //uso este filtro para quitar los espacios vacios del array
    if (filter.length >= 1) {
        return filter;
    }
};
//subSizeFilter es una funcion utilizada dentro de sizeFilter para simplificar parte de la lógica y ahorrar código. Mapea el array ingresado buscando cual es tiene la
//propiedad size igual al valor item ingresado
function subSizeFilter(array, item) {
    filter = array.map(function (prod) {
        if (prod.size == item) {
            return prod;
        }
    }).filter(Boolean);
    if (filter.length >= 1) {
        return filter;
    }
    else {
        array = [];
        return array;
    };
};
//Mapea array ingresado buscando algun include en el string de objet.name que sea igual al prompt ingresado. No es case sensitive.
function nameFilter() {
    let item = document.getElementById("nameFilter").value;
    item = item.toLowerCase();
    let filter = testList.map(function (prod) {
        let nameProd = prod.name.toLowerCase();
        if (nameProd.includes(item)) {
            return prod;
        };
    }).filter(Boolean);
    if (filter.length >= 1) {
        testList = filter;
        return testList;
    };
};
//Mapea el array ingresado buscando objetos cuyos .type coincidan con alguno de los filtros indicados
function typeFilter(array, option) {
    let item = null;
    let filter = null;
    let result = null;
    switch (option) {
        case 1:
            item = "zapatillas";
            result = subTypeFilter(array, item);
            return result;
        case 2:
            item = "remera";
            result = subTypeFilter(array, item);
            return result;
        default:
            console.log("Opción no válida");
    };
    return filter;
};
//Mapea el array ingresado buscando que objeto.size coincide con el checkbox clickeado y deshabilita los demas para que no devuelva un array vacio.
function sizeFilter() {
    let sizeCheckbox = document.getElementsByClassName("sizeCheckbox");
    let array = testList;
    let test = 0;
    for (let i = 0; i < sizeCheckbox.length; i++) {//recorre todos los checkbox buscando el que esta checked y crea una variable size que va a ser usada como parametro de la funcion subSizeFilter
        let size = 35 + i;
        i == 11 ? size = "xs" : (i == 12 ? size = "s" : (i == 13 ? size = "m" : (i == 14 ? size = "l" : (i == 15 ? size = "xl" : (i == 16 && (size = "xxl"))))));
        if (sizeCheckbox[i].checked == true) {// Deshabilita todas las checbox
            for (let x = 0; x < sizeCheckbox.length; x++) {
                sizeCheckbox[x].disabled = true;
            };
            sizeCheckbox[i].disabled = false;// Habilita la checkbox de la variable clickeada
            result = subSizeFilter(array, size.toString());// Ejecuta el filtro con el valor de size q le corresponde a la iteracion i donde se encontro un checkbox checked
            testList = result;
        };
    };
    for (let i = 0; i < sizeCheckbox.length; i++) {// Este for recorre las checkbox buscando su hay alguna checked
        sizeCheckbox[i].checked ? test += 1 : test += 0;
    };
    if (test == 0) {
        for (let i = 0; i < sizeCheckbox.length; i++) {//En caso de no haber ninguna checked (test=0) las habilita a todas
            sizeCheckbox[i].disabled = false;
            testList = prodList;
        };;
    };
};
//Mapea el array buscando que objeto.price coincide con la condicion de que su valor esté entre el minimo y máximo indicado
function priceFilter() {
    let min = priceMin;
    let max = priceMax;
    let filter = testList.map(function (prod) {
        if (prod.priceIva >= min && prod.priceIva <= max) {
            return prod;
        };
    }).filter(Boolean);
    if (filter.length >= 1) {
        return filter;
    };
    let result = filter;
    return result;
};
//Mapea el array buscando que el objeto.gender coincida con el prompt inidcado. No es case sensitive
function genderFilter(array, gender) {
    let filter = [];
    item = gender;
    if (gender == "a") {
        filter = array;
        return array;
    } else {
        filter = array.map(function (prod) {
            if (prod.gender == item) {
                return prod;
            };
        }).filter(Boolean);
    };
    if (filter.length >= 1) {
        return filter;
    };
    let result = filter;
    return result;
};
//Ordena el array indicado por precios de forma ascendente o descendente, devuelve un nuevo array sin modificar el original.
//Puede ser usado junto a la funcion filter
function Sort(array, op) {
    switch (op) {
        case 1:
            array.sort(function (a, b) {
                return a.priceIva - b.priceIva;
            });
            break
        case 2:
            array.sort(function (a, b) {
                return b.priceIva - a.priceIva;
            });
            break;
    };
    return testList;
};
// Lee los imputs de los checkbox en el filtro por genero y ejecuta la funcion del filtro por genero
function checkGenderFilter() {
    testList = checkboxGA.checked == true ? genderFilter(testList, "a") : (checkboxGM.checked == true ? genderFilter(testList, "m") : (checkboxGF.checked == true && (testList = genderFilter(testList, "f"))));
};
// Lee los imputs de los checkbox del sort y ejecuta la funcion ordenar por precio
function checkSort() {
    testList = checkboxSa.checked == true ? testList = Sort(testList, 1) : (checkboxSd.checked == true && (testList = Sort(testList, 2)));
};
// Lee los imputs de los checkbox en el filtro por tipo y ejecuta la funcion del filtro por tipo
function checkTypeFilter() {
    testList = checkboxTr.checked == true ? testList = typeFilter(testList, 2) : (checkboxTz.checked == true && (testList = typeFilter(testList, 1)));
};

// ***************************************Se definen funciones para mostrar catalogo********************************************

// Actualiza el catalogo teniendo en cuenta los filtros aplicados
function showProd() {
    priceMin = document.getElementById("priceMin").value;//Siempre se aplica el price filter cuando se muestran los productos
    priceMax = document.getElementById("priceMax").value;
    testList = priceFilter();
    contenedor.innerHTML = "";
    testList.forEach((prod) => {//Muestro las cards de todos los productos en el array
        if (prod.stock > 0) {
            let card = document.createElement("div");
            card.classList.add("cardDiv", "col-sm-12", "col-lg-3");
            let html = `
            <div class="card" style="width: 100%;">
            <img src="${prod.imagen}" class="card-img-top border" alt="${prod.name}">
            <div class="card-body">
            <h5 class="card-title">${prod.name}</h5>
            <p class="card-text">Precio :$${prod.priceIva}</p>
            <div class="d-flex justify-content-between align-items-center">
            <a href="#cart" class="btn btn-primary" onClick="addCart(${prod.id})">Comprar</a>
            <p>Stock: ${prod.stock}</p>
        </div>
    </div>
          `;
            card.innerHTML = html;
            contenedor.appendChild(card);
        };
    });
    //Reinicio los checkbox de los filtros
    let sizeCheckbox = document.getElementsByClassName("sizeCheckbox")
    for (let i = 0; i < sizeCheckbox.length; i++) {
        sizeCheckbox[i].disabled = false;
        sizeCheckbox[i].checked = false;
    };
    let resetCheckbox = document.getElementsByClassName("reset")
    for (let i = 0; i < resetCheckbox.length; i++) {
        resetCheckbox[i].checked = false;
    };
    document.getElementById("nameFilter").value = null;
    filteredTestList = testList;
    testList = prodList;
};
// Actualiza el catalogo teniendo en cuenta los filtros aplicados y los stocks modificados por la actividad del carrito
function showFilteredProd() {
    contenedor.innerHTML = "";
    filteredTestList.forEach((prod) => {
        if (prod.stock > 0) {
            let card = document.createElement("div");
            card.classList.add("cardDiv", "col-sm-12", "col-lg-3");
            let html = `
            <div class="card" style="width: 100%;">
            <img src="${prod.imagen}" class="card-img-top border" alt="${prod.name}">
            <div class="card-body">
            <h5 class="card-title">${prod.name}</h5>
            <p class="card-text">Precio :$${prod.priceIva}</p>
            <div class="d-flex justify-content-between align-items-center">
            <a href="#cart" class="btn btn-primary" onClick="addCart(${prod.id})">Comprar</a>
            <p>Stock: ${prod.stock}</p>
        </div>
    </div>
          `;
            card.innerHTML = html;
            contenedor.appendChild(card);
        };
    });
};

// ***************************************Se definen funciones del carrito********************************************

// Añade producto seleccionado a carrito
const addCart = (prodId) => {
    itemsInCarthtml.innerHTML = "";
    itemsInCart += 1;
    itemsInCarthtml.innerHTML = itemsInCart;
    let check = 0;
    if (cart.length == 0) {
        cart = testList.map(function (prod) {
            if (prod.id == prodId) {
                prod.stock -= 1;
                return prod;
            }
        }).filter(Boolean);
        showFilteredProd();
        showCart();
    } else {
        cart.map(function (prod) {
            if (prod.id == prodId) {
                check = 1;
                prod.quant += 1;
                prod.stock -= 1;
                showFilteredProd();
                showCart();
            };
        });
        if (check == 0) {
            let addNewProd = testList.map(function (prod) {
                if (prod.id == prodId) {
                    prod.stock -= 1;
                    return prod;
                };
            }).filter(Boolean);
            cart.push(addNewProd[0]);
            showFilteredProd();
            showCart();
        };
    };
};
// Actualiza carrito con los items añadidos o removidos
const showCart = () => {
    let loggedUserString = localStorage.getItem("loggedUser");
    let loggedUser = JSON.parse(loggedUserString);
    let total = 0;
    cartDiv.classname = "cart";
    cartDiv.innerHTML = "";
    if (cart.length > 0) {
        cart.forEach((prod, indice) => {
            total = total + prod.priceIva * prod.quant;
            const cartContainer = document.createElement("li");
            cartContainer.className = "cartCard border-bottom"
            cartContainer.innerHTML = `
        <div><img class="car-img" src="${prod.imagen}"/></div>
        <div class="cartProdDetailName">${prod.name}</div>
        <div class="cartProdDetailQuant" > Cantidad: ${prod.quant}</div>
        <div class="cartProdDetailPrice"> Precio: $ ${prod.priceIva}</div>
        <div class="cartProdDetailTot"> Subtotal: $ ${prod.priceIva * prod.quant}</div>
        <a class="remove-prod" onClick="removeProd(${indice})"><img src="./img/bin.svg" alt="Bin"   class="remove-product"></a>
        `;
            cartDiv.appendChild(cartContainer);
        });
    };
    if (cart.length == 0) {
        const cartContainer = document.createElement("li");
        cartContainer.innerHTML = "Carrito Vacio";
        cartContainer.className = "cartCard";
        cartDiv.appendChild(cartContainer);
    } else if (loggedUser.logged == true) {
        const totalContainer = document.createElement("li");
        totalContainer.innerHTML = `
        <div>Total a pagar: $${total}</div>
        <div><button type="button" class="btn btn-success" onClick="finishBtn()">Finalizar Compra</button></div>
        `;
        totalContainer.className = "cartTotal";
        cartDiv.appendChild(totalContainer);
    } else {
        const totalContainer = document.createElement("li");
        totalContainer.innerHTML = `
        <div>Total a pagar: $${total}</div>
        <div>Inicie Sesión para comprar</div>
        `;
        totalContainer.className = "cartTotal";
        cartDiv.appendChild(totalContainer);
    };
};
// Remueve un elemento del carrito.
const removeProd = (indice) => {
    itemsInCarthtml.innerHTML = "";
    itemsInCart -= 1;
    itemsInCarthtml.innerHTML = itemsInCart;
    if (cart[indice].quant == 1) {
        filteredTestList.map(function (prod) {
            if (prod.id == cart[indice].id) {
                prod.stock += 1;
                return prod;
            };
        }).filter(Boolean);
        cart.splice(indice, 1);
        showFilteredProd();
        showCart();
    }
    else {
        cart[indice].quant -= 1
        filteredTestList.map(function (prod) {
            if (prod.id == cart[indice].id) {
                prod.stock += 1;
                return prod;
            };
        }).filter(Boolean);
        showFilteredProd();
        showCart();
    };
};
// Finaliza compra, borra carrito y contador del mismo.
function finishBtn() {
    cart = [];
    itemsInCart = 0;
    itemsInCarthtml.innerHTML = "";
    itemsInCarthtml.innerHTML = itemsInCart;
    cartDiv.classname = "cart";
    cartDiv.innerHTML = "";
    const cartContainer = document.createElement("li");
    cartContainer.innerHTML = "Carrito Vacio";
    cartContainer.className = "cartCard";
    cartDiv.appendChild(cartContainer);
    Swal.fire({
        title: 'Felicitaciones',
        text: 'Su solicitud de compra ha sido enviada',
        icon: 'success',
        confirmButtonText: 'Ir a pago'
    });
};

// ***************************************Se definen event listeners********************************************

// Event listener para que un enter en la seccion de filtros ejecute el boton buscar
let aside = document.getElementById("aside");
aside.addEventListener("keypress", function (event) {
    event.key === "Enter" && showProd();
});
// Event listener para que un enter en la seccion de filtros por nombre ejecute el boton buscar
let nameFilterEnter = document.getElementById("nameFilter");
nameFilterEnter.addEventListener("keypress", function () {
    nameFilter();
});

// Event listener para que al hacer click en algun talle se active el filtro de talles
let sizeCheckBox = document.getElementsByClassName("sizeCheckbox");
for (let i = 0; i < sizeCheckBox.length; i++) {
    sizeCheckBox[i].addEventListener("click", function () {
        sizeFilter();
    });
};
// Event listener para que funcione la seleccion del filtro por genero
let genderFilterClass = document.getElementsByClassName("genderFilter");
for (let i = 0; i < genderFilterClass.length; i++) {
    genderFilterClass[i].addEventListener("click", function () {
        checkGenderFilter();
    });
};
// Event listener para que funcione la seleccion del filtro por tipo
let typeFilterClass = document.getElementsByClassName("typeFilter");
for (let i = 0; i < typeFilterClass.length; i++) {
    typeFilterClass[i].addEventListener("click", function () {
        checkTypeFilter();
    });
};
// Event listener para que funcione la seleccion del orden en el que se presentan los productos
let sortClass = document.getElementsByClassName("sort");
for (let i = 0; i < sortClass.length; i++) {
    sortClass[i].addEventListener("click", function () {
        checkSort();
    });
};
// ***************************************Se definen parametros de DOM********************************************

let itemsInCarthtml = document.getElementById("itemsInCart");
document.getElementById("priceMax").value = Math.max.apply(Math, prodList.map(function (prod) { return prod.priceIva; }));
document.getElementById("priceMin").value = Math.min.apply(Math, prodList.map(function (prod) { return prod.priceIva; }));
let checkboxGA = document.getElementById("genderAll");
let checkboxGM = document.getElementById("genderM");
let checkboxGF = document.getElementById("genderF");
let checkboxTr = document.getElementById("typer");
let checkboxTz = document.getElementById("typez");
let checkboxSa = document.getElementById("sortA");
let checkboxSd = document.getElementById("sortD");
const contenedor = document.getElementById("container");
let cartDiv = document.getElementById("cart");

// ***************************************Se definen arrays y variables********************************************

let cart = [];
let itemsInCart = 0;
let testList = prodList;
let filteredTestList = testList;

// ***************************************Se ejecuta codigo para mostrar catálogo********************************************

testList.forEach((prod) => {
    let card = document.createElement("div");
    card.classList.add("cardDiv", "col-sm-12", "col-lg-3");
    let html = `
    <div class="card" style="width: 100%;">
    <img src="${prod.imagen}" class="card-img-top" alt="${prod.name}">
    <div class="card-body">
        <h5 class="card-title">${prod.name}</h5>
        <p class="card-text">Precio :$${prod.priceIva}</p>
        <div class="d-flex justify-content-between align-items-center">
        <a href="#cart" class="btn btn-primary" onClick="addCart(${prod.id})" id="btn${prod.id}">Comprar</a>
        <p>Stock: ${prod.stock}</p>
    </div>
    </div>
      `;
    card.innerHTML = html;
    contenedor.appendChild(card);
});
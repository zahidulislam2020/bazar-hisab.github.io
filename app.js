
var inputBtn = document.getElementById("btn-input");
var product = document.getElementById("product");
var netWeight = document.getElementById("net-wright");
var price = document.getElementById("price");
var display = document.getElementById("pid");
var day_night_time = document.querySelector(".day-night-time");

// getting input values including total price of each item

inputBtn.addEventListener("click", clickHandler);
let charMatching = [];
let num = 0;
let array = [[], [], [], [], []];

function clickHandler(e) {
  e.stopImmediatePropagation();
  let message = document.querySelector(".message");

  // avoiding duplicate item insertion
  if (itemPurify(product.value.trim())) {
    if (
      array[1].includes(itemPurify(product.value.trim())) ||
      charMatching.includes(itemPurify(product.value.trim()).toLowerCase())
    ) {
      // creating warning message for duplicate insertion
      message.style.visibility = "visible";
      product.classList.add("warning");
    } else {
      // removing warning message for duplicate insertion
      message.style.visibility = "hidden";
      product.classList.remove("warning");

      // creating arrays and reseting input fields
      if (
        itemPurify(product.value.trim()) &&
        QTYPurify(netWeight.value.trim()) &&
        pricePurify(price.value.trim())
      ) {
        num++;
        array[0].push(num);
        array[1].push(itemPurify(product.value.trim()));
        array[2].push(QTYPurify(netWeight.value.trim()));
        array[3].push(pricePurify(price.value.trim()));
        array[4].push(
          QTYPurify(netWeight.value.trim()) * pricePurify(price.value.trim())
        );

        charMatching.push(itemPurify(product.value.trim()).toLowerCase());

        // reset input fields
        resetInputFields();
        // creating list of items
        addingItemToList(array);
        // grand total
        grandTotal(array);
      }
    }
  }
}

// reset function
function resetInputFields() {
  product.value = "";
  netWeight.value = "";
  price.value = "";
}

// inputs purification

function itemPurify(item) {
  product.classList.remove("warning");
  let invalidField0 = document.querySelectorAll(".invalid-input")[0];
  invalidField0.style.visibility = "hidden";
  if (item && item >= "A") {
    return item;
  }
  return invalidItem();
}

function QTYPurify(qty) {
  netWeight.classList.remove("warning");
  let invalidField1 = document.querySelectorAll(".invalid-input")[1];
  invalidField1.style.visibility = "hidden";
  if (qty && !isNaN(qty)) {
    return qty;
  }
  return invalidQTY();
}

function pricePurify(rate) {
  price.classList.remove("warning");
  let invalidField2 = document.querySelectorAll(".invalid-input")[2];
  invalidField2.style.visibility = "hidden";
  if (rate && !isNaN(rate)) {
    return rate;
  }
  return invalidPrice();
}

// invalid input function

function invalidItem() {
  netWeight.classList.remove("warning");
  let invalidField1 = document.querySelectorAll(".invalid-input")[1];
  invalidField1.style.visibility = "hidden";
  price.classList.remove("warning");
  let invalidField2 = document.querySelectorAll(".invalid-input")[2];
  invalidField2.style.visibility = "hidden";
  setTimeout(function () {
    product.classList.add("warning");
    let invalidField0 = document.querySelectorAll(".invalid-input")[0];
    invalidField0.style.visibility = "visible";
  });
}

function invalidQTY() {
  price.classList.remove("warning");
  let invalidField2 = document.querySelectorAll(".invalid-input")[2];
  invalidField2.style.visibility = "hidden";
  setTimeout(function () {
    netWeight.classList.add("warning");
    let invalidField1 = document.querySelectorAll(".invalid-input")[1];
    invalidField1.style.visibility = "visible";
  });
}

function invalidPrice() {
  setTimeout(function () {
    price.classList.add("warning");
    let invalidField2 = document.querySelectorAll(".invalid-input")[2];
    invalidField2.style.visibility = "visible";
  });
}

// function for item list
let id = 0;
function addingItemToList(array) {
  let parentOfItemContainer = document.querySelector(".scroll");
  let item_container = document.createElement("div");
  item_container.classList.add("item-container");
  item_container.style.backgroundColor = "green";
  item_container.style.color = "thistle";
  // animating item when listing
  item_container.style.opacity = "0";
  setTimeout(function () {
    item_container.classList.add("trans");
    item_container.style.opacity = "1";
  });
  ///////////////////////////////
  item_container.id = id;
  id++;

  array.forEach((subArray, j) => {
    let element = document.createElement("span");
    subArray.forEach((value, i) => {
      j === 3 || j === 4
        ? (element.innerHTML = value + " ৳")
        : (element.innerHTML = value);
      element.id = i;
      item_container.appendChild(element);
    });
  });
  // creating delete button
  let icon_rack = document.createElement("span");
  let iTag = document.createElement("i");
  iTag.className = "bi bi-trash";
  icon_rack.appendChild(iTag);
  item_container.appendChild(icon_rack);

  parentOfItemContainer.appendChild(item_container);
  manageScrollbar(parentOfItemContainer);
  // click event for delete item
  icon_rack.addEventListener("click", (e) =>
    deleteHandler(e, parentOfItemContainer, item_container, array)
  );
}

// function to delete item
function deleteHandler(e, parentOfItemContainer, item_container, array) {
  e.stopImmediatePropagation();
  // after deleting an item, it is required to update the arrays of data accordingly
  let arr = parentOfItemContainer.childNodes;

  charMatching.splice(item_container.id, 1);
  let len = array[0].length - 1;
  array[0].splice(item_container.id);

  for (let i = item_container.id; i < len; i++) {
    array[0].push(Number(i) + 1);
  }
  for (let i = 1; i < array.length; i++) {
    array[i].splice(item_container.id, 1);
  }

  item_container.remove();
  id = array[0].length;
  num = array[0].length;
  updateSNAndGT(array, arr);
  manageScrollbar(parentOfItemContainer);
}

// update serial number, item_container.id and grand total after deleting an item
function updateSNAndGT(array, arr) {
  // updating serial number and item_container.id
  array[0].forEach((sn, i) => {
    arr[i].childNodes[0].innerHTML = sn;
    arr[i].id = sn - 1;
  });
  // updating grand total
  let updatedGT = array[4].reduce((total, curr) => {
    total = total + curr;
    return total;
  }, 0);

  let newUpdatedGT = updatedGT < 10 ? "0" + updatedGT : updatedGT;
  display.innerHTML = `মোট খরচঃ ${newUpdatedGT} টাকা`;
}

// function to produce grand total
function grandTotal(array) {
  let GT = array[4].reduce((total, curr) => {
    total = total + curr;
    return total;
  }, 0);

  let newGT = GT < 10 ? "0" + GT : GT;
  display.innerHTML = `মোট খরচঃ ${newGT} টাকা`;
}

// managing scrollbar

function manageScrollbar(parentOfItemContainer) {
  //console.log(parentOfItemContainer.scrollHeight > parentOfItemContainer.clientHeight)
  if (parentOfItemContainer.scrollHeight > parentOfItemContainer.clientHeight) {
    console.log("hi");
    parentOfItemContainer.style.overflowY = "scroll";
    parentOfItemContainer.style.marginRight = "-16px";
    document.querySelector(".item-container").style.width = "99%";
  } else {
    console.log("bye");
    parentOfItemContainer.style.overflowY = "auto";
    parentOfItemContainer.style.marginRight = "0";
    document.querySelector(".item-container").style.width = "100%";
  }
}

// creating date to represent

function presentingTime() {
  let array_of_months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "অগাস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  let array_of_day = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
  ];
  let date = new Date();
  let hr = date.getHours();
  let year = date.getFullYear();
  let month = date.getMonth();
  let _date = date.getDate();
  let day = date.getDay();

  let day_night = "";
  if (hr > 4 && hr < 12) {
    day_night = "সকাল";
  } else if (hr > 11 && hr < 15) {
    day_night = "দুপুর";
  } else if (hr >= 15 && hr < 18) {
    day_night = "বিকাল";
  } else if (hr > 17 && hr < 19) {
    day_night = "সন্ধ্যা";
  } else {
    day_night = "রাত";
  }

  day_night_time.innerHTML = `${array_of_day[day]}, ${english_digit_to_bangla(
    _date
  )}-${array_of_months[month]}-${english_digit_to_bangla(year)} (${day_night})`;
}

presentingTime();

// converting English digit to Bangla

function english_digit_to_bangla(english_number) {
  let banglaNumber = "০১২৩৪৫৬৭৮৯".split("");
  let arr = String(english_number).split("");
  for (let i = 0; i < arr.length; i++) {
    arr.splice(i, 1, banglaNumber[arr[i]]);
  }
  return arr.join("");
}

/////////////////////////***End***/////////////////////////////////////////////

const itemsContainer = document.getElementById("itemsCon");
const menBtn = document.getElementById("Men");
const womenBtn = document.getElementById("Women");
const kidsBtn = document.getElementById("Kids");

const state = {
  category: "Men",
  data: [],
};

async function fetchData(category) {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await response.json();
    const { categories } = data;
    const filteredList = await categories.filter(
      (each) => each.category_name === category
    );
    const ccList = filteredList[0].category_products;

    ccData = ccList.map((each) => ({
      badgeText: each.badge_text,
      compareAtPrice: each.compare_at_price,
      id: each.id,
      image: each.image,
      secondImage: each.second_image,
      price: each.price,
      title: each.title,
      vendor: each.vendor,
    }));

    return ccData;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}

function removePrevCat(category) {
  const { data } = state;

  data.map((each) => {
    const childElement = document.getElementById(each.id);
    console.log(childElement)
    itemsContainer.removeChild(childElement);
  });
}

function updateState(currentCategory) {
  state.category = currentCategory;
}

async function handleButtonClick(event) {
  var appCon = document.getElementById('appCon')
  appCon.appendChild(itemsContainer);
  const currentCategory = event.target.value;
  const btn = document.getElementById(currentCategory);
  const prevBtn = document.getElementById(state.category);
  prevBtn.classList.remove("active");
  btn.classList.add("active");
  removePrevCat(state.category);
  updateState(currentCategory);
  app();
}



function createAndAppendItem(cardDetails) {
  var listItem = document.createElement("li");
  listItem.id = cardDetails.id;
  listItem.classList.add("item-card");
  itemsContainer.appendChild(listItem);

  var imageCon = document.createElement('div');
  imageCon.classList.add('container')

  var textCon = document.createElement('div')
  textCon.classList.add('text-overlay')
  textCon.style.backgroundColor = 'black'
  textCon.textContent = cardDetails.badgeText

  var imgElement = document.createElement("img");
  imgElement.src = cardDetails.image;
  imgElement.alt = cardDetails.title;
  imgElement.classList.add("image-edit");
  imageCon.appendChild(imgElement);
  imageCon.appendChild(textCon);
  listItem.appendChild(imageCon);
  

  var titleBrandCon = document.createElement("div");
  titleBrandCon.classList.add("title-brand-con");
  listItem.appendChild(titleBrandCon);

  var itemTitle = document.createElement("p");
  itemTitle.textContent = cardDetails.title;
  itemTitle.classList.add("title-head");
  titleBrandCon.appendChild(itemTitle);

  var itemBrand = document.createElement("p");
  itemBrand.textContent = cardDetails.vendor;
  itemBrand.classList.add("title-brand");
  titleBrandCon.appendChild(itemBrand);

  var priceCon = document.createElement("div");
  priceCon.classList.add("price-con");
  listItem.appendChild(priceCon);

  var price = document.createElement("p");
  price.textContent = `Rs ${cardDetails.price}.00`;
  price.classList.add("price");
  priceCon.appendChild(price);

  var strikeOffPrice = document.createElement("p");
  strikeOffPrice.textContent = `${cardDetails.compareAtPrice}.00`;
  strikeOffPrice.classList.add("strikeOffPrice");
  priceCon.appendChild(strikeOffPrice);

  // Calculate the discount percentage
  const discountedPrice = cardDetails.compareAtPrice - cardDetails.price;
  const discountPercentage =
    (discountedPrice / cardDetails.compareAtPrice) * 100;
  const discountPrice = Math.round((discountPercentage * 100) / 100);

  var discount = document.createElement("p");
  discount.textContent = `${discountPrice}% Off`;
  discount.classList.add("discount");
  priceCon.appendChild(discount);

  var buyBtn = document.createElement("button");
  buyBtn.type = "button";
  buyBtn.textContent = "Add To Cart";
  buyBtn.classList.add("add-to-cart-btn");

  listItem.appendChild(buyBtn);
}

const app = async () => {
  const fetchResponse = await fetchData(state.category);
  state.data = fetchResponse;
  const btn = document.getElementById(state.category);
  btn.classList.add("active");

  menBtn.addEventListener("click", handleButtonClick);
  womenBtn.addEventListener("click", handleButtonClick);
  kidsBtn.addEventListener("click", handleButtonClick);

  fetchResponse.map((each) => {
    createAndAppendItem(each);
  });
};

app();

console.log(itemsContainer);

const API_URL = 'http://localhost:3000/shop_lists/1';

let addNewInput = document.getElementById("new-item-input"),
    addNewBtn = document.getElementById("new-item-btn"),
    listWrapper = document.getElementById("list-wrapper");


addNewBtn.addEventListener("click", () => {
  if(addNewInput.value) {
    listWrapper.append(generateNewItem(addNewInput.value));
  }
  addNewInput.value = '';
});


function generateNewItem(name) {
  let li = document.createElement('li'),
      wrapper = document.createElement('label'),
      input = document.createElement('input'),
      label = document.createElement('span');
  label.classList.add('checkbox__label');
  label.innerHTML = name;
  input.setAttribute('type', 'checkbox');
  wrapper.classList.add('checkbox');
  wrapper.append(input, label);
  li.classList.add('list__item');
  li.append(wrapper);
  return li;
}


function getList() {
  fetch(API_URL, {mode: 'cors'})
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
     })
    .then(function(list) {
      console.log(list);
    })
    .catch(function(error) {
        console.log(error);
    });
}

getList();


function createList(title) {
  let listTitle = {title: "title"};

  fetch("http://localhost:3000/shop_lists", {
    method: "POST", 
    body: JSON.stringify(listTitle)
  }).then(res => {
    console.log("Request complete! response:");
  }).then(function(listId) {
    console.log(listId);
  });
}

createList("olekl");
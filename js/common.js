'use strict'

const API_URL = 'http://68.183.12.15:3000/shop_lists';
let currentList;

function List(id) {
  this.constructor(id);
}

List.prototype = {
  id: undefined,
  title: undefined,
  createAt: undefined,
  updateAt: undefined,
  title: undefined,

  listItems: {},
  constructor: function(id, title, createAt, updateAt) {
    this.id = id;
    this.title = title;
    this.createAt = createAt;
    this.updateAt = updateAt;
  },
  getListItems: function() {
    getList(this.id, this);
  },
  generateNewList: function(title, listObj) {
    let listTitle = {'title': title};

    fetch(API_URL, {
      method: "POST", 
      body: JSON.stringify(listTitle),
      headers: new Headers({'content-type': 'application/json'})
    }).then(response => {
      console.log("Request complete! response:", response);
      return response.json();
    }).then(function(listId) {
      console.log(listId);
      listObj.title = listId.title;
      listObj.createAt = listId.created_at;
      listObj.updateAt = listId.updated_at;
      listObj.title = listId.title;
      listObj.id = listId.id;
    });
  }
}


let addNewInput = document.getElementById("new-item-input"),
    addNewBtn = document.getElementById("new-item-btn"),
    listWrapper = document.getElementById("list-wrapper"),
    generateList = document.getElementById("generate-list"),
    newListTitle = document.getElementById("new-list-title");

if(addNewBtn) {
  addNewBtn.addEventListener("click", () => {
    if(addNewInput.value) {
      listWrapper.append(generateNewItem(addNewInput.value));
    }
    addNewInput.value = '';
  });
}

if(generateList) {
  generateList.addEventListener("click", () => {
    if(newListTitle.value) {
      currentList = new List();
      currentList.generateNewList(newListTitle.value, currentList);
    }
    newListTitle.value = '';
  });
}


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


function getList(id, listObj) {
  const link = API_URL + '/' + id;
  fetch(link, {mode: 'cors'})
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
     })
    .then(function(list) {
      console.log(list);
      listObj.listItems = list;
    })
    .catch(function(error) {
        console.log(error);
    }
  );
}

// getList();


// function createList(title) {
//   let listTitle = {title: title};

//   fetch("http://localhost:3000/shop_lists", {
//     method: "POST", 
//     body: JSON.stringify(listTitle),
//     headers: new Headers({'content-type': 'application/json'})
//   }).then(response => {
//     console.log("Request complete! response:", response);
//     return response.json();
//   }).then(function(listId) {
//     console.log(listId);
//   });
// }

// createList("olekl");


var x = new List(1);
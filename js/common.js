'use strict'

const API_URL = 'http://68.183.12.15:3000/shop_lists',
      ORIGIN_URL = window.location.origin;
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
    this.list = [];
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
      console.log('listId', listId);
      listObj.title = listId.title;
      listObj.createAt = listId.created_at;
      listObj.updateAt = listId.updated_at;
      listObj.title = listId.title;
      listObj.id = listId.id;
      listObj.list = listId.items;
      window.location.href = ORIGIN_URL + '/#list:'+ listObj.id;
    });
  },
  generateHtmlList: function() {
    let listWrapper = document.getElementById('list-wrapper');
    currentList.list.forEach((listItem) => {
      listWrapper.append(generateNewItem(listItem));
    });
  },
  addNewItem: function(name, status) {
    let listWrapper = document.getElementById('list-wrapper');
    let listItem = {'name': name, 'status': status};
    fetch(API_URL + '/' + currentList.id + '/items', {
      method: "POST", 
      body: JSON.stringify(listItem),
      headers: new Headers({'content-type': 'application/json'})
    }).then(response => {
      console.log("Request complete! response:", response);
      return response.json();
    }).then(function(item) {
      console.log("Request complete! response:", item.id);
      listWrapper.append(generateNewItem(item));
    });
  },
  updateListItem: function(name, status, id) {
    let listItem = {'name': name, 'status': status};
    fetch(API_URL + '/' + currentList.id + '/items/' + id, {
      method: "PUT", 
      body: JSON.stringify(listItem),
      headers: new Headers({'content-type': 'application/json'})
    }).then(response => {
      console.log("Request complete!");
    });
  }
}


document.body.addEventListener("click", ({target}) => {
  if(target == document.getElementById("new-item-btn")) {
    let addNewInput = document.getElementById("new-item-input"),
        listWrapper = document.getElementById("list-wrapper");
    if(addNewInput.value) {
      currentList.addNewItem(addNewInput.value, false);
    }
    addNewInput.value = '';
  }
});

document.body.addEventListener("click", ({target}) => {
  if(target == document.getElementById("generate-list")) {
    let newListTitle = document.getElementById("new-list-title");
    if(document.getElementById("new-list-title").value) {
      currentList = new List();
      currentList.generateNewList(newListTitle.value, currentList);
    }
    newListTitle.value = '';
  }
});

document.body.addEventListener("change", (event) => {
  let target = event.target.closest('.checkbox')
  if(target) {
    let id = target.id,
        name = target.querySelector('.checkbox__label').innerText,
        status = target.querySelector('input').checked;
    currentList.updateListItem(name, status, id);
  }
});

function generateNewItem({name, status, id}) {
  let li = document.createElement('li'),
      wrapper = document.createElement('label'),
      input = document.createElement('input'),
      label = document.createElement('span');
  label.classList.add('checkbox__label');
  label.innerHTML = name;
  input.setAttribute('type', 'checkbox');
  input.checked = status;
  wrapper.classList.add('checkbox');
  wrapper.append(input, label);
  wrapper.setAttribute('id', id);
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
      listObj.title = list.title;
      listObj.createAt = list.created_at;
      listObj.updateAt = list.updated_at;
      listObj.title = list.title;
      listObj.id = list.id;
      listObj.list = list.items;
      listObj.listFullObj= list;
      listObj.generateHtmlList();
    })
    .catch(function(error) {
        console.log(error);
    }
  );
}

let router = new Router([
  new Route('home', 'home.html', true),
  new Route('list', 'list.html')
]);
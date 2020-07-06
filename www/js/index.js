var index = -1;
var app = document.getElementById("app");
var products = [];

getAll();

function showProducts() {
  // Display all
  app.innerHTML = "<nav class='fixed-top navbar navbar-light bg-light'><a class='navbar-brand' href='#'><button type='button' id='btn-create' class='btn btn-danger'>Create product</button></a></nav>";
  for (var i = 0; i < products.length; i++) {
    app.innerHTML += "<div class='card mt-5'><div class='card-body'><h5 class='card-title'>" + products[i].Name + "</h5><p class='card-text'>Quantity: " + products[i].Quantity + "</p><p class='card-text'>$" + products[i].Price + "</p><button type='button' index='" + i + "' class='mr-2 btn btn-danger btn-update'>Update</button><button type='button' index='" + i + "' class='btn btn-danger btn-delete' data-toggle='modal' data-target='#exampleModal'>Delete</button></div></div>";
  }

  // Set up for delete action
  var deleteButtons = document.getElementsByClassName("btn-delete");

  for (var j = 0; j < deleteButtons.length; j++) {
      deleteButtons[j].addEventListener("click", function(event) {
        index = event.target.getAttribute("index");
      });
   }

   document.getElementById("btn-yes").addEventListener("click", function(event) {
      deleteProduct(products[index].Id);
   });

   // Set up for update action
   var updateButtons = document.getElementsByClassName("btn-update");

   for (var z = 0; z < updateButtons.length; z++) {
       updateButtons[z].addEventListener("click", function(event) {
         index = event.target.getAttribute("index");
         goToUpdateScr(products[index], 'update');
       })
   }

   // Set up for create action
   document.getElementById('btn-create').addEventListener("click", function(event) {
       goToUpdateScr({
         Name: '',
         Quantity: '',
         Price: ''
       }, 'create')
   })
}

function goToUpdateScr(product, category) {
    app.innerHTML = "<form id='update-form'><div class='form-group'><label for='txtName'>Product name</label><input type='text' value='" + product.Name + "' class='form-control' id='txtName' placeholder='Enter name...'></div><div class='form-group'><label for='txtQuantity'>Quantity</label><input type='text' value='" + product.Quantity + "' class='form-control' id='txtQuantity' placeholder='Enter quantity...'></div><div class='form-group'><label for='txtPrice'>Price</label><input type='text' value='" + product.Price + "' class='form-control' id='txtPrice' placeholder='Enter price...'></div><button id='btn-back' class='mr-2 btn btn-primary'>Back</button><button id='btn-update' class='btn btn-primary'>Submit</button></form>";

    document.getElementById("btn-back").addEventListener("click", function(event) {
        getAll();
    })

    document.getElementById("update-form").addEventListener("submit", function(event) {
        event.preventDefault();
    })

    document.getElementById("btn-update").addEventListener("click", function(event) {
        var data = {
          id: product.Id,
          name: $("#txtName").val(),
          quantity: parseInt($("#txtQuantity").val()),
          price: parseFloat($("#txtPrice").val())
        }

        if (category === 'update') {
          updateProduct(data);
        } else {
          createProduct(data);
        }
    })
}

function getAll() {
  var request = new XMLHttpRequest();
  request.open("GET", "https://192.168.43.242:45455/api/products", true);
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      products = JSON.parse(this.responseText);
      showProducts();
    }
  }
  request.send();
}

function deleteProduct(id) {
  var request = new XMLHttpRequest();
  request.open("DELETE", "https://192.168.43.242:45455/api/products/" + id, true);
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        $('#exampleModal').modal('hide')
        getAll();
    }
  }
  request.send();
}

function updateProduct(product) {
  var request = new XMLHttpRequest();

  request.open("PUT", "https://192.168.43.242:45455/api/products/" + product.id, true);

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        getAll();
    }
  }

  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(product));
}

function createProduct(product) {
  var request = new XMLHttpRequest();

  request.open("POST", "https://192.168.43.242:45455/api/products", true);

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        getAll();
    }
  }

  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(product));
}
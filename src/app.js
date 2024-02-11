App = {
  loading: false,
  contracts: {},

  load: async () => {
      //loadWeb3() JS allows client to talk to blockchain
      await App.loadWeb3()
      //load account
      await App.loadAccount()
      //load contract
      await App.loadContract()
      //display
      await App.render()
    },

    loadWeb3: async () => {

      if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            //console.log(web3.eth.accounts[0]);  
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
    // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },

  //web3.eth.accounts[0] - meaning first account on ganache
  loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
      //web3.eth.defaultAccount=web3.eth.accounts[0]
    },
    
  loadContract: async () => {
  // Create a JavaScript version of the smart contract
  // const todoList = await $.getJSON('TodoList.json')
  const products = await $.getJSON('ProductContract.json')
  const manufacturer = await $.getJSON('ManufacturerContract.json')
  const supplier = await $.getJSON('SupplierContract.json')
  const shop = await $.getJSON('ShopContract.json')

  // console.log('todoList:', todoList)
  // console.log('product:', product)

  // App.contracts.TodoList = TruffleContract(todoList)
  // App.contracts.TodoList.setProvider(App.web3Provider)

  App.contracts.ProductContract = TruffleContract(products)
  App.contracts.ProductContract.setProvider(App.web3Provider)
  App.contracts.ManufacturerContract = TruffleContract(manufacturer)
  App.contracts.ManufacturerContract.setProvider(App.web3Provider)
  App.contracts.SupplierContract = TruffleContract(supplier)
  App.contracts.SupplierContract.setProvider(App.web3Provider)
  App.contracts.ShopContract = TruffleContract(shop)
  App.contracts.ShopContract.setProvider(App.web3Provider)
 

  // Hydrate the smart contract with values from the blockchain
  // App.todoList = await App.contracts.TodoList.deployed()
  // console.log("App.todoList: ", App.todoList);
  App.products = await App.contracts.ProductContract.deployed()
  // console.log("App.product: ", App.products);
  App.manufacturer = await App.contracts.ManufacturerContract.deployed()
  App.supplier = await App.contracts.SupplierContract.deployed()
  App.shop = await App.contracts.ShopContract.deployed()

  // console.log("App.supplier: ", App.supplier);

  },

  render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }

     // Update app loading state
      // App.setLoading(true)
      
      // Render Account
      $('#account').html(App.account)

      // Add product
      // await App.addProduct()

      // Render products
      await App.renderProducts()

            
      // Render Tasks
      // await App.renderTasks()
      //window.alert("After Task rendered")    

      // Update loading state
      // App.setLoading(false)

      // await App.testingMethod();
      // await App.sandbox.getArray();

      await App.renderSuppliers();
      await App.getRawProducts();

      // Toggle btns on page:
      await App.toggleShopBtns();
      await App.toggleSupplierBtns();
      await App.toggleManufacturerBtns();

      await App.getSupplierManufacturerProducts();

      await App.getFinishProducts();
      $('#js-current-finish-product').hide();
    },

    showAddProduct: async () => {
      $('#js-add-product-supplier-form').removeClass('d-none');
      $('#js-become-supplier-form').addClass('d-none');
      $('#js-bg-img').addClass('d-none');

      $('#js-add-product-shop-form').removeClass('d-none');
      $('#js-become-shop-form').addClass('d-none');
      $('#js-bg-img').addClass('d-none');
    },

    showAddManufacturerProduct: (param) => {

      $('#js-add-product-manufacturer-form').removeClass('d-none');
      $('#js-become-manufacturer-form').addClass('d-none');
      $('#js-bg-img').addClass('d-none');
      $('#js-product-list-container').fadeOut(500);
      console.log('param: ', param);

      $('#previousProductId').val(param[0]);
      $('#supplierAddress').val(param[1]);
      $('#productName').val(param[2]);
      $('#productType').val(param[3]);
      $('#productImage').val(param[6]);
      $('#productPrice').val(param[7]);
      $('#quantity').val(param[4]);

    },

    addProduct: async () => {

      // Load the total task count from the blockchain
      // const taskCount = await App.todoList.taskcount()

      // const content = $('#newTask').val()
      // await App.todoList.createTask(content, {from: App.account})
      // window.location.reload()



      const productName = $('#productName').val()
      const productType = $('#productType').val()
      const quantity = $('#quantity').val()
      const productImage = $('#productImage').val()
      const productPrice = $('#productPrice').val()
      console.log("product: ", productName, productType, quantity, productImage, productPrice)
      const prod = await App.products.addRawProduct(productName, productType, quantity, productImage, productPrice, {from: App.account})
      console.log("prod: ", prod);
      //window.location.reload()
      await App.getRawProducts();

    },

    addDerivedProduct: async () => {

      const previousProductId = $('#previousProductId').val()
      const supplierAddress = $('#supplierAddress').val()
      const productName = $('#productName').val()
      const productType = $('#productType').val()
      const quantity = $('#quantity').val()
      const productImage = $('#productImage').val()
      const productPrice = $('#productPrice').val()
      console.log("product: ", previousProductId, supplierAddress, productName, productType, quantity, productImage, productPrice)
      const prod = await App.products.addManufacturerProduct(productName, productType, quantity, productImage, productPrice, supplierAddress, previousProductId, {from: App.account})
      console.log("derived prod: ", prod);
      //window.location.reload()
      $('#js-add-product-manufacturer-form').addClass('d-none');
      await App.getRawProducts();
    },

    showAddShopProduct: (param) => {

      $('#js-sm-product-list-container').fadeOut(500);
      $('#js-add-product-shop-form').removeClass('d-none');

      console.log('param: ', param);

      $('#previousProductId').val(param[0]);
      $('#supplierAddress').val(param[1]);
      $('#shopAddress').val(param[9]);
      $('#productName').val(param[2]);
      $('#productType').val(param[3]);
      $('#productImage').val(param[6]);
      $('#productPrice').val(param[7]);
      $('#quantity').val(param[4]);
      $('#productStatus').val(param[5]);
      $('#js-img-product-shop').attr('src', param[6]);

      let manufacturerAddress = param[1];
      const productStatus = param[5];

      console.log("supplierAddress: ", param[1]);
      console.log("manufacturerAddress: ", param[8]);

      manufacturerAddress = productStatus == 'Raw' ? $('#manufacturerAddress').val(manufacturerAddress) : $('#manufacturerAddress').val(param[8]);


    },

    showProductHistory: async (product) => {
      // console.log('product: ', product);
      $('#js-finish-product-list-container').fadeOut(500);
      $('#js-current-finish-product').fadeIn(500);
      $('#js-bg-img').hide();

      product = App.translateProduct(product);
      console.log('after translate product: ', product);

      let productHistory = await App.serializeProductHistory(product.productId);
      console.log('productHistory: ', productHistory);

      let mainBox = $('#js-main-history');
      let supplierBox = $('#js-history-supplier');
      let manufacturerBox = $('#js-history-manufacturer');
      let shopBox = $('#js-history-shop');

      let mainProduct = productHistory[2];
      let supplierProduct = productHistory[0];
      let manufacturerProduct = productHistory[1];
      let shopProduct = productHistory[2];

      mainBox.find('#prodName').html(shopProduct.productName);
      mainBox.find('#prodType').html(shopProduct.productType);
      mainBox.find('#prodPrice').html(shopProduct.price);
      mainBox.find('#prodQuantity').html(shopProduct.quantity);
      mainBox.find('#prodImg').attr('src', shopProduct.productImage);

      supplierBox.find('h5').html(supplierProduct.supplierObj.Name);
      supplierBox.find('.address').html(supplierProduct.supplierObj.Address);
      supplierBox.find('.description').html(supplierProduct.supplierObj.Description);
      supplierBox.find('.timestamp').html(new Date(supplierProduct.timestamp*1000).toLocaleString());
      supplierBox.find('img').attr('src', supplierProduct.productImage);
      supplierBox.find('.productname').html(supplierProduct.productName);

      manufacturerBox.find('h5').html(manufacturerProduct.manufacturerObj.Name);
      manufacturerBox.find('.address').html(manufacturerProduct.manufacturerObj.Address);
      manufacturerBox.find('.description').html(manufacturerProduct.manufacturerObj.Description);
      manufacturerBox.find('.timestamp').html(new Date(manufacturerProduct.timestamp*1000).toLocaleString());
      manufacturerBox.find('img').attr('src', manufacturerProduct.productImage);
      manufacturerBox.find('.productname').html(manufacturerProduct.productName);

      shopBox.find('h5').html(shopProduct.shopObj.Name);
      shopBox.find('.address').html(shopProduct.shopObj.Address);
      shopBox.find('.description').html(shopProduct.shopObj.Description);
      shopBox.find('.timestamp').html(new Date(shopProduct.timestamp*1000).toLocaleString());
      shopBox.find('img').attr('src', shopProduct.productImage);
      shopBox.find('.productname').html(shopProduct.productName);

      let shopBcAdd = shopProduct.shopObj.BCAddress;
      console.log("shop BCAddress: ", shopBcAdd);

      $('.js-btn-buy-prod-from-shop').click(async () => {
        let buyProduct =  await App.products.buyFromShop(product.productId);
        // let buyProduct =  await App.products.buyFromShop(product.productId, shopBcAdd);

        console.log('buyProduct: ', buyProduct);
      });

    },

    addShopProduct: async () => {

      const previousProductId = $('#previousProductId').val()
      const supplierAddress = $('#supplierAddress').val()
      const manufacturerAddress = $('#manufacturerAddress').val()
      const productName = $('#productName').val()
      const productType = $('#productType').val()
      const quantity = $('#quantity').val()
      const productImage = $('#productImage').val()
      const productPrice = $('#productPrice').val()

      // productId, previousSupplier, productName, productType, quantity, 
      // productImage, price, previousProductId, previousManufacturer);
      console.log("product: ", previousProductId, supplierAddress, productName, productType, quantity, productImage, productPrice, manufacturerAddress);
      const prod = await App.products.addFinalProduct(productName, productType, quantity, productImage, productPrice, supplierAddress, previousProductId, manufacturerAddress, {from: App.account})
      console.log("final prod: ", prod);

      $('#js-add-product-shop-form').addClass('d-none');
      await App.getSupplierManufacturerProducts();
      $('#js-sm-product-list-container').fadeIn(500); 
    
    },

    showSupplierRegistration: async () => {
      $('#js-become-supplier-form').removeClass('d-none');
      $('#js-add-product-supplier-form').addClass('d-none');
      $('#js-bg-img').addClass('d-none');
    },

    showManufacturerRegistration: async () => {
      $('#js-become-manufacturer-form').removeClass('d-none');
      $('#js-add-product-manufacturer-form').addClass('d-none');
      $('#js-bg-img').addClass('d-none');
      $('#js-product-list-container').fadeOut(500);
    },

    showShopRegistration: async () => {
      $('#js-become-shop-form').removeClass('d-none');
      $('#js-add-product-shop-form').addClass('d-none');
      $('#js-bg-img').addClass('d-none');
      $('#js-finish-product-list-container').fadeOut(500);
      await App.getFinishProducts();
    },

    toggleShopBtns:  async () => {
      let currentIsShop = await App.shop.isShop();
      console.log('currentIsShop: ', currentIsShop);
      if(currentIsShop){
        $('#js-become-shop').hide();
        await App.getSupplierManufacturerProducts();
        $('#js-finish-product-list-container').hide();
      } else {
        $('#js-add-product-shop').hide();
        $('#js-my-product-shop').hide();
        $('#js-sm-product-list-container').hide()
      }
    },

    toggleSupplierBtns: async () => {
      let currentIsSupplier = await App.supplier.isSupplier();
      console.log('currentIsSupplier: ', currentIsSupplier);
      if (currentIsSupplier) {
        $('#js-become-supplier').hide();
        $('#js-add-product-supplier').show();
      } else {
        $('#js-become-supplier').show();
        $('#js-add-product-supplier').hide();
      }
    },

    toggleManufacturerBtns: async () => {
      let currentIsManufacturer = await App.manufacturer.isManufacturer();
      console.log('currentIsManufacturer: ', currentIsManufacturer);
      if (currentIsManufacturer) {
        $('#js-become-manufacturer').hide();
        $('#js-supplier-product-on-manufacturer').show();
        $('#js-my-manufacturer-product').show();
      } else {
        $('#js-become-manufacturer').show();
        $('#js-supplier-product-on-manufacturer').hide();
        $('#js-my-manufacturer-product').hide();
        $('#js-product-list-container').hide();
      }
    },

    addSupplier: async () => {

      const supplierName = $('#supplierName').val();
      const supplierAddress = $('#supplierAddress').val();
      const supplierDescription = $('#supplierDescription').val();
      console.log("add supplier: ", supplierName, supplierAddress, supplierDescription);
      const suppliers = await App.supplier.addNewSupplier(supplierName, supplierAddress, supplierDescription, {from: App.account})
      console.log("suppliers: ", suppliers);
      $('#js-become-supplier-form').addClass('d-none');
      $('#js-add-product-supplier-form').removeClass('d-none');
      $('input').val('');
      window.location.reload();
    },

    addManufacturer: async () => {
      const manufacturerName = $('#manufacturerName').val();
      const manufacturerAddress = $('#manufacturerAddress').val();
      const manufacturerDescription = $('#manufacturerDescription').val();
      console.log("add manufacturer: ", manufacturerName, manufacturerAddress, manufacturerDescription);
      const manufacturer = await App.manufacturer.addNewManufacturer(manufacturerName, manufacturerAddress, manufacturerDescription);
      console.log("manufacturers: ", manufacturer);
      $('input').val('');
      $('#js-become-manufacturer-form').addClass('d-none');
      App.getRawProducts();
      window.location.reload();
    },

    addShop: async () => {
      const shopName = $('#shopName').val();
      const shopAddress = $('#shopNewAddress').val(); 
      const shopDescription = $('#shopDescription').val();
      console.log("add shop: ", shopName, shopAddress, shopDescription);
      // return;
      const shop = await App.shop.addNewShop(shopName, shopAddress, shopDescription);
      console.log("shops: ", shop);
      $('#js-become-shop-form').addClass('d-none');
      App.toggleShopBtns();
      $('input').val('');
      window.location.reload();
      

    },

    testingMethod: async () => {
      const logger =  await App.supplier.log();
      console.log("logger: ", logger);
    },

    renderProducts: async () => {
      // const products = App.product.products();
      // console.log('Products: ', products)
    },

    renderSuppliers: async () => {
      const idx = await App.supplier.supplierId();
      // console.log("supplier id before convert", idx);
      const id = +idx;
      // console.log("supplier id after convert", id);
      const  supps = [...new Array(id)];
      // console.log(`There are ${id} suppliers`)
      supps.forEach(async (el,idx)=>{
        let supplier_id = idx+1;
        let supplier = await App.supplier.suppliers(supplier_id);
        // console.log(`-> sup${supplier_id}`,supplier)
      })
    },

    getProducts: async () => {
      const idx = await App.products.productCount();
      // console.log("product id before convert", idx);
      const id = +idx;
      // console.log("Product id after convert", id);
      let prods = [...new Array(id)];
      // console.log(`There are ${id} products`)
      let prod_array = [];
      prods = prods.map(async (el,idx)=>{
        let product_id = idx+1;
        let prod = await App.products.products(product_id);
        // console.log("What is the status?", prod[5]);
        // console.log(`-> prod${product_id}`,prod);
        prod_array.push(prod);
        return prod;
      });

      prods = await Promise.all(prods);

      // console.log("prod promise array",prods);
      // console.log("prod array",prod_array);
      return prod_array;
    },

    getRawProducts: async () => {
      let productlist = await App.getProducts();
      // console.log("list before filter",productlist);
      productlist = productlist.filter(x => x[5] == "Raw");
      // console.log("list after filter",productlist);

      // Render raw products on Manufaturer
      const rawProducts = productlist;
      // console.log('rawProducts: ', rawProducts);
      // $('#js-product-list').html(rawProducts);

      $('#js-my-product-list-container').fadeOut(500);
      $('#js-product-list-container').fadeIn(500);

      let map = {
        'prodName': 2,
        'prodType': 3
      };

      $('#js-product-list').find('.rawprod:not(.template)').remove();

      $(rawProducts).each(function() {
        // console.log('this', this);
        let container = $('#js-product-list');
        let tpl = container.find('.template');

        // console.log('rawProducts length: ', rawProducts.length );
        // console.log('number of elements: ', $('.rawprod').length);

        let newRow = tpl.clone();
        let mapKeys = Object.keys(map);
        mapKeys.forEach( k => {
          $(newRow).find(`#${k}`).html(this[map[k]]);
        });
        $(newRow).find('#prodImg').attr('src', this[6]);
        $(newRow).find('#prodPrice').html(+this[7]);
        $(newRow).find('#prodQuantity').html(+this[4]);
        $(newRow).removeClass('template d-none');
        container.append(newRow);

        newRow.find('.js-btn-add-prod').click(() => App.showAddManufacturerProduct(this));
      });

    },

    getMyProducts: async () => {

      let productlist = await App.getProducts();
      // console.log("myproducts before filter",productlist);
      productlist = productlist.filter(x => x[5] == "InProcess");
      // console.log("myproducts after filter", productlist);

      const inProcessProducts = productlist;
      // console.log('inProcessProducts: ', inProcessProducts);

      $('#js-product-list-container').fadeOut(500);
      $('#js-my-product-list-container').fadeIn(500);
      $('#js-add-product-manufacturer-form').addClass('d-none');

      let map = {
        'prodName': 2,
        'prodType': 3
      };

      $('#js-my-product-list').find('.rawprod:not(.template)').remove();

      $(inProcessProducts).each(function() {
        // console.log('this', this);
        let container = $('#js-my-product-list');
        let tpl = container.find('.template');

        let newRow = tpl.clone();
        let mapKeys = Object.keys(map);
        mapKeys.forEach( k => {
          $(newRow).find(`#${k}`).html(this[map[k]]);
        });
        $(newRow).find('#prodImg').attr('src', this[6]);
        $(newRow).find('#prodPrice').html(+this[7]);
        $(newRow).find('#prodQuantity').html(+this[4]);
        $(newRow).removeClass('template d-none');
        container.append(newRow);
      });

    },

    getSupplierManufacturerProducts: async () => {
      let productlist = await App.getProducts();
      productlist = productlist.filter(x => x[5] == "Raw" || x[5] == "InProcess");
      // console.log("get s&m after filter", productlist);

      const smProducts = productlist;

      let map = {
        'prodName': 2,
        'prodType': 3
      };

      $('#js-sm-product-list').find('.rawprod:not(.template)').remove();

      $(smProducts).each(function() {
        // console.log('this', this);
        let container = $('#js-sm-product-list');
        let tpl = container.find('.template');

        container.find('.myprod:not(.template)').remove();

        let newRow = tpl.clone();
        let mapKeys = Object.keys(map);
        mapKeys.forEach( k => {
          $(newRow).find(`#${k}`).html(this[map[k]]);
        });
        $(newRow).find('#prodImg').attr('src', this[6]);
        $(newRow).find('#prodPrice').html(+this[7]);
        $(newRow).find('#prodQuantity').html(+this[4]);
        $(newRow).find('#productStatusBadge').html(this[5]);
        $(newRow).removeClass('template d-none');
        container.append(newRow);

        newRow.find('.js-btn-add-prod-shop').click(() => App.showAddShopProduct(this));
      });

    },

    getFinishProducts: async () => {
      let productlist = await App.getProducts();
      productlist = productlist.filter(x => x[5] == "Finished");
      console.log("get finished after filter", productlist);

      const finishedProducts = productlist;

      let map = {
        'prodName': 2,
        'prodType': 3
      };

      $('#js-finish-product-list').find('.rawprod:not(.template)').remove();

      $(finishedProducts).each(function() {
        // console.log('this', this);
        let container = $('#js-finish-product-list');
        let tpl = container.find('.template');

        container.find('.myprod:not(.template)').remove();

        let newRow = tpl.clone();
        let mapKeys = Object.keys(map);
        mapKeys.forEach( k => {
          $(newRow).find(`#${k}`).html(this[map[k]]);
        });
        $(newRow).find('#prodImg').attr('src', this[6]);
        $(newRow).find('#prodPrice').html(+this[7]);
        $(newRow).find('#prodQuantity').html(+this[4]);
        $(newRow).find('#productStatusBadge').html(this[5]);
        $(newRow).removeClass('template d-none');
        container.append(newRow);

        newRow.find('.js-btn-view-prod-history').click(() => App.showProductHistory(this));

      });

    },
}
$(() => {
  $(window).load(() => {
    App.load();
  })
})
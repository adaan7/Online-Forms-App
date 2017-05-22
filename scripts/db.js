"user strict";

//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
 
//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
 
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

// creating an object with database name, version, instance, store object names and error hanlder functions
var db = {
  name: "FormDB",
  version: 1,
  instance: {},
  storeNames: {
    forms: "forms"
  },
  defaultErrorHandler: function (event) {
    console.log(event);
  },
  setDefaultErrorHandler: function (request) {
    
    if ("onerror" in request) {
      request.onerror = db.defaultErrorHandler;
    }
    
    if ("onblocked" in request) {
      request.onblocked = db.defaultErrorHandler;
    }
  }
};

// function that opens a database
function openDatabase() {
  
  var openRequest = indexedDB.open(db.name, db.version);
  
  openRequest.onupgradeneeded = function (event) {
    var newVersion = event.target.result;
    
    if (!newVersion.objectStoreNames.contains(db.storeNames.forms)) {
      console.log("Creating " + db.storeNames.forms + " store");
      var store = newVersion.createObjectStore(db.storeNames.forms, { autoIncrement: true });
      store.createIndex("formNameFormVersion", "formNameFormVersion", { unique: true });
    }
  };
  
  db.setDefaultErrorHandler(openRequest);
  
  openRequest.onsuccess = function (event) {
    db.instance = event.target.result;
    console.log("The " + db.name + " database opened");
  };
}

// function that insert object provided in database
function insertObjectToDb(formObject, key) {
  
  var transaction = db.instance.transaction([db.storeNames.forms], "readwrite");
  var store = transaction.objectStore(db.storeNames.forms);
  var addRequest = store.put(formObject, key);
  
  db.setDefaultErrorHandler(addRequest);
  
  addRequest.onsuccess = function (event) {
    console.log("Form added");
    console.log("key: " + event.target.result);
  };
}

// function that read object from database and load id to the form
function getObjectFromDb(formNameFormVersion, searchInput) {
  
  var transaction = db.instance.transaction([db.storeNames.forms], "readonly");
  var index = transaction.objectStore(db.storeNames.forms).index("formNameFormVersion");
  var getRequest = index.get(formNameFormVersion);
  var newForm;
  
  db.setDefaultErrorHandler(getRequest);
  
  getRequest.onsuccess = function (event) {
    newForm = event.target.result;
    
    if (countMatchingSearch === 0) {
      if (newForm) {
        var tempRows = newForm.rows;
        
        console.log(newForm);
        
        for (var i = 0; i < tempRows.length; i++) {
          var rowObject = tempRows[i];
          var rowName = rowObject.rowName;
          var value = rowObject.value;
          var isChecked = rowObject.isChecked;
          var selectedOption = rowObject.selectedOption;
          var rowType = rowObject.rowType;
          var numberOfOptions = rowObject.numberOfOptions;
          var arrayOfOption = [];
          var rowValidationType = rowObject.rowValidationType;
        
          for (var j = 0; j < rowObject.arrayOfOption.length; j++) {
            arrayOfOption.push(rowObject.arrayOfOption[j]);
          }
            
          var newRow = new Row(rowName, value, isChecked, selectedOption, rowType, numberOfOptions, arrayOfOption, rowValidationType);
          addRowElements(newRow);
        }
        
        isNewFormLoaded = true;
        countMatchingSearch += 1;
      } else {
        window.alert("Form '" + searchInput + "' does not exist in database.");
      }
    }
    
  };
}
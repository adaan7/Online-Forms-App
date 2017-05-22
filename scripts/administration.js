"use strict";

var admForm = document.getElementById("admForm");
var maxNumberOfElements = 10;
var maxNumberOfRadioOptions = 7;
var minNumberOfRadioOptions = 2;
var countEmptySearch = 0;
var countMatchingSearch = 0;
var countElements = 0;
var countAddButton = 0;
var countSaveButton = 0;
var radioInputFieldNumber = 1;
var radioInputFieldIds = [];
var numberOfRadioOptionsList = [];
var isNewFormLoaded = false;
// for creating default Row object
var emptyArray = [];

function Row (rowName, value, isChecked, selectedOption, rowType, numberOfOptions, arrayOfOption, rowValidationType) {
  this.rowName = rowName;
  this.value = value;
  this.isChecked = isChecked;
  this.selectedOption = selectedOption;
  this.rowType = rowType;
  this.numberOfOptions = numberOfOptions;
  this.arrayOfOption = arrayOfOption;
  this.rowValidationType = rowValidationType;
}

function Form (formName, formVersion, formNameFormVersion, rows) {
  this.formName = formName;
  this.formVersion = formVersion;
  this.formNameFormVersion = formNameFormVersion;
  this.rows = rows;
}

var defaultRowObject = new Row("", "", false, 1, "TextBox", 0, emptyArray, "None");

// create an object template to store radio input field id and number of radio button options
function NumberOfRadioOptions(radioInputFieldId, numberOfOptions) {
  this.radioInputFieldId = radioInputFieldId;
  this.numberOfOptions = numberOfOptions;
}

// function that returns a new string with removed spaces
function formatKeyString(string) {
  
  var newString = "";
  
  for (var i = 0; i < string.length; i++) {
    if (string.charAt(i) !== ' ') {
      newString += string.charAt(i);
    }
  }
  
  return newString;
}

// function that creates a dropdown (select) element with three options and add it to a form
function addDropDown(dropDownId, option1, option2, option3, defaultSelectedType) {
  
  var newSelect = document.createElement("select");
  newSelect.setAttribute("id", dropDownId);
  newSelect.setAttribute("name", dropDownId);
  
  var newOption1 = document.createElement("option");
  var newOption2 = document.createElement("option");
  var newOption3 = document.createElement("option");
  
  var option1Text = document.createTextNode(option1);
  var option2Text = document.createTextNode(option2);
  var option3Text = document.createTextNode(option3);
  
  newOption1.appendChild(option1Text);
  newOption2.appendChild(option2Text);
  newOption3.appendChild(option3Text);
  
  newOption1.setAttribute("value", option1);
  newOption2.setAttribute("value", option2);
  newOption3.setAttribute("value", option3);
  
  if (defaultSelectedType === option1) {
    newOption1.selected = true;
  } else if (defaultSelectedType === option2) {
    newOption2.selected = true;
  } else if (defaultSelectedType === option3) {
    newOption3.selected = true;
  }
  
  newSelect.appendChild(newOption1);
  newSelect.appendChild(newOption2);
  newSelect.appendChild(newOption3);
  
  admForm.appendChild(newSelect);
}

// function that creates a button for adding new fields and add it to a form
function addAddButton() {
  
  var newLine = document.createElement("br");
  var newButton = document.createElement("button");
  
  var buttonText = document.createTextNode("Add");
  
  newLine.setAttribute("id", "lineBreakAddBtn");
  newButton.setAttribute("name", "add");
  newButton.setAttribute("type", "button");
  newButton.setAttribute("id", "admAddButton");
  
  newButton.appendChild(buttonText);
  admForm.appendChild(newButton);
  admForm.appendChild(newLine);
  
  countAddButton += 1;
}

// function that creates a button for saving a form and add it to a form
function addSaveButton() {
  
  var newLine = document.createElement("br");
  var newButton = document.createElement("button");
  
  var buttonText = document.createTextNode("Save");
  
  newButton.setAttribute("name", "save");
  newButton.setAttribute("type", "button");
  newButton.setAttribute("id", "admSaveButton");
  
  newButton.appendChild(buttonText);
  
  admForm.appendChild(newLine);
  admForm.appendChild(newButton);
  
  countSaveButton += 1;
}

// function that delete radio button option fields
function deleteRadioButtonOptions(currentElement) {
  
  var countNumberOfRadioOptions = 0;
  var radioIdNumber = currentElement.getAttribute("id").substring(16);
  
  for (var i = 0; i < numberOfRadioOptionsList.length; i++) {
    if (currentElement.getAttribute("id") === numberOfRadioOptionsList[i].radioInputFieldId) {
      countNumberOfRadioOptions = numberOfRadioOptionsList[i].numberOfOptions;
      numberOfRadioOptionsList.splice(i, 1);
      break;
    }
  }
  
  for (var i = 0; i < countNumberOfRadioOptions; i++) {
    var line1 = document.getElementById("line1Radio" + radioIdNumber + "Option" + (i + 1));
    var line2 = document.getElementById("line2Radio" + radioIdNumber + "Option" + (i + 1));
    var labelWithRadioOption = document.getElementById("labelRadio" + radioIdNumber + "Option" + (i + 1));
    var inputRadioOption = document.getElementById("inputRadio" + radioIdNumber + "Option" + (i + 1));
    
    admForm.removeChild(line1);
    admForm.removeChild(line2);
    admForm.removeChild(labelWithRadioOption);
    admForm.removeChild(inputRadioOption);
  }
}

// function that add radio input field and options on form load
function addRadioInputFieldAndOptions(fieldTypeChooser, numberOfOptions, arrayOfOptions) {
      
  // if radio button is selected, add new input field for number of options
  var newInputRadioNumber = document.createElement("input");
  
  // setting attributes of new input field
  newInputRadioNumber.setAttribute("type", "number");
  newInputRadioNumber.setAttribute("id", "inputRadioNumber" + radioInputFieldNumber);
  newInputRadioNumber.setAttribute("min", minNumberOfRadioOptions);
  newInputRadioNumber.setAttribute("max", maxNumberOfRadioOptions);
  newInputRadioNumber.setAttribute("value", numberOfOptions);
  newInputRadioNumber.setAttribute("class", "onlyNumericField mandatoryField");
  newInputRadioNumber.required = true;
  newInputRadioNumber.style.width = "100px";
  
  admForm.insertBefore(newInputRadioNumber, fieldTypeChooser.nextSibling);
  
  radioInputFieldIds.push("inputRadioNumber" + radioInputFieldNumber);
      
  var inputRadioNumber = document.getElementById(fieldTypeChooser.nextSibling.getAttribute("id"));
  var radioIdNumber = inputRadioNumber.getAttribute("id").substring(16);
  
  // remove all options if exists
  deleteRadioButtonOptions(inputRadioNumber);
  
  if (numberOfOptions > maxNumberOfRadioOptions) {
    numberOfOptions = maxNumberOfRadioOptions;
  } else if (numberOfOptions < minNumberOfRadioOptions) {
    numberOfOptions = minNumberOfRadioOptions;
  }
  
  // add new options
  for (var i = numberOfOptions - 1; i >= 0; i--) {
    var newLine1 = document.createElement("br");
    var newLine2 = document.createElement("br");
    var newLabel = document.createElement("label");
    var newInput = document.createElement("input");
    
    var labelText = document.createTextNode("Option" + (i + 1) + " ");
    
    newLine1.setAttribute("id", "line1Radio" + radioIdNumber + "Option" + (i + 1));
    newLine2.setAttribute("id", "line2Radio" + radioIdNumber + "Option" + (i + 1));
    newLabel.setAttribute("id", "labelRadio" + radioIdNumber + "Option" + (i + 1));
    newInput.setAttribute("id", "inputRadio" + radioIdNumber + "Option" + (i + 1));
    newInput.setAttribute("class", "mandatoryField text-input-field");
    newInput.setAttribute("value", arrayOfOptions[i]);
    newInput.setAttribute("type", "text");
    newInput.setAttribute("maxlength", 30);
    newInput.required = true;
    
    newLabel.appendChild(labelText);
    
    var endLineSpan = document.getElementById(inputRadioNumber.nextSibling.nextSibling.getAttribute("id"));
    
    admForm.insertBefore(newLine1, endLineSpan);
    admForm.insertBefore(newLine2, endLineSpan);
    admForm.insertBefore(newLabel, endLineSpan);
    admForm.insertBefore(newInput, endLineSpan);
  }
  
  var numberOfRadioOptions = new NumberOfRadioOptions(inputRadioNumber.getAttribute("id"), numberOfOptions);
  numberOfRadioOptionsList.push(numberOfRadioOptions);
  
  radioInputFieldNumber += 1;
}

// function that creates radio box options and add it to a form
function addRadioButtonOptions(numberOfOptions, currentElement) {
  var radioIdNumber = currentElement.getAttribute("id").substring(16);
  
  // first remove all options if exists
  deleteRadioButtonOptions(currentElement);
  
  if (numberOfOptions > maxNumberOfRadioOptions) {
    numberOfOptions = maxNumberOfRadioOptions;
  } else if (numberOfOptions < minNumberOfRadioOptions) {
    numberOfOptions = minNumberOfRadioOptions;
  }
  
  // add new options
  for (var i = numberOfOptions - 1; i >= 0; i--) {
    var newLine1 = document.createElement("br");
    var newLine2 = document.createElement("br");
    var newLabel = document.createElement("label");
    var newInput = document.createElement("input");
    
    var labelText = document.createTextNode("Option" + (i + 1) + " ");
    
    newLine1.setAttribute("id", "line1Radio" + radioIdNumber + "Option" + (i + 1));
    newLine2.setAttribute("id", "line2Radio" + radioIdNumber + "Option" + (i + 1));
    newLabel.setAttribute("id", "labelRadio" + radioIdNumber + "Option" + (i + 1));
    newInput.setAttribute("id", "inputRadio" + radioIdNumber + "Option" + (i + 1));
    newInput.setAttribute("class", "mandatoryField text-input-field");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("maxlength", 30);
    newInput.required = true;
    
    newLabel.appendChild(labelText);
    
    var endLineSpan = document.getElementById(currentElement.nextSibling.nextSibling.getAttribute("id"));
    
    admForm.insertBefore(newLine1, endLineSpan);
    admForm.insertBefore(newLine2, endLineSpan);
    admForm.insertBefore(newLabel, endLineSpan);
    admForm.insertBefore(newInput, endLineSpan);
  }
  
  var numberOfRadioOptions = new NumberOfRadioOptions(currentElement.getAttribute("id"), numberOfOptions);
  numberOfRadioOptionsList.push(numberOfRadioOptions);
}

// function that add or remove radio input field depending on selected row type
function performOperationOnSelectedType(fieldTypeChooser) {
  
  fieldTypeChooser.onchange = function () {
    var selectedValue = this.options[this.selectedIndex].value;
    
    if (selectedValue === "RadioButton") {
      // if radio button is selected, add new input field for number of options
      var newInputRadioNumber = document.createElement("input");
      
      newInputRadioNumber.setAttribute("type", "number");
      newInputRadioNumber.setAttribute("id", "inputRadioNumber" + radioInputFieldNumber);
      newInputRadioNumber.setAttribute("min", minNumberOfRadioOptions);
      newInputRadioNumber.setAttribute("max", maxNumberOfRadioOptions);
      newInputRadioNumber.setAttribute("class", "onlyNumericField mandatoryField");
      newInputRadioNumber.required = true;
      newInputRadioNumber.style.width = "100px";
      
      admForm.insertBefore(newInputRadioNumber, this.nextSibling);
      
      radioInputFieldIds.push("inputRadioNumber" + radioInputFieldNumber);
      
      var inputRadioNumber = document.getElementById(this.nextSibling.getAttribute("id"));
      
      inputRadioNumber.onchange = function () {
        addRadioButtonOptions(parseInt(inputRadioNumber.value), this);
      };
      
      // increase radio input field number every time after creating input field for unique id
      radioInputFieldNumber += 1;
    } else if (selectedValue === "TextBox") {
      // if text box is selected and radio box input field exist, remove radio box input field
      var inputRadioNumber = document.getElementById(this.nextSibling.getAttribute("id"));
      
      for (var i = 0; i < radioInputFieldIds.length; i++) {
        if (radioInputFieldIds[i] === inputRadioNumber.getAttribute("id")) {
          admForm.removeChild(inputRadioNumber);
          deleteRadioButtonOptions(inputRadioNumber);
          radioInputFieldIds.splice(i, 1);
          break;
        }
      }
    } else if (selectedValue === "CheckBox") {
      // if check box is selected and radio box input field exist, remove radio box input field
      var inputRadioNumber = document.getElementById(this.nextSibling.getAttribute("id"));
      
      for (var i = 0; i < radioInputFieldIds.length; i++) {
        if (radioInputFieldIds[i] === inputRadioNumber.getAttribute("id")) {
          admForm.removeChild(inputRadioNumber);
          deleteRadioButtonOptions(inputRadioNumber);
          radioInputFieldIds.splice(i, 1);
          break;
        }
      }
    }
  };
}

// function that create and add new row of elements to a form
function addRowElements(rowObject) {
  
  var newLine = document.createElement("br");
  var newLabel = document.createElement("label");
  var newInput = document.createElement("input");
  var newSpan = document.createElement("span");
  
  var labelText = document.createTextNode("Element" + (countElements + 1) + " ");
  
  newInput.setAttribute("type", "text");
  newInput.setAttribute("class", "text-input-field mandatoryField");
  newInput.setAttribute("id", "input" + (countElements + 1));
  newInput.setAttribute("maxlength", 30);
  newInput.setAttribute("value", rowObject.rowName);
  newInput.required = true;
  newSpan.setAttribute("id", "endLineSpan" + (countElements + 1));
  newSpan.style.display = "inline-block";
  
  newLabel.appendChild(labelText);
  
  var lineBreak = document.getElementById("lineBreakAddBtn");
  var addButton = document.getElementById("admAddButton");
  var saveButton = document.getElementById("admSaveButton");
  
  if (countAddButton !== 0) {
    // removing add button and line break if they exist before adding a new row of form fields
    admForm.removeChild(addButton);
    admForm.removeChild(lineBreak);
    countAddButton = 0;
  }
  if (countSaveButton !== 0) {
    // removing save button if it exist before adding a new row of form fields
    admForm.removeChild(saveButton);
    countAddButton = 0;
  }
  
  // adding elements to a form
  admForm.appendChild(newLine);
  admForm.appendChild(newLabel);
  admForm.appendChild(newInput);
  addDropDown("fieldTypeChooser" + (countElements + 1), "TextBox", "CheckBox", "RadioButton", rowObject.rowType);
  addDropDown("fieldValidationChooser" + (countElements + 1), "None", "Mandatory", "Numeric", rowObject.rowValidationType);
  admForm.appendChild(newSpan);
  addAddButton();
  addSaveButton();
  
  var fieldTypeChooser = document.getElementById("fieldTypeChooser" + (countElements + 1));
  
  if (rowObject.rowType === "RadioButton") {
    addRadioInputFieldAndOptions(fieldTypeChooser, rowObject.numberOfOptions, rowObject.arrayOfOption);
  }
  
  // adding or deleting input fields while field type changed
  performOperationOnSelectedType(fieldTypeChooser);
  
  // increase element count by one
  countElements += 1;

  if (countAddButton !== 0) {
    // check if add button exist
    var createdAddButton = document.getElementById("admAddButton");
    if (countElements < maxNumberOfElements) {
      // limit number of new rows
      createdAddButton.onclick = function () {
        // add new row of fields in a form when add button is clicked
        if (isNewFormLoaded) {
          addRowElements(defaultRowObject);
        } else {
          addRowElements(rowObject);
        }
      };
    } else {
      window.alert("Maximum number of elements is " + maxNumberOfElements);
    }
  }
  
  saveAdmForm();
}

// function that search for form by input value or add default row if input field is empty
function searchForAdmForm() {
  
  var admSearchInput = document.getElementById("admSearchInput");
  var admSearchButton = document.getElementById("admSearchButton");

  admSearchButton.onclick = function () {
    if (admSearchInput.value === '' && countEmptySearch === 0) {
      // when search button is clicked, add one row of empty form fields if search input field is empty
      addRowElements(defaultRowObject);
      countEmptySearch += 1;
      isNewFormLoaded = true;
    } else {
      // load form if input value match the form name in database
      var formNameFormVersion = formatKeyString("" + admSearchInput.value + 0);
      
      getObjectFromDb(formNameFormVersion, admSearchInput.value);
    }
  };
}

// function that returns array of Row objects
function getRows() {
  
  var rows = [];
  
  for (var i = 0; i < countElements; i++) {
    var rowName = document.getElementById("input" + (i + 1)).value;
    var fieldTypeChooser = document.getElementById("fieldTypeChooser" + (i + 1));
    var rowType = fieldTypeChooser.options[fieldTypeChooser.selectedIndex].value;
    var numberOfOptions = 0;
    var arrayOfOptions = [];
    var fieldValidationChooser = document.getElementById("fieldValidationChooser" + (i + 1));
    var rowValidationType = fieldValidationChooser.options[fieldValidationChooser.selectedIndex].value;
    
    if (rowType === "RadioButton") {
      var radioInputField = document.getElementById(fieldTypeChooser.nextSibling.getAttribute("id"));
      var radioIdNumber = radioInputField.getAttribute("id").substring(16);
      numberOfOptions = radioInputField.value;
      
      for (var j = 0; j < numberOfOptions; j++) {
        var option = document.getElementById("inputRadio" + radioIdNumber + "Option" + (j + 1)).value;
        
        arrayOfOptions.push(option);
      }
    }
    
    var newRow = new Row(rowName, "", false, 1, rowType, numberOfOptions, arrayOfOptions, rowValidationType);
    rows.push(newRow);
  }
  
  return rows;
}

// function that returns true if the field is filled or checked
function validateMandatoryField() {
  
  var numberOfElementsInForm = admForm.childElementCount;
  
  for (var i = 0; i < numberOfElementsInForm; i++) {
    var mandatoryField = document.getElementsByClassName("mandatoryField")[i];
    
    if (mandatoryField !== undefined) {
      if (mandatoryField.getAttribute("type") === "text") {
        if (mandatoryField.value === '') {
          window.alert("All fields must be filled.");
          return false;
        }
      }
    }
  }
  
  return true;
}

// function that deletes all added elements from the form
function deleteAllElements() {
  
  var numberOfElementsInForm = admForm.childElementCount;
  
  // start from 4 becouse first 4 elements was not added
  for (var i = 4; i < numberOfElementsInForm; i++) {
    admForm.removeChild(admForm.lastChild);
  }
  
  // reset all global counter variables
  countEmptySearch = 0;
  countMatchingSearch = 0;
  countElements = 0;
  countAddButton = 0;
  countSaveButton = 0;
  radioInputFieldNumber = 1;
  radioInputFieldIds = [];
  numberOfRadioOptionsList = [];
  isNewFormLoaded = false;
}

// function that saves the form in Form object
function saveAdmForm() {
  
  var formName = document.getElementById("admSearchInput");
  var formVersion = 0;
  var saveButton = document.getElementById("admSaveButton");
  var rows = [];
  var isSubmitted = true;
  
  saveButton.onclick = function () {
    
    if (formName.value === '') {
      window.alert("You have to provide name of the form in the search field to save the form!");
      isSubmitted = false;
    } else {
      if (!validateMandatoryField()) {
        isSubmitted = false;
      } else {
        rows = getRows();
        isSubmitted = true;
      }
    }
    
    if (isSubmitted) {
      var formNameFormVersion = formatKeyString("" + formName.value + formVersion);
      var newForm = new Form(formName.value, formVersion, formNameFormVersion, rows);
      // calling a function to delete all elements from the form
      deleteAllElements();
      // clear all form fields;
      admForm.reset();
      // calling a function to insert form object to database;
      insertObjectToDb(newForm, formNameFormVersion);
      window.alert("The form is saved!");
    }
  }; 
}

window.onload = function () {
  openDatabase();
  searchForAdmForm();
};
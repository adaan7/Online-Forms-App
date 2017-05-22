"use strict";

var frmForm = document.getElementById("frmForm");
var countRows = 0;
var countSaveButton = 0;
var countMatchingSearch = 0;
// for creating default Row object
var emptyArray = [];

function Row(rowName, value, isChecked, selectedOption, rowType, numberOfOptions, arrayOfOption, rowValidationType) {
  this.rowName = rowName;
  this.value = value;
  this.isChecked = isChecked;
  this.selectedOption = selectedOption;
  this.rowType = rowType;
  this.numberOfOptions = numberOfOptions;
  this.arrayOfOption = arrayOfOption;
  this.rowValidationType = rowValidationType;
}

function Form(formName, formVersion, formNameFormVersion, rows) {
  this.formName = formName;
  this.formVersion = formVersion;
  this.formNameFormVersion = formNameFormVersion;
  this.rows = rows;
}

// function that returns a new string with only lowercase letters
function formatString(string) {
  
  var newString = "";
  
  for (var i = 0; i < string.length; i++) {
    if (string.charAt(i) !== ' ') {
      newString += string.charAt(i);
    }
  }
  
  return newString.toLowerCase();
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

// function that creates a button for saving a form and add it to a form
function addSaveButton() {
  
  var newLine = document.createElement("br");
  var newButton = document.createElement("button");
  
  var buttonText = document.createTextNode("Save");
  
  newLine.setAttribute("id", "lineWithSaveButton");
  newButton.setAttribute("name", "save");
  newButton.setAttribute("type", "button");
  newButton.setAttribute("id", "frmSaveButton");
  
  newButton.appendChild(buttonText);
  
  frmForm.appendChild(newLine);
  frmForm.appendChild(newButton);
  
  countSaveButton += 1;
}

// function that creates a radio button row
function createRadioButtonRow(rowObject) {
  
  var numberOfOptions = rowObject.numberOfOptions;
  var options = rowObject.arrayOfOption;
  var newLine = document.createElement("br");
  var newLabel = document.createElement("label");
  var newRadioDiv = document.createElement("div");
  var newLabelText = document.createTextNode(rowObject.rowName);
  
  newLabel.setAttribute("id", "rowLabel" + (countRows + 1));
  newRadioDiv.setAttribute("id", "radioDiv" + (countRows + 1));
  newLabel.appendChild(newLabelText);
  
  frmForm.appendChild(newLine);
  newRadioDiv.appendChild(newLabel);
  
  for (var i = 0; i < numberOfOptions; i++) {
    
    var newRadioOptionInput = document.createElement("input");
    var newRadioOptionLabel = document.createElement("label");
    var newRadioOptionLabelText = document.createTextNode(" " + options[i]);
    
    newRadioOptionLabel.setAttribute("id", "radio" + (countRows + 1) + "OptionLabel" + (i + 1));
    newRadioOptionInput.setAttribute("value", options[i]);
    newRadioOptionInput.setAttribute("name", formatString(rowObject.rowName) + (countRows + 1));
    newRadioOptionInput.setAttribute("type", "radio");
    newRadioOptionInput.setAttribute("id", "radio" + (countRows + 1) + "OptionInput" + (i + 1));
    
    if (rowObject.selectedOption === (i + 1)) {
      newRadioOptionInput.checked = true;
    }
    
    newRadioOptionLabel.appendChild(newRadioOptionLabelText);
    newRadioDiv.appendChild(newLine.cloneNode(true));
    newRadioDiv.appendChild(newRadioOptionInput);
    newRadioDiv.appendChild(newRadioOptionLabel);
  }
  
  frmForm.appendChild(newRadioDiv);
}

// function that creates a check box row
function createCheckBoxRow(rowObject) {
  
  var newLine = document.createElement("br");
  var newCheckBoxInput = document.createElement("input");
  var newLabel = document.createElement("label");
  
  var labelText = document.createTextNode(rowObject.rowName + " ");
  
  newLabel.setAttribute("id", "rowLabel" + (countRows + 1));
  newCheckBoxInput.setAttribute("id", "inputField" + (countRows + 1));
  newCheckBoxInput.setAttribute("type", "checkbox");
  newCheckBoxInput.checked = rowObject.isChecked;
  
  if (rowObject.rowValidationType === "Mandatory") {
    newCheckBoxInput.setAttribute("class", "mandatoryField");
  }
  
  newLabel.appendChild(labelText);
  
  frmForm.appendChild(newLine);
  frmForm.appendChild(newLabel);
  frmForm.appendChild(newCheckBoxInput);
  frmForm.appendChild(newLine.cloneNode(true));
}

// function that creates a text box row
function createTextBoxRow(rowObject) {
  
  var newLine = document.createElement("br");
  var newLabel = document.createElement("label");
  var newInputField = document.createElement("input");
  
  var labelText = document.createTextNode(rowObject.rowName + " ");
  
  newLabel.setAttribute("id", "rowLabel" + (countRows + 1));
  newInputField.setAttribute("id", "inputField" + (countRows + 1));
  newInputField.setAttribute("maxlength", "50");
  newInputField.setAttribute("type", "text");
  newInputField.setAttribute("value", rowObject.value);
  
  if (rowObject.rowValidationType === "Mandatory") {
    newInputField.setAttribute("class", "mandatoryField");
  } else if (rowObject.rowValidationType === "Numeric") {
    newInputField.setAttribute("class", "numericField");
  }
  
  newLabel.appendChild(labelText);
  
  frmForm.appendChild(newLine);
  frmForm.appendChild(newLabel);
  frmForm.appendChild(newInputField);
  frmForm.appendChild(newLine.cloneNode(true));
}

// function that add row to form depending on row type
function addRowElements(rowObject) {
  
  var lineWithSaveButton = document.getElementById("lineWithSaveButton");
  var saveButton = document.getElementById("frmSaveButton");
  
  if (countSaveButton !== 0) {
    frmForm.removeChild(lineWithSaveButton);
    frmForm.removeChild(saveButton);
    countSaveButton = 0;
  }
  
  if (rowObject.rowType === "TextBox") {
    createTextBoxRow(rowObject);
  } else if (rowObject.rowType === "CheckBox") {
    createCheckBoxRow(rowObject);
  } else if (rowObject.rowType === "RadioButton") {
    createRadioButtonRow(rowObject);
  }
  
  // calling a function that creates save button and add it to a form
  addSaveButton();
  // calling a function that save the form on submit
  saveFrmForm();
  
  countRows += 1;
}

// function that search for a form when search button is clicked
function searchForFrmForm() {
  
  var frmSearchInput = document.getElementById("frmSearchInput");
  var frmSearchButton = document.getElementById("frmSearchButton");
  
  frmSearchButton.onclick = function () {
    
    var frmVersionInput = document.getElementById("frmVersionInput");
    
    if (frmSearchInput.value === '') {
      window.alert("You have to provide name of the form in the search field!");
    } else {
      var formNameFormVersion;
      
      if (frmVersionInput.value.trim() === '') {
        formNameFormVersion = formatKeyString("" + frmSearchInput.value + 0);
      } else {
        frmVersionInput = document.getElementById("frmVersionInput").value;
        formNameFormVersion = formatKeyString("" + frmSearchInput.value + frmVersionInput);
      }
      
      getObjectFromDb(formNameFormVersion, frmSearchInput.value);
    }
  };
}

// function that return true if the string has only numeric values or '+' sign
function checkNumericString(string) {
  
  for (var i = 0; i < string.length; i++) {
    if (!(string.charAt(i) === '+' || (string.charAt(i) >= 48 || string.charAt(i) <= 57))) {
      return false;
    }
  }
  
  return true;
}

// function that returns true if the field contains only numeric characters or '+' sign
function validateNumericField() {
  
  var numberOfElementsInForm = frmForm.childElementCount;
  
  for (var i = 0; i < numberOfElementsInForm; i++) {
    var numericField = document.getElementsByClassName("numericField")[i];
    
    
    if (numericField !== undefined) {
      var rowName = numericField.previousSibling.textContent;
      
      if (!checkNumericString(numericField.value)) {
        window.alert(rowName + " must be a number.");
        return false;
      }
    }
  }
  
  return true;
}

// function that returns true if the field is filled or checked
function validateMandatoryField() {
  
  var numberOfElementsInForm = frmForm.childElementCount;
  
  for (var i = 0; i < numberOfElementsInForm; i++) {
    var mandatoryField = document.getElementsByClassName("mandatoryField")[i];
    
    if (mandatoryField !== undefined) {
      var rowName = mandatoryField.previousSibling.textContent;
      
      if (mandatoryField.getAttribute("type") === "text") {
        if (mandatoryField.value === '') {
          window.alert(rowName + " must be filled.");
          return false;
        }
      } else if (mandatoryField.getAttribute("type") === "checkbox") {
        if (mandatoryField.checked === false) {
          window.alert(rowName + " must be checked.");
          return false;
        }
      }
    }
  }
  
  return true;
}

// function that deletes all added elements from the form
function deleteAllElements() {
  
  var numberOfElementsInForm = frmForm.childElementCount;
  
  // start from 10 becouse first 10 elements was not added
  for (var i = 10; i < numberOfElementsInForm; i++) {
    frmForm.removeChild(frmForm.lastChild);
  }
  
  // reset all global counter variables
  countRows = 0;
  countSaveButton = 0;
  countMatchingSearch = 0;
}

// function that returns row type as a string
function getRowType(inputField, radioDiv) {
  var rowType = "";
  
  if (inputField !== null) {
    if (inputField.getAttribute("type") === "text") {
      rowType = "TextBox";
    } else if (inputField.getAttribute("type") === "checkbox") {
      rowType = "CheckBox";
    }
  }
          
  if (radioDiv !== null) {
    rowType = "RadioButton";
  }
  
  return rowType;
}

// function that returns array of Row objects
function getRows() {
  
  var rows = [];
  
  for (var i = 0; i < countRows; i++) {
    var rowName = document.getElementById("rowLabel" + (i + 1)).textContent;
    var inputField = document.getElementById("inputField" + (i + 1));
    var radioDiv = document.getElementById("radioDiv" + (i + 1));
    var rowType = getRowType(inputField, radioDiv);
    var value = "";
    var isChecked = false;
    var selectedOption = 1;
    var numberOfOptions = 0;
    var arrayOfOption = [];
    var rowValidationType = "None";
          
    if (radioDiv !== null) {
      numberOfOptions = (radioDiv.childElementCount - 4) / 2;
    }
          
    if (rowType === "TextBox") {
      value = inputField.value;
            
      if (inputField.required === true) {
        rowValidationType = "Mandatory";
      } else if (inputField.getAttribute("name") === "inputFieldNumeric" + (i + 1)) {
        rowValidationType = "Numeric";
      }
    } else if (rowType === "CheckBox") {
      isChecked = inputField.checked;
            
      if (inputField.required === true) {
        rowValidationType = "Mandatory";
      }
    } else if (rowType === "RadioButton") {
      for (var j = 0; j < numberOfOptions; j++) {
        var radioOption = document.getElementById("radio" + (i + 1) + "OptionInput" + (j + 1));
        var radioOptionLabel = document.getElementById("radio" + (i + 1) + "OptionLabel" + (j + 1));
        
        if (radioOption.checked) {
          selectedOption = (j + 1);
        }
        if (radioOption.required === true) {
          rowValidationType = "Mandatory";
        }
        
        arrayOfOption.push(radioOptionLabel.textContent);
      }
    }
          
    var newRow = new Row(rowName, value, isChecked, selectedOption, rowType, numberOfOptions, arrayOfOption, rowValidationType);
    rows.push(newRow);
  }
  
  return rows;
}

// function that saves the form in Form object
function saveFrmForm() {
  
  var formName = document.getElementById("frmSearchInput");
  var formVersion = document.getElementById("frmVersionInput");
  var saveButton = document.getElementById("frmSaveButton");
  var rows = [];
  var isSubmitted = true;
  
  saveButton.onclick = function () {
    
    if (formName.value === '') {
      window.alert("You have to provide name of the form in the search field to save the form!");
      isSubmitted = false;
    } else {
      if (formVersion.value === '') {
        window.alert("What version?");
        isSubmitted = false;
      } else {
        if (!validateNumericField()) {
          isSubmitted = false;
        } else if (!validateMandatoryField()) {
          isSubmitted = false;
        } else {
          rows = getRows();
          isSubmitted = true; 
        }  
      }
    }
    
    if (isSubmitted) {
      var formNameFormVersion = formatKeyString("" + formName.value + formVersion.value);
      var newForm = new Form(formName.value, formVersion.value, formNameFormVersion, rows);
      // calling a function to delete all elements from the form
      deleteAllElements();
      // clear all form fields
      frmForm.reset();
      // calling a function to insert form object to database
      insertObjectToDb(newForm, formNameFormVersion);
      window.alert("The form is saved.");
    }
  };
}

window.onload = function () {
  openDatabase();
  searchForFrmForm();
};
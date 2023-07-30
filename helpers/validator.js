// Validator function for task creation and updates
function validateTask(task) {
    const { title, description, completed, createdAt, lastModified } = task;
  
    // Check if title and description are not empty strings
    if (
      typeof title !== "string" ||
      title.trim() === "" ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      console.log(" wrong task title and description");
      return false;
    }
  
    // Check if completed is a boolean value
    if (typeof completed !== "boolean") {
      return false;
    }
  
    // Check if createdAt and lastModified are valid timestamps
    if (
      typeof createdAt !== "number" ||
      isNaN(createdAt) ||
      typeof lastModified !== "number" ||
      isNaN(lastModified) ||
      createdAt > lastModified
    ) {
      console.log("wrong dateTime");
      return false;
    }
  
    // If all validations pass, return true (indicating the input is valid)
    return true;
  }

  module.exports = validateTask
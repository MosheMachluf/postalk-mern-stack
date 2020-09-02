import moment from "moment";

export const uploadsUrl =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:4000/";

export const swal = {
  delete(isDelete) {
    return {
      title: `Are you sure you want to delete this ${isDelete || ""}?`,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
    };
  },

  update(title) {
    return {
      title: title || "Successfully updated!",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    };
  },

  error(text) {
    return {
      title: "Error!",
      text,
      icon: "error",
    };
  },

  openImage(image, alt) {
    return {
      imageUrl: `${
        uploadsUrl + image ||
        "https://www.publicdomainpictures.net/pictures/280000/nahled/not-found-image-15383864787lu.jpg"
      }`,
      imageAlt: alt,
      width: "auto",
      height: "auto",
      padding: "0",
      background: "#000",
      showCloseButton: true,
      showConfirmButton: false,
    };
  },
};

export const fullName = (user) => `${user.firstName} ${user.lastName}`;

export const dateFormat = (date) => moment(date).calendar();

export const inputFileLabel = (files) => {
  let allfiles = "";
  for (let file of files) allfiles += `${file.name},`;

  return allfiles || "Choose file (Up to 2 MB, jpeg / jpg / png / gif)";
};

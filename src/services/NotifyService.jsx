import Notify from "simple-notify";

export function pushNotify(status, title, text) {
    new Notify({
        status: status,
        title: title,
        text: text,
        effect: "slide",
        speed: 300,
        customClass: null,
        customIcon: null,
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 5000,
        gap: 20,
        distance: 20,
        type: 1,
        position: "right top",
    });
}
import $ from "jquery";

window.onload = function () {
  // <------ Button scroll-up START ------>
  $("a").on("click", function (e) {
    let href = $(this).attr("href");

    if (href.startsWith("#") && (href !== "#") & (href !== "##")) {
      $("html, body").animate(
        {
          scrollTop: $(href).offset().top - 55,
        },
        {
          duration: 600,
          easing: "linear",
        }
      );

      return false;
    }
  });

  $(window).scroll(function () {
    toggleBtnUp();
  });
  toggleBtnUp();

  function toggleBtnUp() {
    let btnUp = $(".button-up");
    if ($(window).scrollTop() > 0) {
      btnUp.addClass("show");
    } else {
      btnUp.removeClass("show");
    }
  }
};

// <------ Button scroll-up END ------>

// <------ Goods select START ------>
let select = $(".select");
select.on("click", function () {
  let selectBody = $(this).find(".select__body");
  if (!selectBody.hasClass("active")) {
    select.find(".select__body").removeClass("active");
    selectBody.addClass("active");
  } else {
    selectBody.removeClass("active");
  }
});

$(".select__item").on("click", function () {
  let text = $(this).children("span").text();
  let parent = $(this).parents(".select").children(".select__header");

  parent.children("span").text(text);
});

let container = $(".select__header");
$(document).mouseup(function (e) {
  let select = $(".select__body");
  if (
    container.has(e.target).length === 0 &&
    select.has(e.target).length === 0
  ) {
    select.removeClass("active");
  }
});
// <------ Goods select END ------>

$(".checkmark__container").on("click", function () {
  if (!$(this).hasClass("active")) {
    $(".checkmark__container").removeClass("active");
    $(this).addClass("active");
  }
});

$(".button").on("click", function () {
  openPopup(0);
});

function openPopup(id) {
  bodyLock();
  // $(".js-popup[data-id-popup='" + id + "']").fadeIn(300);
  $(`.js-popup[data-id-popup="${id}"]`).fadeIn(300);
}

function closePopup() {
  bodyUnlock();
  $(".js-popup").fadeOut(300);
}

$(".js-popup__close").click(closePopup);

$(".js-btn-popup").click(function (e) {
  e.preventDefault();
  let index_btn_popup = $(this).attr("href");
  openPopup(index_btn_popup);
});

$(".js-popup").click(function (e) {
  let popup = $(".js-popup__wrap");
  if (!popup.is(e.target) && popup.has(e.target).length === 0) {
    closePopup();
  }
});

let unlock = true;
const timeout = 200;
const body = document.querySelector("body");
const lockPadding = document.querySelectorAll(".lock-padding");

function bodyLock() {
  const lockPaddingValue =
    window.innerWidth - document.querySelector("body").offsetWidth + "px";
  if (lockPadding.length > 0) {
    for (let i = 0; i < lockPadding.length; i++) {
      const el = lockPadding[i];
      el.style.paddingRight = lockPaddingValue;
    }
  }
  body.style.paddingRight = lockPaddingValue;
  body.classList.add("lock");

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function bodyUnlock() {
  setTimeout(function () {
    for (let i = 0; i < lockPadding.length; i++) {
      const el = lockPadding[i];
      el.style.paddingRight = "0px";
    }
    body.style.paddingRight = "0px";
    body.classList.remove("lock");
  }, timeout);

  unlock = false;
  setTimeout(function () {
    unlock = true;
  }, timeout);
}

function testWebP(callback) {
  let webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height === 2);
  };
  webP.src =
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support === true) {
    document.querySelector("body").classList.add("webp");
  }
});

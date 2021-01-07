//add animation-delay in css stylesheet - manually
var gridModule = {
  gridContainer: null,
  grid_elements: [],
  children: null,
  a: null,
  b: null,
  flag: false,
  init: function (element, child_content = null) {



    //Get Main Container and content
    this.gridContainer = document.querySelector(element);

    if (child_content) {
      this.children = document.querySelectorAll(child_content);
    }

    // basic grid settings of Main Container
    this.gridContainer.style.background = "none";
    this.gridContainer.style.display = "grid";

    // important if you change maxValue - a - b
    // change this one if you change maxValue to adjust size correctly
    // a*b should add up to maxValue
    // change gridTemplateColumns too
    if(window.innerWidth < 600){
      this.gridContainer.style.gridTemplateColumns = "1fr";
      this.a = this.gridContainer.clientHeight / 8;
      this.b = this.gridContainer.clientWidth ;
    }else{
      this.gridContainer.style.gridTemplateColumns = "1fr 1fr";
      this.a = this.gridContainer.clientHeight / 4;
      this.b = this.gridContainer.clientWidth / 2;
    }

    this.gridContainer.style.gridGap = "5px";

    // create the element on current settings
    this.createEl();
    // initialize every element with functionality and content
    this.initEl();

    window.onresize = function () {
      location.reload();
    }
  },
  createEl: function () {
    var curr = 0, check;

    // MainGrid currently set on max value of 16 tiles
    for (var i = 0; i < 8; i++) {
      var el = this.newElement("div", {
        class: "grid_el",
        transition: "all .33s ease",
        height: this.a + "px",
        width: this.b + "px",
        transform: "scale(0)",
        "animation-name": "anima",
        "animation-duration": "1s",
        "animation-fill-mode": "forwards",
        "justify-self": "center",
        "align-self": "center",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "font-size": "30px"
      });

      // add content of children to grid_el - change maxValue here too if you change it above!
      if (this.children) {
        if (curr < this.children.length) {
          check = this.lesserTiles(8 - i, this.children.length - curr, el, curr)
          if (check !== 0) curr++;
        }
      }

      // add grid_el to grid_container
      this.gridContainer.appendChild(el);
      this.grid_elements.push(el);
    }
  },
  initEl: function () {
    this.grid_elements.forEach((element, index) => {
      var timeout;
      var timeout_child;
      element.addEventListener("click", () => {
        if (this.flag) {
          // fadeToggle content of children
          clearTimeout(timeout_child);
          if (this.children){
            timeout_child = this.toggleChildren(true, element);
          }
          //reset grid_el
          element.style.height = this.a + "px";
          element.style.width = this.b + "px";

          timeout = setTimeout(() => {
            element.style.position = "inherit";
            element.style.zIndex = "0";
          }, 500);

          this.flag = false;
        } else {

          //prevent visual bug
          clearTimeout(timeout);
          clearTimeout(timeout_child);

          // maximize grid_el
          element.style.zIndex = "1";
          element.style.position = "absolute";
          element.style.height = (this.gridContainer.clientHeight + (4 * 5)) + "px";
          element.style.width = (this.gridContainer.clientWidth + 5) + "px";

          // fadeToggle content of children
          timeout_child = this.toggleChildren(false, element);

          this.flag = true;
        }
      });
    })

  },
  newElement: function (type, attrs = {}) {
    const el = document.createElement(type);
    var style = "";
    for (let attr in attrs) {
      const value = attrs[attr];
      if (attr == "class" || attr == "id") {
        el.setAttribute(attr, value);
      } else {
        style += attr + ":" + value + ";" + " ";
      }
    }
    el.setAttribute("style", style);
    return el;
  },
  lesserTiles: function (maxValue, tiles, el, index) {
    if (maxValue % tiles == 0) {
      el.appendChild(this.children[index]);
      //initialize css of content of grid_el
      this.children[index].childNodes[1].style.display = "none";
      this.children[index].childNodes[1].style.opacity = 0;
      this.children[index].childNodes[0].style.opacity = 1;
    } else {
      return 0;
    }
  },
  toggleChildren: function (flag, element) {
    if (flag) {
      // hide hidden content of children
      if (element.hasChildNodes()) {
        element.childNodes[0].style.overflowY = "hidden";
        element.childNodes[0].childNodes[0].style.transform = "scale(1.1)";
        element.childNodes[0].childNodes[0].style.paddingTop = "0";
        element.childNodes[0].childNodes[1].style.opacity = "0";
        element.childNodes[0].childNodes[0].style.opacity = "0";
        let timeout = setTimeout(() => {
          element.childNodes[0].childNodes[1].style.display = "none";
          element.childNodes[0].childNodes[0].style.opacity = "1";
          element.childNodes[0].style.width = "inherit";
          element.childNodes[0].style.height = "inherit";
        }, 330);
        return timeout;
      }
    } else {
      if (element.hasChildNodes()) {
        element.childNodes[0].style.width = "100%";
        element.childNodes[0].style.height = "100%";
        element.childNodes[0].childNodes[0].style.paddingTop = "30px";
        element.childNodes[0].childNodes[0].style.transform = "scale(1.25)";
        element.childNodes[0].childNodes[1].style.display = "block";
        let timeout = setTimeout(() => {
          element.childNodes[0].childNodes[1].style.opacity = "1";
          element.childNodes[0].style.overflowY = "scroll";
        }, 330);
        return timeout;
      }
    }
  }
}







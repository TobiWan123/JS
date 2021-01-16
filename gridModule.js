//add animation-delay in css stylesheet - manually
const gridModule = {
  gridContainer: null,
  grid_elements: [],
  children: null,
  activeEl: null,
  a: null,
  b: null,
  flag: false,
  minimize: false,
  heightVal: 4,
  widthVal: 2,
  mobileQ: 8,
  init: function (element = null, child_content = null) {


    //Get Main Container and content
    this.gridContainer = document.querySelector(element);

    if (!this.gridContainer){
      console.log('No Container!!');
      return 1;
    }

    if (child_content) {
      this.children = document.querySelectorAll(child_content);
      if (this.children.length > this.heightVal * this.widthVal) {
        console.log('Too many Children!!');
        return 1;
      }
    }

    // basic grid settings of Main Container
    this.gridContainer.style.background = "none";
    this.gridContainer.style.display = "grid";

    // important if you change maxValue - a - b
    // change this one if you change maxValue to adjust size correctly
    // a*b should add up to maxValue
    // change gridTemplateColumns too if you want
    if (window.innerWidth < 600) {
      this.gridContainer.style.gridTemplateColumns = "1fr";
      this.a = this.gridContainer.clientHeight / 8;
      this.b = this.gridContainer.clientWidth;
    } else {
      this.gridContainer.style.gridTemplateColumns = "1fr 1fr";
      this.a = this.gridContainer.clientHeight / this.heightVal;
      this.b = this.gridContainer.clientWidth / this.widthVal;
    }

    this.gridContainer.style.gridGap = "5px";

    // create the element on current settings
    this.createEl();
    // initialize every element (and children) with functionality and content
    this.initEl();
    // Responsive on resize
    this.respListener();
  },
  createEl: function () {
    var curr = 0, check;

    // MainGrid currently set on max value of 16 tiles
    for (var i = 0; i < 8; i++) {
      var el = this.newElement("div", {
        class: "grid_el",
        transition: "all .33s ease",
        "height": (this.a - 5) + "px",
        width: (this.b - 5) + "px",
        "justify-self": "center",
        "align-self": "center",
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
        "font-size": "1.5rem"
      });

      // add content of children to grid_el - change maxValue here too if you change it above!
      if (this.children) {
        if (curr < this.children.length) {
          check = this.lesserTiles(8 - i, this.children.length - curr, el, curr)
          if (check !== 0) curr++;
        }
      }

      //add Listener
      this.addElListener(el);

      // add grid_el to grid_container
      this.gridContainer.appendChild(el);
      this.grid_elements.push(el);
    }
  },
  initEl: function () {
    var timeout;
    var timeout_child;
    this.grid_elements.forEach((element, index) => {
      element.addEventListener("click", () => {
        if (this.flag) {
          // double-click to minimize
          if (this.minimize) {
            // fadeToggle content of children
            if (this.children) {
              clearTimeout(timeout_child);
              timeout_child = this.toggleChildren(true, element);
            }
            //reset grid_el
            timeout = this.toggleEl(true, element);

            this.minimize = false;
            this.flag = false;
          } else {
            this.minimize = true;
          }
        } else {

          // set active-state
          this.activeEl = element;

          //notify for double-click
          if (notifyModule) notifyModule.message('Click double to minimize.');

          //prevent visual bug
          clearTimeout(timeout);

          // maximize grid_el
          timeout = this.toggleEl(false, element);

          // fadeToggle content of children
          if (this.children) {
            clearTimeout(timeout_child);
            timeout_child = this.toggleChildren(false, element);
          }

          this.flag = true;
        }
      });
    });
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
        element.childNodes[0].childNodes[0].style.transform = "scale(1.1)";
        element.childNodes[0].childNodes[1].style.opacity = "0";
        element.childNodes[0].childNodes[0].style.opacity = "0";
        element.childNodes[0].style.overflowY = "hidden";
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
        element.childNodes[0].childNodes[1].style.display = "block";
        let timeout = setTimeout(() => {
          element.childNodes[0].childNodes[1].style.opacity = "1";
          element.childNodes[0].style.overflowY = "scroll";
        }, 330);

        // display top-title on mobile better
        if(window.innerWidth < 500)  element.childNodes[0].childNodes[0].style.transform = "translateY(" + -60 + "px)";

        return timeout;
      }
    }
  },
  toggleEl: function (flag, element) {

    let timeout;

    if (flag) {
      element.style.height = this.a + "px";
      element.style.width = this.b + "px";
      element.style.cursor = "pointer";

      this.gridContainer.style.pointerEvents = 'none';
      timeout = setTimeout(() => {
        element.style.position = "inherit";
        element.style.zIndex = "0";
        this.gridContainer.style.pointerEvents = 'inherit';
      }, 500);
    } else {
      element.style.zIndex = "1";
      element.style.position = "absolute";
      element.style.cursor = "inherit";
      // extra pixels for grid-gap added
      element.style.height = (this.gridContainer.clientHeight + (6 * 5)) + "px";
      element.style.width = (this.gridContainer.clientWidth + 10) + "px";
    }
    return timeout;
  },
  addElListener: function (el) {
    if (window.innerWidth > 600) {
      el.addEventListener('mouseover', () => {
        if (this.flag) {
          el.style.background = '#393939';
          el.style.border = 'none';
        } else {
          el.style.background = 'transparent';
          el.style.border = 'solid 1px white';
        }
      });
      el.addEventListener('mouseleave', () => {
        el.style.background = '#393939';
        el.style.border = 'none';
      });
    }
  },
  respListener: function () {
    // Responsive on resize
    window.addEventListener('resize', () => {
        // Calculate new a and b
        // prevent bug on fast resize
        setTimeout(() => {
          if (window.innerWidth < 600) {
            this.gridContainer.style.gridTemplateColumns = "1fr";
            this.a = this.gridContainer.clientHeight / this.mobileQ;
            this.b = this.gridContainer.clientWidth;
          } else {

            this.gridContainer.style.gridTemplateColumns = "1fr 1fr";
            this.a = this.gridContainer.clientHeight / this.heightVal;
            this.b = this.gridContainer.clientWidth / this.widthVal;
          }
          // resize elements
          this.grid_elements.forEach(el => {

            el.style.height = (this.a - 5) + 'px';
            el.style.width = (this.b - 5) + 'px';
          });
        }, 500);

        // responsive on active-state
        if (this.flag) {
          if (this.activeEl) {
            if (this.children) this.toggleChildren(true, this.activeEl);
            this.toggleEl(true, this.activeEl);
          }
          this.flag = false;
          this.minimize = false;
        }
      }
    );
  }
}




const notifyModule = {
  message: function (message = null) {
    var el = this.newElement("div", {
      class: "message",
      transition: "all .5s ease",
      "min-height": 40 + "px",
      "max-height": 60 + "px",
      "min-width": 200 + "px",
      "max-width": 250 + "px",
      "font-size": "0.75rem",
      background: 'black',
      color: 'white',
      "text-align": 'center',
      display: 'flex',
      "justify-content": 'center',
      "align-items": 'center',
      "border-radius": '5px'
    });

    var el_text = this.newElement("p", {});

    // set Message and display an amount of time
    el_text.innerText = message;

    //append to document
    el.appendChild(el_text);
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.opacity = '0';
    }, 3000);

    setTimeout(() => {
      document.body.removeChild(el);
    }, 5000);
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
  }
}

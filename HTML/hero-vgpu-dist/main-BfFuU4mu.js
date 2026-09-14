var ta = Object.defineProperty;
var Rn = (t) => {
  throw TypeError(t);
};
var na = (t, e, n) => e in t ? ta(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var x = (t, e, n) => na(t, typeof e != "symbol" ? e + "" : e, n), On = (t, e, n) => e.has(t) || Rn("Cannot " + n), qr = (t, e) => Object(e) !== e ? Rn('Cannot use the "in" operator on this value') : t.has(e), p = (t, e, n) => (On(t, e, "read from private field"), n ? n.call(t) : e.get(t)), T = (t, e, n) => e.has(t) ? Rn("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), M = (t, e, n, r) => (On(t, e, "write to private field"), r ? r.call(t, n) : e.set(t, n), n), S = (t, e, n) => (On(t, e, "access private method"), n);
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */
class fe {
  constructor(e, n, r, i, s = "div") {
    this.parent = e, this.object = n, this.property = r, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(s), this.domElement.classList.add("controller"), this.domElement.classList.add(i), this.$name = document.createElement("div"), this.$name.classList.add("name"), fe.nextNameID = fe.nextNameID || 0, this.$name.id = `lil-gui-name-${++fe.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (o) => o.stopPropagation()), this.domElement.addEventListener("keyup", (o) => o.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(r);
  }
  /**
   * Sets the name of the controller and its label in the GUI.
   * @param {string} name
   * @returns {this}
   */
  name(e) {
    return this._name = e, this.$name.textContent = e, this;
  }
  /**
   * Pass a function to be called whenever the value is modified by this controller.
   * The function receives the new value as its first parameter. The value of `this` will be the
   * controller.
   *
   * For function controllers, the `onChange` callback will be fired on click, after the function
   * executes.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onChange( function( v ) {
   * 	console.log( 'The value is now ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onChange(e) {
    return this._onChange = e, this;
  }
  /**
   * Calls the onChange methods of this controller and its parent GUI.
   * @protected
   */
  _callOnChange() {
    this.parent._callOnChange(this), this._onChange !== void 0 && this._onChange.call(this, this.getValue()), this._changed = !0;
  }
  /**
   * Pass a function to be called after this controller has been modified and loses focus.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onFinishChange( function( v ) {
   * 	console.log( 'Changes complete: ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onFinishChange(e) {
    return this._onFinishChange = e, this;
  }
  /**
   * Should be called by Controller when its widgets lose focus.
   * @protected
   */
  _callOnFinishChange() {
    this._changed && (this.parent._callOnFinishChange(this), this._onFinishChange !== void 0 && this._onFinishChange.call(this, this.getValue())), this._changed = !1;
  }
  /**
   * Sets the controller back to its initial value.
   * @returns {this}
   */
  reset() {
    return this.setValue(this.initialValue), this._callOnFinishChange(), this;
  }
  /**
   * Enables this controller.
   * @param {boolean} enabled
   * @returns {this}
   * @example
   * controller.enable();
   * controller.enable( false ); // disable
   * controller.enable( controller._disabled ); // toggle
   */
  enable(e = !0) {
    return this.disable(!e);
  }
  /**
   * Disables this controller.
   * @param {boolean} disabled
   * @returns {this}
   * @example
   * controller.disable();
   * controller.disable( false ); // enable
   * controller.disable( !controller._disabled ); // toggle
   */
  disable(e = !0) {
    return e === this._disabled ? this : (this._disabled = e, this.domElement.classList.toggle("disabled", e), this.$disable.toggleAttribute("disabled", e), this);
  }
  /**
   * Shows the Controller after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * controller.show();
   * controller.show( false ); // hide
   * controller.show( controller._hidden ); // toggle
   */
  show(e = !0) {
    return this._hidden = !e, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the Controller.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  /**
   * Changes this controller into a dropdown of options.
   *
   * Calling this method on an option controller will simply update the options. However, if this
   * controller was not already an option controller, old references to this controller are
   * destroyed, and a new controller is added to the end of the GUI.
   * @example
   * // safe usage
   *
   * gui.add( obj, 'prop1' ).options( [ 'a', 'b', 'c' ] );
   * gui.add( obj, 'prop2' ).options( { Big: 10, Small: 1 } );
   * gui.add( obj, 'prop3' );
   *
   * // danger
   *
   * const ctrl1 = gui.add( obj, 'prop1' );
   * gui.add( obj, 'prop2' );
   *
   * // calling options out of order adds a new controller to the end...
   * const ctrl2 = ctrl1.options( [ 'a', 'b', 'c' ] );
   *
   * // ...and ctrl1 now references a controller that doesn't exist
   * assert( ctrl2 !== ctrl1 )
   * @param {object|Array} options
   * @returns {Controller}
   */
  options(e) {
    const n = this.parent.add(this.object, this.property, e);
    return n.name(this._name), this.destroy(), n;
  }
  /**
   * Sets the minimum value. Only works on number controllers.
   * @param {number} min
   * @returns {this}
   */
  min(e) {
    return this;
  }
  /**
   * Sets the maximum value. Only works on number controllers.
   * @param {number} max
   * @returns {this}
   */
  max(e) {
    return this;
  }
  /**
   * Values set by this controller will be rounded to multiples of `step`. Only works on number
   * controllers.
   * @param {number} step
   * @returns {this}
   */
  step(e) {
    return this;
  }
  /**
   * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
   * like `step()`. Only works on number controllers.
   * @example
   * gui.add( object, 'property' ).listen().decimals( 4 );
   * @param {number} decimals
   * @returns {this}
   */
  decimals(e) {
    return this;
  }
  /**
   * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
   * @param {boolean} listen
   * @returns {this}
   */
  listen(e = !0) {
    return this._listening = e, this._listenCallbackID !== void 0 && (cancelAnimationFrame(this._listenCallbackID), this._listenCallbackID = void 0), this._listening && this._listenCallback(), this;
  }
  _listenCallback() {
    this._listenCallbackID = requestAnimationFrame(this._listenCallback);
    const e = this.save();
    e !== this._listenPrevValue && this.updateDisplay(), this._listenPrevValue = e;
  }
  /**
   * Returns `object[ property ]`.
   * @returns {any}
   */
  getValue() {
    return this.object[this.property];
  }
  /**
   * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
   * @param {any} value
   * @returns {this}
   */
  setValue(e) {
    return this.getValue() !== e && (this.object[this.property] = e, this._callOnChange(), this.updateDisplay()), this;
  }
  /**
   * Updates the display to keep it in sync with the current value. Useful for updating your
   * controllers when their values have been modified outside of the GUI.
   * @returns {this}
   */
  updateDisplay() {
    return this;
  }
  load(e) {
    return this.setValue(e), this._callOnFinishChange(), this;
  }
  save() {
    return this.getValue();
  }
  /**
   * Destroys this controller and removes it from the parent GUI.
   */
  destroy() {
    this.listen(!1), this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1), this.parent.$children.removeChild(this.domElement);
  }
}
class ra extends fe {
  constructor(e, n, r) {
    super(e, n, r, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function Yn(t) {
  let e, n;
  return (e = t.match(/(#|0x)?([a-f0-9]{6})/i)) ? n = e[2] : (e = t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? n = parseInt(e[1]).toString(16).padStart(2, 0) + parseInt(e[2]).toString(16).padStart(2, 0) + parseInt(e[3]).toString(16).padStart(2, 0) : (e = t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (n = e[1] + e[1] + e[2] + e[2] + e[3] + e[3]), n ? "#" + n : !1;
}
const ia = {
  isPrimitive: !0,
  match: (t) => typeof t == "string",
  fromHexString: Yn,
  toHexString: Yn
}, Vt = {
  isPrimitive: !0,
  match: (t) => typeof t == "number",
  fromHexString: (t) => parseInt(t.substring(1), 16),
  toHexString: (t) => "#" + t.toString(16).padStart(6, 0)
}, sa = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (t) => Array.isArray(t),
  fromHexString(t, e, n = 1) {
    const r = Vt.fromHexString(t);
    e[0] = (r >> 16 & 255) / 255 * n, e[1] = (r >> 8 & 255) / 255 * n, e[2] = (r & 255) / 255 * n;
  },
  toHexString([t, e, n], r = 1) {
    r = 255 / r;
    const i = t * r << 16 ^ e * r << 8 ^ n * r << 0;
    return Vt.toHexString(i);
  }
}, oa = {
  isPrimitive: !1,
  match: (t) => Object(t) === t,
  fromHexString(t, e, n = 1) {
    const r = Vt.fromHexString(t);
    e.r = (r >> 16 & 255) / 255 * n, e.g = (r >> 8 & 255) / 255 * n, e.b = (r & 255) / 255 * n;
  },
  toHexString({ r: t, g: e, b: n }, r = 1) {
    r = 255 / r;
    const i = t * r << 16 ^ e * r << 8 ^ n * r << 0;
    return Vt.toHexString(i);
  }
}, aa = [ia, Vt, sa, oa];
function ca(t) {
  return aa.find((e) => e.match(t));
}
class la extends fe {
  constructor(e, n, r, i) {
    super(e, n, r, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = ca(this.initialValue), this._rgbScale = i, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const s = Yn(this.$text.value);
      s && this._setValueFromHexString(s);
    }), this.$text.addEventListener("focus", () => {
      this._textFocused = !0, this.$text.select();
    }), this.$text.addEventListener("blur", () => {
      this._textFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    }), this.$disable = this.$text, this.updateDisplay();
  }
  reset() {
    return this._setValueFromHexString(this._initialValueHexString), this;
  }
  _setValueFromHexString(e) {
    if (this._format.isPrimitive) {
      const n = this._format.fromHexString(e);
      this.setValue(n);
    } else
      this._format.fromHexString(e, this.getValue(), this._rgbScale), this._callOnChange(), this.updateDisplay();
  }
  save() {
    return this._format.toHexString(this.getValue(), this._rgbScale);
  }
  load(e) {
    return this._setValueFromHexString(e), this._callOnFinishChange(), this;
  }
  updateDisplay() {
    return this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale), this._textFocused || (this.$text.value = this.$input.value.substring(1)), this.$display.style.backgroundColor = this.$input.value, this;
  }
}
class Gn extends fe {
  constructor(e, n, r) {
    super(e, n, r, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (i) => {
      i.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class ua extends fe {
  constructor(e, n, r, i, s, o) {
    super(e, n, r, "number"), this._initInput(), this.min(i), this.max(s);
    const a = o !== void 0;
    this.step(a ? o : this._getImplicitStep(), a), this.updateDisplay();
  }
  decimals(e) {
    return this._decimals = e, this.updateDisplay(), this;
  }
  min(e) {
    return this._min = e, this._onUpdateMinMax(), this;
  }
  max(e) {
    return this._max = e, this._onUpdateMinMax(), this;
  }
  step(e, n = !0) {
    return this._step = e, this._stepExplicit = n, this;
  }
  updateDisplay() {
    const e = this.getValue();
    if (this._hasSlider) {
      let n = (e - this._min) / (this._max - this._min);
      n = Math.max(0, Math.min(n, 1)), this.$fill.style.width = n * 100 + "%";
    }
    return this._inputFocused || (this.$input.value = this._decimals === void 0 ? e : e.toFixed(this._decimals)), this;
  }
  _initInput() {
    this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("aria-labelledby", this.$name.id), window.matchMedia("(pointer: coarse)").matches && (this.$input.setAttribute("type", "number"), this.$input.setAttribute("step", "any")), this.$widget.appendChild(this.$input), this.$disable = this.$input;
    const n = () => {
      let y = parseFloat(this.$input.value);
      isNaN(y) || (this._stepExplicit && (y = this._snap(y)), this.setValue(this._clamp(y)));
    }, r = (y) => {
      const E = parseFloat(this.$input.value);
      isNaN(E) || (this._snapClampSetValue(E + y), this.$input.value = this.getValue());
    }, i = (y) => {
      y.key === "Enter" && this.$input.blur(), y.code === "ArrowUp" && (y.preventDefault(), r(this._step * this._arrowKeyMultiplier(y))), y.code === "ArrowDown" && (y.preventDefault(), r(this._step * this._arrowKeyMultiplier(y) * -1));
    }, s = (y) => {
      this._inputFocused && (y.preventDefault(), r(this._step * this._normalizeMouseWheel(y)));
    };
    let o = !1, a, c, l, u, d;
    const f = 5, h = (y) => {
      a = y.clientX, c = l = y.clientY, o = !0, u = this.getValue(), d = 0, window.addEventListener("mousemove", g), window.addEventListener("mouseup", w);
    }, g = (y) => {
      if (o) {
        const E = y.clientX - a, L = y.clientY - c;
        Math.abs(L) > f ? (y.preventDefault(), this.$input.blur(), o = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(E) > f && w();
      }
      if (!o) {
        const E = y.clientY - l;
        d -= E * this._step * this._arrowKeyMultiplier(y), u + d > this._max ? d = this._max - u : u + d < this._min && (d = this._min - u), this._snapClampSetValue(u + d);
      }
      l = y.clientY;
    }, w = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", w);
    }, b = () => {
      this._inputFocused = !0;
    }, _ = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", n), this.$input.addEventListener("keydown", i), this.$input.addEventListener("wheel", s, { passive: !1 }), this.$input.addEventListener("mousedown", h), this.$input.addEventListener("focus", b), this.$input.addEventListener("blur", _);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const e = (_, y, E, L, $) => (_ - y) / (E - y) * ($ - L) + L, n = (_) => {
      const y = this.$slider.getBoundingClientRect();
      let E = e(_, y.left, y.right, this._min, this._max);
      this._snapClampSetValue(E);
    }, r = (_) => {
      this._setDraggingStyle(!0), n(_.clientX), window.addEventListener("mousemove", i), window.addEventListener("mouseup", s);
    }, i = (_) => {
      n(_.clientX);
    }, s = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", i), window.removeEventListener("mouseup", s);
    };
    let o = !1, a, c;
    const l = (_) => {
      _.preventDefault(), this._setDraggingStyle(!0), n(_.touches[0].clientX), o = !1;
    }, u = (_) => {
      _.touches.length > 1 || (this._hasScrollBar ? (a = _.touches[0].clientX, c = _.touches[0].clientY, o = !0) : l(_), window.addEventListener("touchmove", d, { passive: !1 }), window.addEventListener("touchend", f));
    }, d = (_) => {
      if (o) {
        const y = _.touches[0].clientX - a, E = _.touches[0].clientY - c;
        Math.abs(y) > Math.abs(E) ? l(_) : (window.removeEventListener("touchmove", d), window.removeEventListener("touchend", f));
      } else
        _.preventDefault(), n(_.touches[0].clientX);
    }, f = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", d), window.removeEventListener("touchend", f);
    }, h = this._callOnFinishChange.bind(this), g = 400;
    let w;
    const b = (_) => {
      if (Math.abs(_.deltaX) < Math.abs(_.deltaY) && this._hasScrollBar) return;
      _.preventDefault();
      const E = this._normalizeMouseWheel(_) * this._step;
      this._snapClampSetValue(this.getValue() + E), this.$input.value = this.getValue(), clearTimeout(w), w = setTimeout(h, g);
    };
    this.$slider.addEventListener("mousedown", r), this.$slider.addEventListener("touchstart", u, { passive: !1 }), this.$slider.addEventListener("wheel", b, { passive: !1 });
  }
  _setDraggingStyle(e, n = "horizontal") {
    this.$slider && this.$slider.classList.toggle("active", e), document.body.classList.toggle("lil-gui-dragging", e), document.body.classList.toggle(`lil-gui-${n}`, e);
  }
  _getImplicitStep() {
    return this._hasMin && this._hasMax ? (this._max - this._min) / 1e3 : 0.1;
  }
  _onUpdateMinMax() {
    !this._hasSlider && this._hasMin && this._hasMax && (this._stepExplicit || this.step(this._getImplicitStep(), !1), this._initSlider(), this.updateDisplay());
  }
  _normalizeMouseWheel(e) {
    let { deltaX: n, deltaY: r } = e;
    return Math.floor(e.deltaY) !== e.deltaY && e.wheelDelta && (n = 0, r = -e.wheelDelta / 120, r *= this._stepExplicit ? 1 : 10), n + -r;
  }
  _arrowKeyMultiplier(e) {
    let n = this._stepExplicit ? 1 : 10;
    return e.shiftKey ? n *= 10 : e.altKey && (n /= 10), n;
  }
  _snap(e) {
    const n = Math.round(e / this._step) * this._step;
    return parseFloat(n.toPrecision(15));
  }
  _clamp(e) {
    return e < this._min && (e = this._min), e > this._max && (e = this._max), e;
  }
  _snapClampSetValue(e) {
    this.setValue(this._clamp(this._snap(e)));
  }
  get _hasScrollBar() {
    const e = this.parent.root.$children;
    return e.scrollHeight > e.clientHeight;
  }
  get _hasMin() {
    return this._min !== void 0;
  }
  get _hasMax() {
    return this._max !== void 0;
  }
}
class da extends fe {
  constructor(e, n, r, i) {
    super(e, n, r, "option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$select.addEventListener("change", () => {
      this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
    }), this.$select.addEventListener("focus", () => {
      this.$display.classList.add("focus");
    }), this.$select.addEventListener("blur", () => {
      this.$display.classList.remove("focus");
    }), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(i);
  }
  options(e) {
    return this._values = Array.isArray(e) ? e : Object.values(e), this._names = Array.isArray(e) ? e : Object.keys(e), this.$select.replaceChildren(), this._names.forEach((n) => {
      const r = document.createElement("option");
      r.textContent = n, this.$select.appendChild(r);
    }), this.updateDisplay(), this;
  }
  updateDisplay() {
    const e = this.getValue(), n = this._values.indexOf(e);
    return this.$select.selectedIndex = n, this.$display.textContent = n === -1 ? e : this._names[n], this;
  }
}
class fa extends fe {
  constructor(e, n, r) {
    super(e, n, r, "string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
      this.setValue(this.$input.value);
    }), this.$input.addEventListener("keydown", (i) => {
      i.code === "Enter" && this.$input.blur();
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.value = this.getValue(), this;
  }
}
const ha = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: none;
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
  }
  .lil-gui button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;
function pa(t) {
  const e = document.createElement("style");
  e.innerHTML = t;
  const n = document.querySelector("head link[rel=stylesheet], head style");
  n ? document.head.insertBefore(e, n) : document.head.appendChild(e);
}
let Xr = !1;
class Ar {
  /**
   * Creates a panel that holds controllers.
   * @example
   * new GUI();
   * new GUI( { container: document.getElementById( 'custom' ) } );
   *
   * @param {object} [options]
   * @param {boolean} [options.autoPlace=true]
   * Adds the GUI to `document.body` and fixes it to the top right of the page.
   *
   * @param {HTMLElement} [options.container]
   * Adds the GUI to this DOM element. Overrides `autoPlace`.
   *
   * @param {number} [options.width=245]
   * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
   * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`.
   *
   * @param {string} [options.title=Controls]
   * Name to display in the title bar.
   *
   * @param {boolean} [options.closeFolders=false]
   * Pass `true` to close all folders in this GUI by default.
   *
   * @param {boolean} [options.injectStyles=true]
   * Injects the default stylesheet into the page if this is the first GUI.
   * Pass `false` to use your own stylesheet.
   *
   * @param {number} [options.touchStyles=true]
   * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
   *
   * @param {GUI} [options.parent]
   * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
   *
   */
  constructor({
    parent: e,
    autoPlace: n = e === void 0,
    container: r,
    width: i,
    title: s = "Controls",
    closeFolders: o = !1,
    injectStyles: a = !0,
    touchStyles: c = !0
  } = {}) {
    if (this.parent = e, this.root = e ? e.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("div"), this.$title.classList.add("title"), this.$title.setAttribute("role", "button"), this.$title.setAttribute("aria-expanded", !0), this.$title.setAttribute("tabindex", 0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("keydown", (l) => {
      (l.code === "Enter" || l.code === "Space") && (l.preventDefault(), this.$title.click());
    }), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(s), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), c && this.domElement.classList.add("allow-touch-styles"), !Xr && a && (pa(ha), Xr = !0), r ? r.appendChild(this.domElement) : n && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), i && this.domElement.style.setProperty("--width", i + "px"), this._closeFolders = o;
  }
  /**
   * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
   * @example
   * gui.add( object, 'property' );
   * gui.add( object, 'number', 0, 100, 1 );
   * gui.add( object, 'options', [ 1, 2, 3 ] );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
   * selectable values for a dropdown.
   * @param {number} [max] Maximum value for number controllers.
   * @param {number} [step] Step value for number controllers.
   * @returns {Controller}
   */
  add(e, n, r, i, s) {
    if (Object(r) === r)
      return new da(this, e, n, r);
    const o = e[n];
    switch (typeof o) {
      case "number":
        return new ua(this, e, n, r, i, s);
      case "boolean":
        return new ra(this, e, n);
      case "string":
        return new fa(this, e, n);
      case "function":
        return new Gn(this, e, n);
    }
    console.error(`gui.add failed
	property:`, n, `
	object:`, e, `
	value:`, o);
  }
  /**
   * Adds a color controller to the GUI.
   * @example
   * params = {
   * 	cssColor: '#ff00ff',
   * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
   * 	customRange: [ 0, 127, 255 ],
   * };
   *
   * gui.addColor( params, 'cssColor' );
   * gui.addColor( params, 'rgbColor' );
   * gui.addColor( params, 'customRange', 255 );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
   * need to set this to 255 if your colors are too bright.
   * @returns {Controller}
   */
  addColor(e, n, r = 1) {
    return new la(this, e, n, r);
  }
  /**
   * Adds a folder to the GUI, which is just another GUI. This method returns
   * the nested GUI so you can add controllers to it.
   * @example
   * const folder = gui.addFolder( 'Position' );
   * folder.add( position, 'x' );
   * folder.add( position, 'y' );
   * folder.add( position, 'z' );
   *
   * @param {string} title Name to display in the folder's title bar.
   * @returns {GUI}
   */
  addFolder(e) {
    const n = new Ar({ parent: this, title: e });
    return this.root._closeFolders && n.close(), n;
  }
  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(e, n = !0) {
    return e.controllers && this.controllers.forEach((r) => {
      r instanceof Gn || r._name in e.controllers && r.load(e.controllers[r._name]);
    }), n && e.folders && this.folders.forEach((r) => {
      r._title in e.folders && r.load(e.folders[r._title]);
    }), this;
  }
  /**
   * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
   * recall these values.
   * @example
   * {
   * 	controllers: {
   * 		prop1: 1,
   * 		prop2: 'value',
   * 		...
   * 	},
   * 	folders: {
   * 		folderName1: { controllers, folders },
   * 		folderName2: { controllers, folders }
   * 		...
   * 	}
   * }
   *
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {object}
   */
  save(e = !0) {
    const n = {
      controllers: {},
      folders: {}
    };
    return this.controllers.forEach((r) => {
      if (!(r instanceof Gn)) {
        if (r._name in n.controllers)
          throw new Error(`Cannot save GUI with duplicate property "${r._name}"`);
        n.controllers[r._name] = r.save();
      }
    }), e && this.folders.forEach((r) => {
      if (r._title in n.folders)
        throw new Error(`Cannot save GUI with duplicate folder "${r._title}"`);
      n.folders[r._title] = r.save();
    }), n;
  }
  /**
   * Opens a GUI or folder. GUI and folders are open by default.
   * @param {boolean} open Pass false to close.
   * @returns {this}
   * @example
   * gui.open(); // open
   * gui.open( false ); // close
   * gui.open( gui._closed ); // toggle
   */
  open(e = !0) {
    return this._setClosed(!e), this.$title.setAttribute("aria-expanded", !this._closed), this.domElement.classList.toggle("closed", this._closed), this;
  }
  /**
   * Closes the GUI.
   * @returns {this}
   */
  close() {
    return this.open(!1);
  }
  _setClosed(e) {
    this._closed !== e && (this._closed = e, this._callOnOpenClose(this));
  }
  /**
   * Shows the GUI after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * gui.show();
   * gui.show( false ); // hide
   * gui.show( gui._hidden ); // toggle
   */
  show(e = !0) {
    return this._hidden = !e, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the GUI.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  openAnimated(e = !0) {
    return this._setClosed(!e), this.$title.setAttribute("aria-expanded", !this._closed), requestAnimationFrame(() => {
      const n = this.$children.clientHeight;
      this.$children.style.height = n + "px", this.domElement.classList.add("transition");
      const r = (s) => {
        s.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("transition"), this.$children.removeEventListener("transitionend", r));
      };
      this.$children.addEventListener("transitionend", r);
      const i = e ? this.$children.scrollHeight : 0;
      this.domElement.classList.toggle("closed", !e), requestAnimationFrame(() => {
        this.$children.style.height = i + "px";
      });
    }), this;
  }
  /**
   * Change the title of this GUI.
   * @param {string} title
   * @returns {this}
   */
  title(e) {
    return this._title = e, this.$title.textContent = e, this;
  }
  /**
   * Resets all controllers to their initial values.
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  reset(e = !0) {
    return (e ? this.controllersRecursive() : this.controllers).forEach((r) => r.reset()), this;
  }
  /**
   * Pass a function to be called whenever a controller in this GUI changes.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onChange(e) {
    return this._onChange = e, this;
  }
  _callOnChange(e) {
    this.parent && this.parent._callOnChange(e), this._onChange !== void 0 && this._onChange.call(this, {
      object: e.object,
      property: e.property,
      value: e.getValue(),
      controller: e
    });
  }
  /**
   * Pass a function to be called whenever a controller in this GUI has finished changing.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onFinishChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onFinishChange(e) {
    return this._onFinishChange = e, this;
  }
  _callOnFinishChange(e) {
    this.parent && this.parent._callOnFinishChange(e), this._onFinishChange !== void 0 && this._onFinishChange.call(this, {
      object: e.object,
      property: e.property,
      value: e.getValue(),
      controller: e
    });
  }
  /**
   * Pass a function to be called when this GUI or its descendants are opened or closed.
   * @param {function(GUI)} callback
   * @returns {this}
   * @example
   * gui.onOpenClose( changedGUI => {
   * 	console.log( changedGUI._closed );
   * } );
   */
  onOpenClose(e) {
    return this._onOpenClose = e, this;
  }
  _callOnOpenClose(e) {
    this.parent && this.parent._callOnOpenClose(e), this._onOpenClose !== void 0 && this._onOpenClose.call(this, e);
  }
  /**
   * Destroys all DOM elements and event listeners associated with this GUI.
   */
  destroy() {
    this.parent && (this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.folders.splice(this.parent.folders.indexOf(this), 1)), this.domElement.parentElement && this.domElement.parentElement.removeChild(this.domElement), Array.from(this.children).forEach((e) => e.destroy());
  }
  /**
   * Returns an array of controllers contained by this GUI and its descendents.
   * @returns {Controller[]}
   */
  controllersRecursive() {
    let e = Array.from(this.controllers);
    return this.folders.forEach((n) => {
      e = e.concat(n.controllersRecursive());
    }), e;
  }
  /**
   * Returns an array of folders contained by this GUI and its descendents.
   * @returns {GUI[]}
   */
  foldersRecursive() {
    let e = Array.from(this.folders);
    return this.folders.forEach((n) => {
      e = e.concat(n.foldersRecursive());
    }), e;
  }
}
let Ir = class extends Error {
  constructor(n) {
    super(n.message, { cause: n.cause });
    x(this, "code");
    x(this, "severity");
    x(this, "fix");
    x(this, "where");
    x(this, "cause");
    x(this, "detail");
    this.name = "VGPUError", this.code = n.code, this.severity = n.severity ?? "error", this.fix = n.fix, this.where = n.where, this.cause = n.cause, this.detail = n.detail;
  }
};
class ae extends Ir {
  constructor(e) {
    super({ ...e, severity: "error" }), this.name = "ValidationError";
  }
}
function ma(t) {
  return new Ir({
    code: "VGPU-FEATURE-UNSUPPORTED",
    message: `Adapter does not support requested feature(s): ${t.map((e) => `"${e}"`).join(", ")}.`,
    fix: "Remove the unsupported name(s) from init({ requiredFeatures: [...] }) or run on an adapter that supports them; gate optional code paths on device.features after init.",
    where: "init"
  });
}
function ga(t, e) {
  if (!t)
    return;
  const n = (e ?? []).filter((r) => !t.has(r));
  if (n.length)
    throw ma(n);
}
const ba = {
  map_read: 1,
  map_write: 2,
  copy_src: 4,
  copy_dst: 8,
  index: 16,
  vertex: 32,
  uniform: 64,
  storage: 128,
  indirect: 256,
  query_resolve: 512
};
function Zt(t) {
  const e = globalThis.GPUBufferUsage;
  return t.reduce((n, r) => n | xa(r, e), 0);
}
function xa(t, e) {
  const n = t.toUpperCase();
  return (e == null ? void 0 : e[n]) ?? ba[t];
}
function Yr() {
  var t;
  return ((t = globalThis.GPUMapMode) == null ? void 0 : t.READ) ?? 1;
}
const wa = {
  copy_src: 1,
  copy_dst: 2,
  texture_binding: 4,
  storage_binding: 8,
  render_attachment: 16
};
function _a(t) {
  const e = globalThis.GPUTextureUsage;
  return t.reduce((n, r) => n | ya(r, e), 0);
}
function ya(t, e) {
  const n = t.toUpperCase();
  return (e == null ? void 0 : e[n]) ?? wa[t];
}
function fs(t) {
  return "__vgpuMockBytes" in t;
}
function Jr(t) {
  return "__vgpuMockBytes" in t;
}
let va = 1;
function kn(t) {
  return Object.freeze({ kind: t, id: va++ });
}
class Dn {
  constructor() {
    x(this, "callbacks", /* @__PURE__ */ new Set());
    x(this, "destroyed", !1);
  }
  onDestroy(e, n) {
    return this.destroyed ? (n(e), () => {
    }) : (this.callbacks.add(n), () => {
      this.callbacks.delete(n);
    });
  }
  emit(e) {
    if (this.destroyed)
      return !1;
    this.destroyed = !0;
    const n = [...this.callbacks];
    this.callbacks.clear();
    for (const r of n)
      r(e);
    return !0;
  }
}
var We, kt;
class Ae {
  constructor(e, n, r, i = "owned") {
    T(this, We);
    x(this, "device");
    x(this, "gpu");
    x(this, "options");
    x(this, "ownership");
    x(this, "destroySignal", new Dn());
    x(this, "identity", kn("buffer"));
    x(this, "destroyed", !1);
    this.device = e, this.gpu = n, this.options = r, this.ownership = i, Object.defineProperty(this, "assertUsable", { value: (s) => S(this, We, kt).call(this, s) });
  }
  get resourceIdentity() {
    return this.identity;
  }
  onDestroy(e) {
    return this.destroySignal.onDestroy(this, e);
  }
  write(e, n = 0) {
    S(this, We, kt).call(this, "Buffer.write"), this.ownership === "external" && this.validateExternalOperation("write", n, e.byteLength, "copy_dst");
    try {
      this.device.queue.writeBuffer(this.gpu, n, e);
    } catch (r) {
      throw this.ownership !== "external" ? r : nn("Buffer.write", "The external GPUBuffer rejected the write operation.", r);
    }
  }
  async read(e, n = 0) {
    S(this, We, kt).call(this, "Buffer.read"), this.ownership === "external" && this.validateExternalOperation("read", n, e, "copy_src");
    try {
      const r = await this.device.readback.read(this.gpu, e, n);
      return S(this, We, kt).call(this, "Buffer.read"), r;
    } catch (r) {
      throw r instanceof ae || this.ownership !== "external" ? r : nn("Buffer.read", "The external GPUBuffer rejected the read operation.", r);
    }
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.destroySignal.emit(this), this.ownership === "owned" && !fs(this.gpu) && this.gpu.destroy());
  }
  dispose() {
    this.destroy();
  }
  validateExternalOperation(e, n, r, i) {
    if (!(Number.isSafeInteger(n) && n >= 0 && n % 4 === 0 && Number.isSafeInteger(r) && r >= 0 && r % 4 === 0 && n <= this.options.size && r <= this.options.size - n))
      throw nn(`Buffer.${e}`, "External buffer offsets and lengths must be non-negative, 4-byte aligned, and within the buffer size.");
    if (!(this.gpu.usage & Zt([i])))
      throw nn(`Buffer.${e}`, `External buffer is missing ${i.toUpperCase()} usage.`);
  }
}
We = new WeakSet(), kt = function(e = "Buffer") {
  if (this.destroyed)
    throw new ae({
      code: "VGPU-BUFFER-DISPOSED",
      message: "Buffer is destroyed.",
      where: e,
      fix: "Wrap or create a live GPUBuffer before using it."
    });
  this.device.assertUsable(e);
};
function nn(t, e, n) {
  return new ae({
    code: "VGPU-EXTERNAL-BUFFER-VALIDATION",
    message: e,
    where: t,
    cause: n,
    fix: "Use a buffer with the required usage flags and an aligned in-range operation."
  });
}
function Sa(t) {
  if (Ia(t))
    throw $a();
  const e = { version: 1, mappings: [] }, n = {
    version: 1,
    modules: [{ path: "<runtime>", text: t }],
    diagnostics: [],
    sourceMap: e,
    cacheKey: Ea(t)
  };
  return {
    kind: "wgsl",
    wgsl: t,
    source: { text: t, path: "<runtime>", imports: [] },
    ast: n,
    sourceMap: e,
    diagnostics: [],
    cacheKey: n.cacheKey,
    entryPoints: Aa(t),
    stats: { lines: t.split(/\r?\n/).length, bytes: new TextEncoder().encode(t).byteLength, bindGroups: 0 }
  };
}
function Ea(t) {
  let e = 2166136261;
  for (let n = 0; n < t.length; n++)
    e = Math.imul(e ^ t.charCodeAt(n), 16777619);
  return { default: `vgpu-wgsl-1:${(e >>> 0).toString(16).padStart(8, "0")}` };
}
function Aa(t) {
  const e = [], n = /@(vertex|fragment|compute)\s+fn\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  for (const r of t.matchAll(n))
    e.push(r[2]);
  return e;
}
function Ia(t) {
  const e = t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").trimStart();
  return e.startsWith("import ") || e.startsWith("import{");
}
function $a() {
  const t = new Error("Runtime WGSL strings cannot contain import statements. Use a build-time loader or @vgpu/wgsl/runtime.");
  return t.name = "VGPUWGSLRuntimeImportError", t.code = "VGPU-WGSL-RUNTIME-IMPORT", t.severity = "error", t.source = "wgsl", t;
}
const Ca = /* @__PURE__ */ new Set([
  "alias",
  "break",
  "case",
  "const",
  "const_assert",
  "continue",
  "continuing",
  "default",
  "diagnostic",
  "discard",
  "else",
  "enable",
  "false",
  "fn",
  "for",
  "if",
  "let",
  "loop",
  "override",
  "requires",
  "return",
  "struct",
  "switch",
  "true",
  "var",
  "while"
]), Ta = /* @__PURE__ */ new Set(["import", "export", "from", "as"]), hs = /* @__PURE__ */ new Set([...Ca, ...Ta]), La = /* @__PURE__ */ new Set([
  "NULL",
  "Self",
  "abstract",
  "active",
  "alignas",
  "alignof",
  "as",
  "asm",
  "asm_fragment",
  "async",
  "attribute",
  "auto",
  "await",
  "become",
  "cast",
  "catch",
  "class",
  "co_await",
  "co_return",
  "co_yield",
  "coherent",
  "column_major",
  "common",
  "compile",
  "compile_fragment",
  "concept",
  "const_cast",
  "consteval",
  "constexpr",
  "constinit",
  "crate",
  "debugger",
  "decltype",
  "delete",
  "demote",
  "demote_to_helper",
  "do",
  "dynamic_cast",
  "enum",
  "explicit",
  "export",
  "extends",
  "extern",
  "external",
  "fallthrough",
  "filter",
  "final",
  "finally",
  "friend",
  "from",
  "fxgroup",
  "get",
  "goto",
  "groupshared",
  "highp",
  "impl",
  "implements",
  "import",
  "inline",
  "instanceof",
  "interface",
  "layout",
  "lowp",
  "macro",
  "macro_rules",
  "match",
  "mediump",
  "meta",
  "mod",
  "module",
  "move",
  "mut",
  "mutable",
  "namespace",
  "new",
  "nil",
  "noexcept",
  "noinline",
  "nointerpolation",
  "non_coherent",
  "noncoherent",
  "noperspective",
  "null",
  "nullptr",
  "of",
  "operator",
  "package",
  "packoffset",
  "partition",
  "pass",
  "patch",
  "pixelfragment",
  "precise",
  "precision",
  "premerge",
  "priv",
  "protected",
  "pub",
  "public",
  "readonly",
  "ref",
  "regardless",
  "register",
  "reinterpret_cast",
  "require",
  "resource",
  "restrict",
  "self",
  "set",
  "shared",
  "sizeof",
  "smooth",
  "snorm",
  "static",
  "static_assert",
  "static_cast",
  "std",
  "subroutine",
  "super",
  "target",
  "template",
  "this",
  "thread_local",
  "throw",
  "trait",
  "try",
  "type",
  "typedef",
  "typeid",
  "typename",
  "typeof",
  "union",
  "unless",
  "unorm",
  "unsafe",
  "unsized",
  "use",
  "using",
  "varying",
  "virtual",
  "volatile",
  "wgsl",
  "where",
  "with",
  "writeonly",
  "yield"
]), Fa = /* @__PURE__ */ new Set(["binding_array"]), Zr = Zt(["copy_dst", "map_read"]);
class ka {
  constructor(e) {
    x(this, "device");
    this.device = e;
  }
  async read(e, n, r) {
    if (fs(e))
      return e.__vgpuMockBytes.slice(r, r + n).buffer;
    const i = this.device.createBuffer({
      size: n,
      usage: Zr
    });
    try {
      const s = this.device.createCommandEncoder();
      s.copyBufferToBuffer(e, r, i, 0, n), this.device.queue.submit([s.finish()]), await i.mapAsync(Yr());
      const o = i.getMappedRange().slice(0);
      return Qr(i), o;
    } finally {
      ei(i);
    }
  }
  async readTexture(e, n, r) {
    const [i, s] = n, o = vn(r, "Readback.readTexture"), a = o.bytesPerPixel, c = Da(i * a, 256), l = c * s, u = this.device.createBuffer({ size: l, usage: Zr });
    let d;
    try {
      const f = this.device.createCommandEncoder();
      f.copyTextureToBuffer({ texture: e }, { buffer: u, bytesPerRow: c, rowsPerImage: s }, { width: i, height: s }), this.device.queue.submit([f.finish()]), await u.mapAsync(Yr());
      const h = new Uint8Array(u.getMappedRange());
      d = new Uint8Array(i * s * a);
      for (let g = 0; g < s; g++) {
        const w = g * c, b = g * i * a;
        d.set(h.subarray(w, w + i * a), b);
      }
      Qr(u);
    } finally {
      ei(u);
    }
    return o.swizzle === "bgra-to-rgba" && ps(d), d;
  }
  destroy() {
  }
}
function Qr(t) {
  try {
    t.unmap();
  } catch {
  }
}
function ei(t) {
  try {
    t.destroy();
  } catch {
  }
}
function Da(t, e) {
  return Math.ceil(t / e) * e;
}
const ti = {
  r8unorm: { bytesPerPixel: 1, components: 1, componentType: "unorm8" },
  rg8unorm: { bytesPerPixel: 2, components: 2, componentType: "unorm8" },
  rgba8unorm: { bytesPerPixel: 4, components: 4, componentType: "unorm8" },
  "rgba8unorm-srgb": { bytesPerPixel: 4, components: 4, componentType: "unorm8" },
  bgra8unorm: { bytesPerPixel: 4, components: 4, componentType: "unorm8", swizzle: "bgra-to-rgba" },
  "bgra8unorm-srgb": { bytesPerPixel: 4, components: 4, componentType: "unorm8", swizzle: "bgra-to-rgba" },
  r16float: { bytesPerPixel: 2, components: 1, componentType: "float16" },
  rg16float: { bytesPerPixel: 4, components: 2, componentType: "float16" },
  rgba16float: { bytesPerPixel: 8, components: 4, componentType: "float16" },
  r32float: { bytesPerPixel: 4, components: 1, componentType: "float32" },
  rg32float: { bytesPerPixel: 8, components: 2, componentType: "float32" },
  rgba32float: { bytesPerPixel: 16, components: 4, componentType: "float32" }
};
function vn(t, e) {
  const n = ti[t];
  if (n)
    return n;
  throw new ae({
    code: "VGPU-CORE-UNSUPPORTED-FORMAT",
    message: `Texture.read does not support format ${t}. Supported formats: ${Object.keys(ti).join(", ")}.`,
    where: e
  });
}
function Ma(t, e, n = "Texture.readFloats") {
  const r = vn(e, n), i = r.bytesPerPixel / r.components, s = Math.floor(t.byteLength / i), o = new Float32Array(s), a = new DataView(t.buffer, t.byteOffset, t.byteLength);
  for (let c = 0; c < s; c++)
    r.componentType === "unorm8" ? o[c] = a.getUint8(c) / 255 : r.componentType === "float16" ? o[c] = Pa(a.getUint16(c * 2, !0)) : o[c] = a.getFloat32(c * 4, !0);
  return o;
}
function Pa(t) {
  const e = t & 32768 ? -1 : 1, n = t >> 10 & 31, r = t & 1023;
  return n === 0 ? e * r * 2 ** -24 : n === 31 ? r === 0 ? e * Number.POSITIVE_INFINITY : Number.NaN : e * (r + 1024) * 2 ** (n - 25);
}
function Ra(t, e, n) {
  const r = t.slice(0, e[0] * e[1] * n.bytesPerPixel);
  return n.swizzle === "bgra-to-rgba" && ps(r), r;
}
function ps(t) {
  for (let e = 0; e < t.length; e += 4) {
    const n = t[e];
    t[e] = t[e + 2], t[e + 2] = n;
  }
}
function Oa(t) {
  return { size: t, usage: Zt(["copy_src", "copy_dst"]) };
}
class Ga {
  constructor(e, n = () => {
  }) {
    x(this, "gpu");
    x(this, "guard");
    this.gpu = e, this.guard = n;
  }
  writeBuffer(e, n, r) {
    this.guard("Queue.writeBuffer"), this.gpu.writeBuffer(e, n, r);
  }
  async flush() {
    var e, n;
    this.guard("Queue.flush"), await ((n = (e = this.gpu).onSubmittedWorkDone) == null ? void 0 : n.call(e)), this.guard("Queue.flush");
  }
}
class Na {
  constructor(e, n) {
    x(this, "gpu");
    x(this, "resolved");
    this.gpu = e, this.resolved = n;
  }
  dispose() {
  }
  get kind() {
    return this.resolved.kind;
  }
  get source() {
    return this.resolved.source;
  }
  get code() {
    return this.resolved.wgsl;
  }
  get entryPoints() {
    return this.resolved.entryPoints;
  }
  get stats() {
    return this.resolved.stats;
  }
}
const Ua = Symbol.for("vgpu/Texture"), Va = Symbol.for("vgpu/Texture/resizeLock");
var ds;
ds = Ua;
class $t {
  constructor(e, n, r, i = "owned") {
    x(this, "device");
    x(this, "ownership");
    x(this, ds, !0);
    x(this, "destroySignal", new Dn());
    x(this, "identity", kn("texture"));
    x(this, "currentGpu");
    x(this, "currentOptions");
    x(this, "defaultView", null);
    x(this, "resizeLock");
    x(this, "destroyed", !1);
    this.device = e, this.ownership = i, this.currentGpu = n, this.currentOptions = r, Object.defineProperty(this, Va, {
      value: (s) => {
        this.resizeLock = s;
      }
    });
  }
  get gpu() {
    return this.currentGpu;
  }
  get options() {
    return this.currentOptions;
  }
  get size() {
    return this.options.size;
  }
  get format() {
    return this.options.format;
  }
  get usage() {
    return this.options.usage;
  }
  get mipLevelCount() {
    return this.options.mipLevelCount ?? 1;
  }
  get sampleCount() {
    return this.options.sampleCount ?? 1;
  }
  get dimension() {
    return this.options.dimension ?? "2d";
  }
  get viewFormats() {
    return this.options.viewFormats ?? [];
  }
  get label() {
    return this.options.label;
  }
  get resourceIdentity() {
    return this.identity;
  }
  onDestroy(e) {
    return this.destroySignal.onDestroy(this, e);
  }
  get view() {
    return this.assertAlive(), this.defaultView ?? (this.defaultView = this.createView()), this.defaultView;
  }
  createView(e) {
    return this.assertAlive("Texture.createView"), this.gpu.createView(e);
  }
  resize(e) {
    if (this.assertAlive(), this.ownership === "external")
      throw new ae({
        code: "VGPU-CORE-EXTERNAL-TEXTURE",
        message: "Texture wraps an externally owned GPUTexture and cannot be resized.",
        where: "Texture.resize"
      });
    if (this.resizeLock)
      throw new ae({
        code: "VGPU-CORE-TEXTURE-RESIZE-LOCKED",
        message: this.resizeLock,
        where: "Texture.resize"
      });
    const n = this.options.size[2] ?? 1, r = e[2] ?? n;
    if (this.options.size[0] === e[0] && this.options.size[1] === e[1] && n === r)
      return !1;
    const i = e[2] === void 0 && this.options.size[2] === void 0 ? [e[0], e[1]] : [e[0], e[1], r], s = { ...this.options, size: i }, o = this.gpu;
    return this.currentGpu = this.device.gpu.createTexture(ms(s)), this.currentOptions = s, this.defaultView = null, o.destroy(), !0;
  }
  /**
   * Raw, unpadded texel bytes in this texture's own format (row stride padding removed).
   * `byteLength` is `width * height * bytesPerPixel(format)`; `bgra*` bytes are swizzled to RGBA order.
   * Use `readFloats()` for float formats to get decoded component values.
   */
  async read() {
    this.assertAlive("Texture.read");
    const e = vn(this.options.format, "Texture.read");
    if (Jr(this.gpu))
      return Ra(this.gpu.__vgpuMockBytes, this.options.size, e);
    const n = await this.device.readback.readTexture(this.gpu, this.options.size, this.options.format);
    return this.assertAlive("Texture.read"), n;
  }
  /**
   * Texel components decoded to f32, row-major, `width * height * components(format)` long.
   * `float16`/`float32` formats keep their HDR values (no clamping); `unorm8` formats are
   * normalized to `[0, 1]` without srgb gamma conversion.
   */
  async readFloats() {
    return vn(this.options.format, "Texture.readFloats"), Ma(await this.read(), this.options.format);
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.defaultView = null, this.destroySignal.emit(this), this.ownership !== "external" && (Jr(this.gpu) || this.gpu.destroy()));
  }
  dispose() {
    this.destroy();
  }
  assertAlive(e = "Texture") {
    var n, r;
    if (this.destroyed)
      throw new ae({ code: "VGPU-CORE-TEXTURE-DESTROYED", message: "Texture is destroyed", where: e });
    (r = (n = this.device).assertUsable) == null || r.call(n, e);
  }
}
function ms(t) {
  const e = {
    label: t.label,
    size: { width: t.size[0], height: t.size[1], depthOrArrayLayers: t.size[2] ?? 1 },
    format: t.format,
    usage: _a(t.usage)
  };
  return t.mipLevelCount !== void 0 && (e.mipLevelCount = t.mipLevelCount), t.sampleCount !== void 0 && (e.sampleCount = t.sampleCount), t.dimension !== void 0 && (e.dimension = t.dimension), t.viewFormats !== void 0 && (e.viewFormats = [...t.viewFormats]), e;
}
var J, te;
class Ba {
  constructor(e, n = null, r = "owned", i = {}) {
    T(this, J);
    x(this, "gpu");
    x(this, "adapterInfo");
    x(this, "queue");
    /** @internal — use Buffer.read() and Texture.read() instead */
    x(this, "readback");
    x(this, "isCompatibilityMode");
    x(this, "scopes", []);
    x(this, "ownership");
    x(this, "state", "alive");
    x(this, "lossInfo");
    x(this, "observeLoss", !0);
    this.gpu = e, this.adapterInfo = n, Object.defineProperty(this, "assertUsable", { value: (a) => S(this, J, te).call(this, a) }), this.ownership = typeof r == "string" ? r : "owned";
    const s = typeof r == "string" ? i : r;
    this.isCompatibilityMode = s.isCompatibilityMode ?? !1, this.queue = new Ga(e.queue, (a) => S(this, J, te).call(this, a)), this.readback = new ka(e);
    const o = e.lost;
    o && typeof o.then == "function" && Promise.resolve(o).then((a) => {
      !this.observeLoss || this.state !== "alive" || (this.lossInfo = a, this.state = "lost");
    }, () => {
    });
  }
  get limits() {
    return S(this, J, te).call(this, "Device.limits"), this.gpu.limits;
  }
  get features() {
    return S(this, J, te).call(this, "Device.features"), this.gpu.features;
  }
  createShader(e) {
    S(this, J, te).call(this, "Device.createShader");
    const n = typeof e == "string" ? Sa(e) : e;
    return new Na(this.gpu.createShaderModule({ code: n.wgsl }), n);
  }
  createTexture(e) {
    return S(this, J, te).call(this, "Device.createTexture"), new $t(this, this.gpu.createTexture(ms(e)), e);
  }
  createBuffer(e) {
    S(this, J, te).call(this, "Device.createBuffer");
    const n = za(e);
    n && this.captureError(n);
    const r = n ? Oa(Math.max(4, e.size || 4)) : Wa(e);
    return new Ae(this, this.gpu.createBuffer(r), e);
  }
  /** Wraps a caller-owned GPUBuffer without taking ownership of its native lifetime. */
  wrapBuffer(e) {
    if (S(this, J, te).call(this, "Device.wrapBuffer"), !ja(e))
      throw new ae({
        code: "VGPU-EXTERNAL-BUFFER-INVALID",
        message: "Device.wrapBuffer requires a GPUBuffer with finite size and usage properties.",
        where: "Device.wrapBuffer",
        fix: "Pass a live GPUBuffer created for this GPUDevice."
      });
    const n = {
      size: e.size,
      usage: qa(e.usage),
      ...e.label ? { label: e.label } : {}
    };
    return new Ae(this, e, n, "external");
  }
  pushErrorScope(e) {
    var n, r;
    S(this, J, te).call(this, "Device.pushErrorScope"), this.scopes.push([]), (r = (n = this.gpu).pushErrorScope) == null || r.call(n, e);
  }
  async popErrorScope() {
    var r, i;
    S(this, J, te).call(this, "Device.popErrorScope");
    const e = this.scopes.pop(), n = await ((i = (r = this.gpu).popErrorScope) == null ? void 0 : i.call(r));
    return S(this, J, te).call(this, "Device.popErrorScope"), (e == null ? void 0 : e[0]) ?? Ha(n) ?? null;
  }
  destroy() {
    if (this.state === "disposed")
      return;
    const e = this.state === "lost";
    this.state = "disposed", this.observeLoss = !1, this.scopes.length = 0, this.readback.destroy(), this.ownership === "owned" && !e && this.gpu.destroy();
  }
  dispose() {
    this.destroy();
  }
  captureError(e) {
    const n = this.scopes.at(-1);
    if (n)
      n.push(e);
    else
      throw e;
  }
}
J = new WeakSet(), te = function(e) {
  var i, s;
  if (this.state === "alive")
    return;
  if (this.state === "disposed")
    throw new ae({
      code: "VGPU-DEVICE-DISPOSED",
      message: "The GPU device wrapper has been disposed.",
      where: e,
      fix: "Create a new Gpu instance before performing more work."
    });
  const n = (i = this.lossInfo) == null ? void 0 : i.reason, r = (s = this.lossInfo) == null ? void 0 : s.message;
  throw new ae({
    code: "VGPU-DEVICE-LOST",
    message: `The GPU device was lost${n ? ` (${n})` : ""}${r ? `: ${r}` : "."}`,
    where: e,
    cause: this.lossInfo
  });
};
function za(t) {
  return !Number.isFinite(t.size) || t.size <= 0 ? ni("Buffer size must be greater than zero.") : t.usage.length === 0 ? ni("Buffer usage must not be empty.") : null;
}
function ni(t) {
  return new ae({ code: "VGPU-CORE-INVALID-USAGE", message: t, where: "Device.createBuffer" });
}
function Wa(t) {
  return { label: t.label, size: t.size, usage: Zt(t.usage) };
}
function Ha(t) {
  return t ? new ae({ code: "VGPU-CORE-VALIDATION", message: t.message, where: "GPUDevice.popErrorScope", cause: t }) : null;
}
function ja(t) {
  if (typeof t != "object" && typeof t != "function" || t === null)
    return !1;
  const e = t;
  return Number.isSafeInteger(e.size) && (e.size ?? -1) >= 0 && Number.isSafeInteger(e.usage) && (e.usage ?? -1) >= 0 && typeof e.destroy == "function";
}
const Ka = ["map_read", "map_write", "copy_src", "copy_dst", "index", "vertex", "uniform", "storage", "indirect", "query_resolve"];
function qa(t) {
  return Ka.filter((e) => (t & Zt([e])) !== 0);
}
const gs = /* @__PURE__ */ new WeakMap(), Xa = /* @__PURE__ */ new WeakMap();
function Ya(t, e) {
  return gs.set(t, Ja(e)), t;
}
function Ot(t) {
  return gs.get(t);
}
function bs(t) {
  return Xa.get(t);
}
function Ja(t) {
  return { entries: t.entries.map((e) => ({ ...e })) };
}
let I = class extends Ir {
};
function Za(t, e, n, r, i, s) {
  const o = e === "vertex" ? "Vertex" : "Fragment", a = e === "vertex" ? "VERTEX" : "FRAGMENT", c = `maxStorageBuffersIn${o}Stage`;
  return new I({
    code: `VGPU-LIMIT-STORAGE-${a}`,
    message: `${o} entry '${n}' in '${t}' uses ${r} storage buffer(s), but device limit ${c} is ${i}.`,
    fix: e === "vertex" ? `Request init({ requiredLimits: { ${c}: ${r} } }) if the adapter supports it, or move vertex data to geometry(gpu, ...) vertex streams.` : `Request init({ requiredLimits: { ${c}: ${r} } }) if the adapter supports it, or reduce fragment storage buffers.`,
    where: `${t}.pipelineLayout`,
    detail: { stage: e, entryPoint: n, count: r, limit: i, bindings: s.map(({ name: l, group: u, binding: d }) => ({ name: l, group: u, binding: d })) }
  });
}
function Qa(t, e, n, r, i) {
  return new I({
    code: "VGPU-SET-TEXTURE-FILTERABILITY",
    message: `${r} (${n}) cannot satisfy filtering texture '${e.name}' @group(${e.group}) @binding(${e.binding}).`,
    fix: "Use a filterable format; request float32-filterable for rgba32float when supported; or use textureLoad without a sampler.",
    where: `${t}.set`,
    detail: { format: n, group: e.group, binding: e.binding, bindingName: e.name, resourceName: r, samplerName: i == null ? void 0 : i.name, samplerGroup: i == null ? void 0 : i.group, samplerBinding: i == null ? void 0 : i.binding }
  });
}
function ec(t, e) {
  const n = kc(t, e);
  return new I({
    code: "VGPU-R1-BINDING-NEVER-SET",
    message: `Unset \`${e.name}\` @group(${e.group}) @binding(${e.binding}) in '${t}'. Fix: ${n}; or ${t}.group(${e.group}, bindGroup).`,
    where: `${t}.draw`
  });
}
function xs(t, e) {
  const n = e === "lib" ? "lib-owned by its first JS set()" : "user-owned by its first resource set()", r = e === "lib" ? `Fix: pass a resource from the start: wave.set({ ${t}: new Uniform(gpu.device, { size: 4 }) }).` : `Fix: pass JS values from the first set(): wave.set({ ${t}: jsValue }).`;
  return new I({
    code: "VGPU-R1-OWNERSHIP-FLIP",
    message: `\`${t}\` is ${n}; ownership cannot change. ${r}`,
    where: "set"
  });
}
function tc(t, e) {
  return new I({
    code: "VGPU-R4-GROUP-CLAIMED",
    message: `group ${e} of '${t}' is claimed; set() cannot update it.`,
    fix: `Call set() first, or build from ${t}.layout(${e}); pass dynamic offsets to p.draw().`,
    where: `${t}.set`
  });
}
function nc(t, e, n, r) {
  return new I({
    code: "VGPU-R4-GROUP-INCOMPATIBLE",
    message: `claimed group ${e} in '${t}' is incompatible: ${n}.`,
    fix: `Build from ${t}.layout(${e}, { dynamicOffsets? }) then call ${t}.group(${e}, bindGroup).`,
    where: `${t}.group`,
    cause: r
  });
}
function Et(t, e, n) {
  return new I({
    code: "VGPU-R4-GROUP-VALIDATION",
    message: `WebGPU rejected claimed group ${e} in '${t}'.`,
    fix: `Build from ${t}.layout(${e}); pass offsets via p.draw(draw, { offsets: { ${e}: [...] } }).`,
    where: `${t}.draw`,
    cause: n,
    detail: { drawLabel: t, group: e }
  });
}
function ri(t, e) {
  return new I({
    code: "VGPU-BLEND-INVALID",
    message: `Invalid blend '${String(e)}' in '${t}'.`,
    fix: 'Use "alpha", "additive", "premultiplied", or { color, alpha? } components.',
    where: "draw"
  });
}
function ii(t, e) {
  return new I({
    code: "VGPU-BLEND-CONSTANT-INVALID",
    message: `Invalid blendConstant in '${t}': ${e}`,
    fix: 'Use [r, g, b, a] finite numbers with a blend whose color or alpha uses "constant"/"one-minus-constant"; omit it to keep the pass default (0, 0, 0, 0).',
    where: "draw"
  });
}
function rc(t, e) {
  return new I({
    code: "VGPU-BUNDLE-BLEND-CONSTANT",
    message: `bundle '${t}' cannot record draw '${e}': blendConstant is render-pass state and render bundle encoders cannot set it.`,
    fix: "Encode the draw with p.draw(...) in a frame pass, or drop blendConstant from the draw.",
    where: "bundle"
  });
}
function si(t, e) {
  return new I({
    code: "VGPU-WRITEMASK-INVALID",
    message: `Invalid writeMask ${e} in '${t}'.`,
    fix: "Use an array of r/g/b/a; omit it for all channels.",
    where: "draw"
  });
}
function Jn(t, e, n = "draw") {
  return new I({
    code: "VGPU-COLORS-INVALID",
    message: `Invalid colors in '${t}': ${e}`,
    fix: "Use one { blend?, writeMask? } or null entry per color attachment of the target, aligned by index; omit colors to apply the top-level blend/writeMask to every attachment.",
    where: n
  });
}
function ic(t, e) {
  return new I({
    code: "VGPU-CULL-INVALID",
    message: `Invalid cull '${String(e)}' in '${t}'.`,
    fix: 'Use "none", "front", or "back"; omit it for no culling.',
    where: "draw"
  });
}
function sc(t, e) {
  return new I({
    code: "VGPU-FRONTFACE-INVALID",
    message: `Invalid frontFace '${String(e)}' in '${t}'.`,
    fix: 'Use "ccw" or "cw"; omit it for counter-clockwise.',
    where: "draw"
  });
}
function oi(t, e) {
  return new I({
    code: "VGPU-UNCLIPPED-DEPTH-INVALID",
    message: `Invalid unclippedDepth in '${t}': ${e}`,
    fix: 'Use a boolean. unclippedDepth: true needs the "depth-clip-control" device feature — request it with init({ requiredFeatures: ["depth-clip-control"] }) on an adapter that supports it. Omit the option to keep depth clipping.',
    where: "draw"
  });
}
function me(t, e) {
  return new I({
    code: "VGPU-DEPTH-INVALID",
    message: `Invalid depth in '${t}': ${e}`,
    fix: 'Use false or { write?, compare?, bias?, biasSlopeScale?, biasClamp? }; omit it for { write: true, compare: "less-equal" }.',
    where: "draw"
  });
}
function lt(t, e, n = "draw") {
  return new I({
    code: "VGPU-STENCIL-INVALID",
    message: `Invalid stencil in '${t}': ${e}`,
    fix: `Use { front?, back?, readMask?, writeMask?, ref? } with GPUCompareFunction/GPUStencilOperation faces and u32 masks, against a target whose depth format has a stencil aspect (depth: "depth24plus-stencil8"); omit it for WebGPU's pass-through defaults.`,
    where: n
  });
}
function oc(t, e) {
  return new I({
    code: "VGPU-BUNDLE-STENCIL-REF",
    message: `bundle '${t}' cannot record draw '${e}': stencil.ref is render-pass state and render bundle encoders cannot set it.`,
    fix: "Encode the draw with p.draw(...) in a frame pass, or drop ref from the draw's stencil.",
    where: "bundle"
  });
}
function dn(t, e, n = "draw") {
  return new I({
    code: "VGPU-MULTISAMPLE-INVALID",
    message: `Invalid multisample in '${t}': ${e}`,
    fix: "Use { alphaToCoverage?, mask? }: alphaToCoverage needs a target created with msaa: true, and mask must be an integer in [0, 0xFFFFFFFF] (bits above the target's sampleCount are ignored). Omit multisample for full-coverage defaults.",
    where: n
  });
}
function rn(t, e, n = "draw") {
  return new I({
    code: "VGPU-CONSTANTS-INVALID",
    message: `Invalid constants in '${t}': ${e}`,
    fix: "Key WGSL `override` constants by name, or by the decimal string of N when the declaration has @id(N); values are finite numbers or booleans, converted to the override's WGSL type (bool/i32/u32/f32/f16). Every override without a default value must be provided. Omit constants to keep the WGSL defaults.",
    where: n
  });
}
function fn(t, e, n = "draw") {
  return new I({
    code: "VGPU-ENTRY-INVALID",
    message: `Invalid entry in '${t}': ${e}`,
    fix: "Name an entry point declared in the shader with the matching stage — { vertex?, fragment? } strings for draw, one @compute name string for compute. Omit entry (or a field) to use the first entry point of that stage.",
    where: n
  });
}
function at(t, e, n) {
  return new I({
    code: "VGPU-INDIRECT-INVALID",
    message: `Invalid indirect in '${t}': ${e}`,
    fix: "Pass a storage buffer created with storage(gpu, bytes, { indirect: true }) — bare, or as { buffer, offset? } with a 4-aligned byte offset — sized so the GPU-read arguments fit: 16 bytes for drawIndirect, 20 for drawIndexedIndirect, 12 for dispatchWorkgroupsIndirect. Omit indirect to use CPU-side counts.",
    where: n
  });
}
function ac() {
  return new I({
    code: "VGPU-PASS-PRESERVE-MSAA",
    message: "clear:false cannot preserve MSAA; use a non-MSAA target.",
    fix: "Use non-MSAA for accumulation.",
    where: "Frame.pass"
  });
}
function ai(t, e = "expected a number in [0, 1].", n = 'Use 1 (default), or 0 with depth: { compare: "greater" } for reversed-Z.') {
  return new I({
    code: "VGPU-PASS-CLEARDEPTH-INVALID",
    message: `clearDepth received ${String(t)}; ${e}`,
    fix: n,
    where: "Frame.pass"
  });
}
function ge(t) {
  return new I({
    code: "VGPU-PASS-VIEWPORT-INVALID",
    message: `Invalid viewport: ${t}`,
    fix: "Use { x?, y?, width, height, minDepth?, maxDepth? } finite numbers within device limits; omit it for the full target.",
    where: "Frame.pass"
  });
}
function Nn(t) {
  return new I({
    code: "VGPU-PASS-SCISSOR-INVALID",
    message: `Invalid scissor: ${t}`,
    fix: "Use [x, y, width, height] non-negative integers with x + width and y + height within the target's current pixel size; omit it for the full target.",
    where: "Frame.pass"
  });
}
function cc() {
  return new I({
    code: "VGPU-PASS-PRESERVE-CLEARDEPTH",
    message: "clear:false preserves depth; clearDepth cannot apply.",
    fix: "Remove clearDepth, or let the pass clear.",
    where: "Frame.pass"
  });
}
function ci(t) {
  return new I({
    code: "VGPU-PASS-CLEARSTENCIL-INVALID",
    message: `clearStencil ${t}`,
    fix: `Use an integer in [0, 0xFFFFFFFF] on a target whose depth format has a stencil aspect, e.g. depth: "depth24plus-stencil8"; the value is masked to the stencil aspect's bit width.`,
    where: "Frame.pass"
  });
}
function lc() {
  return new I({
    code: "VGPU-PASS-PRESERVE-CLEARSTENCIL",
    message: "clear:false preserves stencil; clearStencil cannot apply.",
    fix: "Remove clearStencil, or let the pass clear.",
    where: "Frame.pass"
  });
}
function Be(t, e, n = "Frame.pass") {
  return new I({
    code: "VGPU-PASS-DEPTH-READONLY",
    message: `depthReadOnly ${t}`,
    fix: e,
    where: n
  });
}
function uc() {
  return new I({
    code: "VGPU-PASS-DEPTH-READONLY-MSAA",
    message: `depthReadOnly cannot read an MSAA target's depth: multisampled depth is stored with storeOp "discard", so a read-only pass tests against discarded contents.`,
    fix: "Use a non-MSAA target for read-only depth, or drop depthReadOnly and let the pass own its depth.",
    where: "Frame.pass"
  });
}
function dc(t, e, n = "timer") {
  return new I({
    code: "VGPU-TIMER-INVALID",
    message: `Invalid timer use: ${t}`,
    fix: e,
    where: n
  });
}
function fc(t, e, n = "visibility") {
  return new I({
    code: "VGPU-VIS-INVALID",
    message: `Invalid visibility use: ${t}`,
    fix: e,
    where: n
  });
}
function hc() {
  return new I({
    code: "VGPU-QUERY-NO-VISIBILITY",
    message: "occlusion() needs the pass to be opened with a visibility instance; the render pass has no occlusionQuerySet to write into.",
    fix: "Open the pass with f.pass({ target, visibility: vis }, ...) using the visibility(gpu) instance that created the query handle.",
    where: "FramePass.occlusion"
  });
}
function pc() {
  return new I({
    code: "VGPU-QUERY-NESTED",
    message: "occlusion() cannot nest inside an active occlusion() body; WebGPU allows one active occlusion query per pass at a time.",
    fix: "Encode each occlusion scope sequentially: p.occlusion(a, ...); p.occlusion(b, ...).",
    where: "FramePass.occlusion"
  });
}
function Zn(t = "Frame.pass") {
  return new I({
    code: "VGPU-TARGET-REQUIRED",
    message: "Target required. Fix: pass surface(gpu, canvas) or target(gpu, { size }) as { target }.",
    where: t
  });
}
function pe(t, e, n, r) {
  return new I({ code: t, message: `${t}: ${n}`, fix: r, where: e });
}
function K(t, e) {
  return pe("VGPU-MESH-LAYOUT-INVALID", t, e, "Fix attributes/formats/offsets; use non-numeric names and 4-aligned stride <= 2048.");
}
function li(t, e) {
  return pe("VGPU-MESH-LIMIT-EXCEEDED", t, e, "Use <= 8 buffers and <= 16 attributes (or the device limits).");
}
function ui(t, e) {
  return pe("VGPU-MESH-LOCATION-CONFLICT", t, `Duplicate geometry @location(${e}).`, "Use unique locations, or omit them for name matching.");
}
function ws(t, e) {
  return pe("VGPU-MESH-DATA-MISALIGNED", t, e, "Fix: repack data, set matching stride, or give raw buffers an explicit count.");
}
function At(t, e) {
  return pe("VGPU-MESH-RANGE-INVALID", t, e, "Use index ranges for indexed geometries, vertex ranges otherwise, within geometry counts.");
}
function ut(t, e) {
  return pe("VGPU-MESH-WRITE-RANGE", t, e, "Write within the buffer byteLength, or create a larger geometry.");
}
function mc(t, e, n = []) {
  return pe("VGPU-MESH-ATTRIBUTE-UNMATCHED", t, `Geometry attribute '${e}' has no shader input.`, `Use shader name${n.length ? ` (${n.join(",")})` : ""} or { location:n }.`);
}
function gc(t, e, n) {
  return pe("VGPU-MESH-ATTRIBUTE-UNMATCHED", t, `Geometry attribute '${e}' matches locations ${n.join(",")}.`, "Rename inputs or set { location:n }.");
}
function bc(t, e, n = []) {
  return pe("VGPU-MESH-INPUT-MISSING", t, `Geometry lacks shader input '${e}'.`, `Add/remove it. Geometry attributes: ${n.join(",") || "none"}.`);
}
function xc(t, e, n, r) {
  return pe("VGPU-MESH-FORMAT-MISMATCH", t, `Attribute '${e}' ${n} != shader ${r}.`, "Match the float/sint/uint shader base type; widths may differ.");
}
function wc(t) {
  return new I({
    code: "VGPU-PIPELINE-LAYOUT-GAP",
    message: `Pipeline bind group ${t} is missing.`,
    fix: "Use consecutive @group() indices starting at 0.",
    where: "pipeline layout"
  });
}
function Lt(t, e, n) {
  return new I({
    code: "VGPU-COMPILE-FAILED",
    message: "WebGPU pipeline compilation failed.",
    fix: "Check WGSL, vertex layouts, and target signature.",
    where: t,
    cause: e,
    detail: n ? { signature: n } : void 0
  });
}
function di(t) {
  return new I({
    code: "VGPU-COMPILE-DISPOSED",
    message: "GPU disposed during pipeline compilation.",
    where: t
  });
}
function sn(t, e) {
  return new I({
    code: "VGPU-COMPILE-SIGNATURE-INVALID",
    message: `Invalid TargetSignature: ${e}`,
    fix: "Pass { colors, depth?, sampleCount?:1|4 } or a Target.",
    where: t
  });
}
function _c(t) {
  return new I({
    code: "VGPU-TARGET-DEPTH-STENCIL-ONLY",
    message: `depth received '${t}'; stencil-only depth targets are not supported yet.`,
    fix: 'Use a format with a depth aspect such as "depth24plus" or "depth24plus-stencil8".',
    where: "target"
  });
}
function _s() {
  return new I({
    code: "VGPU-TARGET-SIZE-REQUIRED",
    message: "Target size required. Fix: target(gpu, { size: [w,h] }); update surface-derived targets in onResize.",
    where: "target"
  });
}
function $r(t) {
  return new I({
    code: "VGPU-SURFACE-NOT-IN-FRAME",
    message: "Surface targets are only available inside frame(gpu).",
    fix: "surface passes must run inside frame(gpu, ...); precompile against an offscreen target(gpu, ...) instead",
    where: t
  });
}
function yc() {
  return new I({
    code: "VGPU-SURFACE-CONTEXT",
    message: "Canvas WebGPU context failed. Fix: check navigator.gpu and remove any existing 2d/webgl context.",
    where: "surface"
  });
}
function vc(t) {
  return new I({
    code: "VGPU-SURFACE-DUPLICATE",
    message: `Canvas already has surface${t ? ` '${t}'` : ""}. Fix: reuse or dispose it.`,
    where: "surface"
  });
}
function Sc(t) {
  return new I({
    code: "VGPU-SURFACE-DISPOSED",
    message: `Surface '${t ?? "surface"}' is disposed. Fix: call surface(gpu, canvas).`,
    where: "surface"
  });
}
function Ec() {
  return new I({
    code: "VGPU-SURFACE-AUTORESIZE-UNSUPPORTED",
    message: "autoResize needs clientWidth. Fix: call surface.resize([w,h]) for OffscreenCanvas; onResize still fires.",
    where: "surface"
  });
}
function Ac(t) {
  return new I({
    code: "VGPU-SURFACE-RESIZE-REENTRANT",
    message: `Cannot resize this surface${t ? ` '${t}'` : ""} in onResize. Fix: resize derived targets only.`,
    where: "surface.resize"
  });
}
function Ic(t) {
  return new I({
    code: "VGPU-CLEAR-COLOR-INVALID",
    message: `Invalid ${t}: expected four finite numbers.`,
    fix: "Assign [r, g, b, a] or a GPUColor object ({ r, g, b, a }).",
    where: t
  });
}
function $c(t) {
  return new I({
    code: "VGPU-CLOCK-DELTA-INVALID",
    message: `clock.advance() received ${String(t)}; expected a finite, non-negative number of seconds.`,
    fix: "Pass the elapsed seconds, e.g. clock(gpu).advance(1 / 60); use frame(gpu) alone to advance with wall-clock time.",
    where: "clock.advance"
  });
}
function ys() {
  return new I({
    code: "VGPU-FRAME-REENTRANT",
    message: "Nested frame(gpu) is invalid. Fix: queue work for the next frame.",
    where: "frame"
  });
}
function fi(t) {
  return new I({
    code: "VGPU-FRAME-CANCELED",
    message: "the frame was canceled; its command encoder was dropped and nothing more can be encoded or submitted on it.",
    fix: "Open a new frame(gpu) for further work; cancel() is the last operation on a frame.",
    where: t
  });
}
function Cc(t) {
  return new I({
    code: "VGPU-FRAME-PASS-ACTIVE",
    message: "the frame cannot be canceled while a pass callback is active.",
    fix: "Return from the frame.pass(...) callback first, then call frame.cancel(); this keeps pass descriptor resources alive until the pass is closed.",
    where: t
  });
}
function Tc(t) {
  return new I({
    code: "VGPU-FRAME-SUBMITTED",
    message: "the frame was already submitted; submitted GPU work cannot be canceled.",
    fix: "Call cancel() only on a frame you decided not to submit; the frame you did submit needs no cleanup.",
    where: t
  });
}
function Ee(t, e, n) {
  return new I({
    code: "VGPU-R1-BINDING-INCOMPATIBLE-RESOURCE",
    message: `binding \`${t.name}\` @group(${t.group}) @binding(${t.binding}) needs ${e}.`,
    fix: n,
    where: "set"
  });
}
function oe(t, e, n) {
  return new I({ code: "VGPU-RING1-UNSUPPORTED", message: e, fix: n, where: t });
}
function on(t) {
  return Lc(t) && t.version !== 1 ? new I({
    code: "VGPU-SHADER-SOURCE-INVALID",
    message: `VGPU-SHADER-SOURCE-INVALID: unsupported ShaderSource v${String(t.version)}; expected v1. Fix: update vgpu or regenerate it.`,
    where: "shader source"
  }) : new I({
    code: "VGPU-SHADER-SOURCE-INVALID",
    message: `VGPU-SHADER-SOURCE-INVALID: expected WGSL or { version, wgsl }, got ${Fc(t)}. Fix: configure @vgpu/wgsl loader-vite or loader-webpack.`,
    where: "shader source"
  });
}
function Lc(t) {
  return typeof t == "object" && t !== null && "version" in t;
}
function Fc(t) {
  if (typeof t != "object" || t === null)
    return typeof t;
  try {
    const e = JSON.stringify(t);
    return e.length > 80 ? `${e.slice(0, 77)}...` : e;
  } catch {
    return "object";
  }
}
function kc(t, e) {
  switch (e.kind) {
    case "sampler":
      return `${t}.set({${e.name}:sampler(gpu)})`;
    case "texture":
      return `${t}.set({${e.name}:scene.color})`;
    case "buffer":
      return e.addressSpace === "uniform" ? `${t}.set({${e.name}:{ /* values */ }})` : `${t}.set({${e.name}:buffer})`;
    default:
      return `${t}.set({${e.name}:resource})`;
  }
}
const hi = ["scheduler", "resource", "service"];
function Qt(t) {
  return { name: t };
}
const vs = /* @__PURE__ */ new WeakMap();
function Dc(t) {
  const e = vs.get(t);
  if (!e)
    throw new I({
      code: "VGPU-GPU-FOREIGN",
      message: "This object was not created by init(); it has no vgpu kernel.",
      fix: "Pass the gpu returned by init() from vgpu, vgpu/node or vgpu/mock.",
      where: "gpu"
    });
  return e;
}
var He, Ht, je, ft, Ke, qe;
class Mc {
  constructor(e) {
    x(this, "device");
    T(this, He, /* @__PURE__ */ new Map());
    T(this, Ht, new Map(hi.map((e) => [e, /* @__PURE__ */ new Set()])));
    T(this, je, /* @__PURE__ */ new Set());
    T(this, ft, /* @__PURE__ */ new Set());
    T(this, Ke, /* @__PURE__ */ new Set());
    T(this, qe, !1);
    this.device = e;
  }
  get disposed() {
    return p(this, qe);
  }
  service(e, n) {
    const r = p(this, He).get(e);
    if (r !== void 0)
      return r;
    const i = n(this);
    return p(this, He).set(e, i), i;
  }
  peekService(e) {
    return p(this, He).get(e);
  }
  own(e, n) {
    const r = p(this, Ht).get(e);
    return r.add(n), () => {
      r.delete(n);
    };
  }
  addErrorListener(e) {
    return p(this, je).add(e), () => {
      p(this, je).delete(e);
    };
  }
  reportError(e) {
    if (p(this, qe))
      return Promise.resolve();
    const n = Promise.resolve().then(() => {
      const r = [...p(this, je)];
      if (!r.length) {
        console.error(e);
        return;
      }
      for (const i of r)
        try {
          i(e);
        } catch (s) {
          console.error(s);
        }
    });
    return this.trackDelivery(n);
  }
  trackDelivery(e) {
    const n = Promise.resolve(e).then(() => {
    }, (r) => {
      console.error(r);
    });
    return p(this, ft).add(n), n.finally(() => p(this, ft).delete(n)), n;
  }
  registerSettledSource(e) {
    return p(this, Ke).add(e), () => {
      p(this, Ke).delete(e);
    };
  }
  async settled() {
    const e = [
      ...p(this, ft),
      ...[...p(this, Ke)].flatMap((n) => n())
    ];
    await Promise.allSettled(e);
  }
  dispose() {
    if (!p(this, qe)) {
      M(this, qe, !0);
      for (const e of hi) {
        const n = p(this, Ht).get(e);
        for (const r of [...n])
          r();
        n.clear();
      }
      p(this, He).clear(), p(this, Ke).clear(), p(this, je).clear(), this.device.dispose();
    }
  }
}
He = new WeakMap(), Ht = new WeakMap(), je = new WeakMap(), ft = new WeakMap(), Ke = new WeakMap(), qe = new WeakMap();
function Pc(t) {
  const e = new Mc(t), n = {
    device: t,
    gpu: t.gpu,
    get disposed() {
      return e.disposed;
    },
    onError: (r) => e.addErrorListener(r),
    settled: () => e.settled(),
    dispose: () => {
      e.dispose();
    }
  };
  return vs.set(n, e), n;
}
async function qp(t, e = {}, n) {
  return Pc(await Rc(t, e, n));
}
async function Rc(t, e, n) {
  return e.adapter || n ? (e.adapter ?? n()).requestDevice(e) : Oc(e);
}
async function Oc(t) {
  var i;
  const n = await ((i = globalThis.navigator.gpu) == null ? void 0 : i.requestAdapter({ powerPreference: t.powerPreference }));
  if (!n)
    throw oe("init", "navigator.gpu.requestAdapter() returned null.");
  ga(n.features, t.requiredFeatures);
  const r = await n.requestDevice({ requiredFeatures: t.requiredFeatures, requiredLimits: t.requiredLimits });
  return new Ba(r, n.info ?? null);
}
function H(t, e) {
  t.assertUsable(e);
}
function pi(t, e) {
  t.assertUsable(e);
}
const Ss = Symbol("vgpu.bindingResource");
function Gc(t) {
  return typeof (typeof t == "object" && t !== null ? t[Ss] : void 0) == "function" ? t : void 0;
}
const It = Symbol("vgpu.geometry.layoutResolver");
function Ie(t, e) {
  const n = Dc(t);
  if (n.disposed)
    throw Es(e);
  return n;
}
function Es(t) {
  return new I({
    code: "VGPU-GPU-DISPOSED",
    message: `${t}() ran after gpu.dispose(); the device and everything it owned are gone.`,
    fix: "Create resources before disposing the gpu, or init() a new one.",
    where: t
  });
}
function As(t, e, n, r) {
  const i = t.own("resource", () => n(e));
  return r == null || r(i), e;
}
var Xe, ht, pt, jt, Ye, De;
class Nc {
  constructor(e, n) {
    x(this, "vertexCount");
    x(this, "indexCount");
    x(this, "instanceCount");
    x(this, "vertexBuffers");
    x(this, "indexBuffer");
    x(this, "indexFormat");
    x(this, "vertexBufferLayouts");
    x(this, "topology");
    x(this, "stripIndexFormat");
    x(this, "buffers");
    T(this, Xe);
    T(this, ht);
    T(this, pt);
    T(this, jt, /* @__PURE__ */ new Map());
    T(this, Ye, /* @__PURE__ */ new Set());
    T(this, De, !1);
    const r = "geometry";
    if (n.buffers.length > 8)
      throw li(r, `${n.buffers.length} vertex buffers exceed limit 8.`);
    let i = 0;
    const s = /* @__PURE__ */ new Set(), o = n.buffers.map((f, h) => {
      const g = Hc(e, f, `${r}.buffers[${h}]`);
      i += g.attributes.length;
      for (const w of g.attributes)
        if (w.location !== void 0) {
          if (s.has(w.location))
            throw ui(`${r}.buffers[${h}]`, w.location);
          s.add(w.location);
        }
      return g;
    }), a = e.gpu.limits.maxVertexAttributes;
    if (i > a)
      throw li(r, `${i} attributes exceed device limit ${a}.`);
    const c = n.topology ?? "triangle-list";
    if (!qc.has(c))
      throw K(r, `Invalid topology: ${String(c)}.`);
    const l = jc(e, n, r), u = gi(o, "vertex"), d = gi(o, "instance");
    bi(o, "vertex", n.vertexCount ?? u, r), bi(o, "instance", n.instanceCount ?? d, r), Un(r, "vertexCount", n.vertexCount, u), Un(r, "instanceCount", n.instanceCount, d), Un(r, "indexCount", n.indexCount, l.count), this.topology = c, this.stripIndexFormat = c.endsWith("strip") ? l.format : void 0, M(this, pt, o), this.vertexBufferLayouts = Object.freeze(o.map((f) => f.layout)), this.vertexBuffers = Object.freeze(o.map((f) => f.gpu)), this.buffers = Object.freeze(o.map((f, h) => new Uc(`${r}.buffers[${h}]`, f))), this.vertexCount = n.vertexCount ?? u, this.instanceCount = n.instanceCount ?? d, this.indexBuffer = l.gpu, this.indexFormat = l.format, this.indexCount = n.indexCount ?? l.count, M(this, Xe, l.owned), M(this, ht, l.byteLength), Kc(this);
  }
  /** @internal Resolves named attributes for one reflected vertex entry point. */
  [It](e, n) {
    if (p(this, De))
      throw K(n, "Geometry is destroyed; create a live geometry.");
    const r = e.map((l) => `${l.name}:${l.location}:${hn(l.type)}`).join("|"), i = p(this, jt).get(r);
    if (i)
      return i;
    const s = /* @__PURE__ */ new Set(), o = p(this, pt).flatMap((l) => l.attributes.map((u) => u.name)), a = p(this, pt).map((l) => {
      const u = [...l.layout.attributes], d = l.attributes.map((f, h) => {
        const g = f.location === void 0 ? e.filter((_) => _.name === f.name) : [];
        if (f.location === void 0 && g.length === 0)
          throw mc(n, f.name, e.map((_) => _.name));
        if (g.length > 1)
          throw gc(n, f.name, g.map((_) => _.location));
        const w = f.location ?? g[0].location;
        if (s.has(w))
          throw ui(n, w);
        s.add(w);
        const b = e.find((_) => _.location === w);
        if (b && Jc(f.format) !== hn(b.type))
          throw xc(n, f.name, f.format, hn(b.type));
        return Object.freeze({ ...u[h], shaderLocation: w });
      });
      return Object.freeze({ arrayStride: l.layout.arrayStride, ...l.layout.stepMode ? { stepMode: l.layout.stepMode } : {}, attributes: Object.freeze(d) });
    });
    for (const l of e)
      if (!s.has(l.location))
        throw bc(n, l.name, o);
    const c = Object.freeze(a);
    return p(this, jt).set(r, c), c;
  }
  /** Creates a frozen range view sharing this geometry's buffers and layout identity. */
  slice(e = {}) {
    return new Vc(this, e);
  }
  /** Updates bytes in vertex buffer stream 0 without resizing it. */
  write(e, n = 0) {
    const r = this.buffers[0];
    if (!r)
      throw ut("geometry.write", "No vertex buffer 0; add one before writing.");
    r.write(e, n);
  }
  /** Updates bytes in the owned index buffer without resizing it. */
  writeIndices(e, n = 0) {
    if (p(this, De))
      throw ut("geometry.writeIndices", "Geometry is destroyed; create a new geometry before writing.");
    if (!p(this, Xe) || p(this, ht) === void 0)
      throw ut("geometry.writeIndices", "No owned index buffer; write caller-owned buffers directly.");
    $s("geometry.writeIndices", p(this, ht), e.byteLength, n), p(this, Xe).write(e, n);
  }
  /** Destroys buffers owned by this geometry; caller-owned buffers are untouched. */
  destroy() {
    var e;
    if (!p(this, De)) {
      M(this, De, !0);
      for (const n of this.buffers)
        n.destroyOwned();
      (e = p(this, Xe)) == null || e.destroy();
      for (const n of [...p(this, Ye)])
        n();
      p(this, Ye).clear();
    }
  }
  /**
   * @internal Ownership hook: runs once, right after `destroy()` freed the buffers, so the owner
   * that registered this geometry with the kernel can drop its teardown registration.
   */
  onDestroy(e) {
    return p(this, De) ? (e(), () => {
    }) : (p(this, Ye).add(e), () => {
      p(this, Ye).delete(e);
    });
  }
}
Xe = new WeakMap(), ht = new WeakMap(), pt = new WeakMap(), jt = new WeakMap(), Ye = new WeakMap(), De = new WeakMap();
var Kt;
class Uc {
  constructor(e, n) {
    x(this, "where");
    x(this, "inner");
    x(this, "gpu");
    x(this, "stride");
    x(this, "stepMode");
    T(this, Kt, { destroyed: !1 });
    this.where = e, this.inner = n, this.gpu = n.gpu, this.stride = n.stride, this.stepMode = n.stepMode, Object.freeze(this);
  }
  write(e, n = 0) {
    if (p(this, Kt).destroyed)
      throw ut(this.where, "Geometry is destroyed; create a new geometry before writing.");
    if (!this.inner.owned || this.inner.byteLength === void 0)
      throw ut(this.where, "Caller-owned buffer; write it directly.");
    $s(this.where, this.inner.byteLength, Is(e), n), this.inner.owned.write(e, n);
  }
  destroyOwned() {
    var e;
    p(this, Kt).destroyed = !0, (e = this.inner.owned) == null || e.destroy();
  }
}
Kt = new WeakMap();
class Vc {
  constructor(e, n) {
    x(this, "geometry");
    x(this, "vertexCount");
    x(this, "indexCount");
    x(this, "instanceCount");
    x(this, "vertexBuffers");
    x(this, "indexBuffer");
    x(this, "indexFormat");
    x(this, "vertexBufferLayouts");
    x(this, "topology");
    x(this, "stripIndexFormat");
    x(this, "firstIndex");
    x(this, "baseVertex");
    x(this, "firstVertex");
    if (this.geometry = e, this.vertexBuffers = e.vertexBuffers, this.indexBuffer = e.indexBuffer, this.indexFormat = e.indexFormat, this.vertexBufferLayouts = e.vertexBufferLayouts, this.topology = e.topology, this.stripIndexFormat = e.stripIndexFormat, e.indexBuffer) {
      if (n.firstVertex !== void 0 || n.vertexCount !== void 0)
        throw At("geometry.slice", "Indexed slice needs firstIndex/indexCount/baseVertex; omit vertex range fields.");
      const r = n.firstIndex ?? 0, i = e.indexCount ?? 0, s = n.indexCount ?? i - r;
      ke("geometry.slice", "firstIndex", r, i), ke("geometry.slice", "indexCount", s, i - r), ke("geometry.slice", "baseVertex", n.baseVertex ?? 0, Number.MAX_SAFE_INTEGER), this.firstIndex = r, this.indexCount = s, this.baseVertex = n.baseVertex ?? 0, this.vertexCount = e.vertexCount;
    } else {
      if (n.firstIndex !== void 0 || n.indexCount !== void 0 || n.baseVertex !== void 0)
        throw At("geometry.slice", "Non-indexed slice needs firstVertex/vertexCount; omit index range fields.");
      const r = n.firstVertex ?? 0, i = e.vertexCount ?? 0, s = n.vertexCount ?? i - r;
      ke("geometry.slice", "firstVertex", r, i), ke("geometry.slice", "vertexCount", s, i - r), this.firstVertex = r, this.vertexCount = s, this.indexCount = e.indexCount;
    }
    ke("geometry.slice", "instanceCount", n.instanceCount ?? e.instanceCount ?? 0, Number.MAX_SAFE_INTEGER), this.instanceCount = n.instanceCount ?? e.instanceCount, Object.freeze(this);
  }
  [It](e, n) {
    return this.geometry[It](e, n);
  }
}
function Bc(t, e) {
  const n = Ie(t, "geometry"), r = zc(e) ? e.build(n.device) : e;
  return Wc(n, new Nc(n.device, r));
}
function zc(t) {
  return "build" in t && typeof t.build == "function";
}
function Wc(t, e) {
  return As(t, e, (n) => n.destroy(), (n) => {
    e.onDestroy(n);
  });
}
function mi(t) {
  if (t === "unorm10-10-10-2" || t === "unorm8x4-bgra")
    return 4;
  const e = /^(float|uint|sint|unorm|snorm)(8|16|32)(?:x([234]))?$/.exec(t);
  if (!e)
    return 0;
  const [, n, r, i] = e;
  return (r === "32" ? /norm/.test(n) : !i || i === "3" || r === "8" && n === "float") ? 0 : Number(r) / 8 * Number(i ?? 1);
}
function Hc(t, e, n) {
  var d;
  if (e.data !== void 0 && e.buffer !== void 0)
    throw K(n, "Choose data or buffer, not both.");
  const r = e.stepMode ?? "vertex";
  if (r !== "vertex" && r !== "instance")
    throw K(n, `Invalid stepMode: ${String(r)}.`);
  const i = [], s = [];
  let o = 0;
  for (const [f, h] of Object.entries(e.attributes)) {
    if (/^\d+$/.test(f))
      throw K(n, `Attribute '${f}' is numeric; use a non-numeric name.`);
    const g = typeof h == "string" ? { format: h } : h, w = mi(g.format);
    if (!w)
      throw K(n, `Unknown GPUVertexFormat '${g.format}'.`);
    const b = g.offset ?? o, _ = Math.min(4, w);
    if (!Number.isInteger(b) || b < 0 || b % _ !== 0)
      throw K(n, `Attribute '${f}' offset ${String(b)} needs ${_}-byte alignment.`);
    if (g.location !== void 0 && (!Number.isInteger(g.location) || g.location < 0 || g.location >= t.gpu.limits.maxVertexAttributes))
      throw K(n, `Location ${String(g.location)} for '${f}' is outside limit ${t.gpu.limits.maxVertexAttributes}.`);
    i.push({ shaderLocation: g.location ?? i.length, offset: b, format: g.format }), s.push({ name: f, format: g.format, location: g.location }), o += w;
  }
  const a = e.stride ?? Yc(o);
  if (!Number.isInteger(a) || a <= 0 || a > 2048 || a % 4 !== 0)
    throw K(n, `Stride ${String(a)} must be 4-aligned in [4,2048].`);
  for (const [f, h] of i.entries()) {
    const g = mi(h.format);
    if (h.offset + g > a)
      throw K(n, `Attribute '${(d = s[f]) == null ? void 0 : d.name}' (${h.offset}+${g}) exceeds stride ${a}.`);
  }
  const c = e.data ? Is(e.data) : void 0;
  if (c !== void 0 && c % a !== 0)
    throw ws(n, `Data byteLength ${c} is not divisible by stride ${a}.`);
  const l = e.data !== void 0 ? t.createBuffer({ label: e.label, size: Math.max(4, c ?? 0), usage: ["vertex", "copy_dst"] }) : void 0;
  return l && e.data && l.write(e.data), { layout: Object.freeze({ arrayStride: a, ...e.stepMode ? { stepMode: r } : {}, attributes: Object.freeze(i) }), attributes: Object.freeze(s), stride: a, stepMode: r, byteLength: c, gpu: (l == null ? void 0 : l.gpu) ?? Xc(e.buffer, n), owned: l };
}
function jc(t, e, n) {
  if (e.indices !== void 0 && e.indexBuffer !== void 0)
    throw K(n, "Choose indices or indexBuffer, not both.");
  if (e.indices === void 0) {
    const c = [e.indexBuffer, e.indexFormat, e.indexCount].filter((l) => l !== void 0).length;
    if (c !== 0 && c !== 3)
      throw K(n, "Provide indexBuffer, indexFormat, and indexCount together.");
    if (e.indexFormat !== void 0 && e.indexFormat !== "uint16" && e.indexFormat !== "uint32")
      throw K(n, `Unknown index format '${String(e.indexFormat)}'.`);
    return e.indexCount !== void 0 && ke(n, "indexCount", e.indexCount, Number.MAX_SAFE_INTEGER), { gpu: e.indexBuffer, format: e.indexFormat, count: e.indexCount };
  }
  if (e.indexFormat !== void 0)
    throw K(n, "indices infer format; omit indexFormat.");
  const r = Array.isArray(e.indices) ? new Uint32Array(e.indices) : e.indices, i = r instanceof Uint16Array ? "uint16" : "uint32", s = r.byteLength;
  if (s % (i === "uint16" ? 2 : 4) !== 0)
    throw ws(n, `Index byteLength ${s} is invalid for ${i}.`);
  const o = t.createBuffer({ label: e.label ? `${e.label}.indices` : void 0, size: Math.max(4, s), usage: ["index", "copy_dst"] });
  return o.write(r), { gpu: o.gpu, owned: o, format: i, count: r.length, byteLength: s };
}
function gi(t, e) {
  let n;
  for (const r of t)
    r.stepMode === e && r.byteLength !== void 0 && (n = Math.min(n ?? 1 / 0, Math.floor(r.byteLength / r.stride)));
  return n;
}
function bi(t, e, n, r) {
  if (n === void 0 && t.some((i) => i.stepMode === e && i.byteLength === void 0))
    throw K(r, `Raw ${e} buffer needs ${e}Count.`);
}
function Un(t, e, n, r) {
  n !== void 0 && ke(t, e, n, r ?? Number.MAX_SAFE_INTEGER);
}
function Kc(t) {
  for (const e of Object.keys(t))
    e !== "destroyed" && Object.defineProperty(t, e, { writable: !1, configurable: !1 });
}
const qc = /* @__PURE__ */ new Set(["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"]);
function Xc(t, e) {
  if (!t)
    throw K(e, "Provide geometry buffer data or buffer.");
  return t;
}
function Is(t) {
  return t.byteLength;
}
function Yc(t) {
  return t + 3 & -4;
}
function $s(t, e, n, r) {
  if (!Number.isInteger(r) || r < 0 || r % 4 !== 0 || n % 4 !== 0 || r + n > e)
    throw ut(t, `Write size ${n}/offset ${String(r)} must be 4-aligned within ${e} bytes.`);
}
function ke(t, e, n, r) {
  if (!Number.isInteger(n) || n < 0 || n > r)
    throw At(t, `${e}=${String(n)} must be an integer in [0,${r}].`);
}
function Jc(t) {
  return t.startsWith("sint") ? "i32" : t.startsWith("uint") ? "u32" : "f32";
}
function hn(t) {
  return t.kind === "scalar" ? t.name : t.kind === "vector" || t.kind === "matrix" || t.kind === "atomic" ? hn(t.element) : t.kind;
}
class Zc {
  constructor(e) {
    x(this, "gpu");
    this.gpu = e;
  }
  setPipeline(e) {
    this.gpu.setPipeline(e);
  }
  setBindGroup(e, n, r) {
    this.gpu.setBindGroup(e, n, r);
  }
  setVertexBuffer(e, n, r = 0, i) {
    this.gpu.setVertexBuffer(e, el(n), r, i);
  }
  draw(e, n = 1, r = 0, i = 0) {
    if (typeof e == "number") {
      this.gpu.draw(e, n, r, i);
      return;
    }
    this.gpu.draw(e.vertexCount, e.instanceCount ?? 1, e.firstVertex ?? 0, e.firstInstance ?? 0);
  }
}
function Qc(t, e) {
  const n = t.gpu.createRenderBundleEncoder({
    label: e.label,
    colorFormats: e.colorFormats,
    depthStencilFormat: e.depthStencilFormat,
    sampleCount: e.sampleCount,
    depthReadOnly: e.depthReadOnly,
    stencilReadOnly: e.stencilReadOnly
  });
  return e.record(new Zc(n)), n.finish({ label: e.label });
}
function el(t) {
  return t instanceof Ae ? t.gpu : t;
}
class Cs extends Error {
  constructor(n, r, i = 1, s = 1, o = "error") {
    super(r);
    x(this, "code");
    x(this, "line");
    x(this, "column");
    x(this, "severity");
    x(this, "metadata");
    x(this, "relatedDiagnostics");
    /** Actionable remediation text. Forwarded verbatim from the underlying error when there is one. */
    x(this, "fix");
    /** Coarse origin of the failure (e.g. `"resolveShader"`), mirroring `@vgpu/core`'s `VGPUError`. */
    x(this, "where");
    x(this, "cause");
    this.name = "VGPUError", this.code = n, this.line = i, this.column = s, this.severity = o;
  }
}
function tl(t, e, n = {}) {
  const r = new Cs(t, e, n.line ?? 1, n.column ?? 1, n.severity ?? "error");
  return n.fix !== void 0 && (r.fix = n.fix), n.where !== void 0 && (r.where = n.where), n.cause !== void 0 && (r.cause = n.cause), n.metadata !== void 0 && (r.metadata = n.metadata), r;
}
function B(t, e, n = 1, r = 1) {
  return new Cs(t, e, n, r);
}
const nl = /* @__PURE__ */ new Set(["fn", "struct", "const", "alias", "var", "override"]);
function rl(t) {
  var a, c, l, u;
  const e = [], n = [], r = [];
  let i = 0, s = !1, o = 0;
  for (; i < t.length; ) {
    const d = t[i];
    if (d.text === "{") {
      o++, i++;
      continue;
    }
    if (d.text === "}") {
      o = Math.max(0, o - 1), i++;
      continue;
    }
    if (Cr(d)) {
      i++;
      continue;
    }
    if (o > 0) {
      i++;
      continue;
    }
    if (d.text === "import") {
      if (s)
        throw B("VGPU-WGSL-IMP-ORDER", "Imports must precede declarations", d.line, d.column);
      const [w, b] = il(t, i);
      e.push(w), i = b;
      continue;
    }
    if (d.text === "export" && ((a = t[i + 1]) == null ? void 0 : a.text) === "{")
      throw B("VGPU-WGSL-EXP-REEXPORT-CYCLE", "Re-export cycles are not supported", d.line, d.column);
    if (d.text === "@" && ((c = t[i + 2]) == null ? void 0 : c.text) === "export" && ((l = t[i + 3]) == null ? void 0 : l.text) === "@")
      throw B("VGPU-WGSL-EXP-NOTDECL", "Repeated export attributes", d.line, d.column);
    const f = d.text === "export" || d.text === "@" && ((u = t[i + 2]) == null ? void 0 : u.text) === "export", h = f ? sl(t, d.text === "export" ? i + 1 : i + 3) : i, g = t[h];
    if (g && nl.has(g.text)) {
      const w = ol(t, h);
      n.push({ name: w, localName: w, kind: g.text }), f && r.push({ name: w, localName: w, kind: g.text }), s = !0, i = h + 1;
      continue;
    }
    i++;
  }
  return { imports: e, exports: r, locals: n };
}
function il(t, e) {
  var o, a, c, l, u, d, f, h;
  let n = e + 1;
  const r = [];
  if (((o = t[n]) == null ? void 0 : o.text) === "{") {
    for (n++; t[n] && t[n].text !== "}"; ) {
      if (Cr(t[n])) {
        n++;
        continue;
      }
      const g = Bn(t[n]);
      let w = g;
      n++, ((a = t[n]) == null ? void 0 : a.text) === "as" && (w = Bn(t[n + 1]), n += 2), r.push({ imported: g, local: w }), ((c = t[n]) == null ? void 0 : c.text) === "," && n++;
    }
    n++, Vn(t[n], "from"), n++;
  } else if (((l = t[n]) == null ? void 0 : l.text) === "*")
    Vn(t[n + 1], "as"), r.push({ imported: "*", local: Bn(t[n + 2]), namespace: !0 }), n += 3, Vn(t[n], "from"), n++;
  else throw ((u = t[n]) == null ? void 0 : u.kind) === "string" ? B("VGPU-WGSL-IMP-SIDEEFFECT", "Side-effect imports are not supported", t[n].line, t[n].column) : B("VGPU-WGSL-IMP-DEFAULT", "Default imports are not supported", (d = t[n]) == null ? void 0 : d.line, (f = t[n]) == null ? void 0 : f.column);
  const i = t[n];
  if ((i == null ? void 0 : i.kind) !== "string")
    throw B("VGPU-WGSL-RES-NOTFOUND", "Import path must be a string", i == null ? void 0 : i.line, i == null ? void 0 : i.column);
  const s = i.text.slice(1, -1);
  return n++, ((h = t[n]) == null ? void 0 : h.text) === ";" && n++, [{ from: s, bindings: r, start: t[e].start, end: t[n - 1].end }, n];
}
function sl(t, e) {
  var n, r, i, s;
  for (e = an(t, e); ((n = t[e]) == null ? void 0 : n.text) === "@"; ) {
    const o = an(t, e + 1);
    if (e = an(t, o + 1), ((r = t[e]) == null ? void 0 : r.text) === "(") {
      let a = 0;
      do
        ((i = t[e]) == null ? void 0 : i.text) === "(" ? a++ : ((s = t[e]) == null ? void 0 : s.text) === ")" && a--, e++;
      while (t[e] && a > 0);
      e = an(t, e);
    }
  }
  return e;
}
function an(t, e) {
  for (; t[e] && Cr(t[e]); )
    e++;
  return e;
}
function ol(t, e) {
  var r, i, s, o;
  let n = e + 1;
  if (((r = t[e]) == null ? void 0 : r.text) === "var" && ((i = t[n]) == null ? void 0 : i.text) === "<")
    for (; t[n] && t[n].text !== ">"; )
      n++;
  for (; n < t.length; n++)
    if (t[n].kind === "ident")
      return t[n].text;
  throw B("VGPU-WGSL-EXP-NOTDECL", "Exported declaration has no name", (s = t[e]) == null ? void 0 : s.line, (o = t[e]) == null ? void 0 : o.column);
}
function Vn(t, e) {
  if ((t == null ? void 0 : t.text) !== e)
    throw B("VGPU-WGSL-IMP-DEFAULT", `Expected ${e}`, t == null ? void 0 : t.line, t == null ? void 0 : t.column);
}
function Bn(t) {
  if ((t == null ? void 0 : t.kind) !== "ident")
    throw B("VGPU-WGSL-IMP-DEFAULT", "Expected identifier", t == null ? void 0 : t.line, t == null ? void 0 : t.column);
  return t.text;
}
function Cr(t) {
  return t.kind === "lineComment" || t.kind === "blockComment";
}
function al(t, e) {
  return e === "uniform" || e === "storage" ? "buffer" : t.kind === "sampler" ? "sampler" : t.kind === "texture" ? t.textureKind === "texture_external" ? "externalTexture" : "texture" : "unknown";
}
function cl(t, e, n, r, i) {
  if (t === "buffer")
    return ll(e, n, i);
  if (r.kind === "sampler")
    return ul(r);
  if (r.kind === "texture")
    return r.textureKind === "texture_external" ? { kind: "externalTexture", externalTexture: {} } : r.textureKind.startsWith("texture_storage_") ? dl(r) : fl(r);
}
function ll(t, e, n) {
  return { kind: "buffer", buffer: { type: t === "uniform" ? "uniform" : e === "read" ? "read-only-storage" : "storage", hasDynamicOffset: !1, minBindingSize: n == null ? void 0 : n.size } };
}
function ul(t) {
  return { kind: "sampler", sampler: { type: t.comparison ? "comparison" : "filtering" } };
}
function dl(t) {
  return {
    kind: "storageTexture",
    storageTexture: {
      access: pl(t.access),
      format: t.texelFormat ?? "rgba8unorm",
      viewDimension: Ts(t.dimension)
    }
  };
}
function fl(t) {
  return {
    kind: "texture",
    texture: {
      sampleType: hl(t),
      viewDimension: Ts(t.dimension),
      multisampled: t.dimension === "multisampled_2d" || t.dimension === "depth_multisampled_2d"
    }
  };
}
function hl(t) {
  if (t.textureKind.startsWith("texture_depth_"))
    return "depth";
  const e = t.sampleType;
  return (e == null ? void 0 : e.kind) === "scalar" && e.name === "i32" ? "sint" : (e == null ? void 0 : e.kind) === "scalar" && e.name === "u32" ? "uint" : "unfilterable-float";
}
function Ts(t) {
  switch (t) {
    case "1d":
      return "1d";
    case "2d_array":
    case "depth_2d_array":
      return "2d-array";
    case "cube":
    case "depth_cube":
      return "cube";
    case "cube_array":
    case "depth_cube_array":
      return "cube-array";
    case "3d":
      return "3d";
    default:
      return "2d";
  }
}
function pl(t) {
  return t === "read" ? "read-only" : t === "read_write" ? "read-write" : "write-only";
}
const ml = /* @__PURE__ */ new Set([
  "array",
  "atomic",
  "bool",
  "f16",
  "f32",
  "i32",
  "mat2x2",
  "mat2x3",
  "mat2x4",
  "mat3x2",
  "mat3x3",
  "mat3x4",
  "mat4x2",
  "mat4x3",
  "mat4x4",
  "ptr",
  "sampler",
  "sampler_comparison",
  "texture_1d",
  "texture_2d",
  "texture_2d_array",
  "texture_3d",
  "texture_cube",
  "texture_cube_array",
  "texture_depth_2d",
  "texture_depth_2d_array",
  "texture_depth_cube",
  "texture_depth_cube_array",
  "texture_depth_multisampled_2d",
  "texture_external",
  "texture_multisampled_2d",
  "texture_storage_1d",
  "texture_storage_2d",
  "texture_storage_2d_array",
  "texture_storage_3d",
  "u32",
  "vec2",
  "vec2f",
  "vec2h",
  "vec2i",
  "vec2u",
  "vec3",
  "vec3f",
  "vec3h",
  "vec3i",
  "vec3u",
  "vec4",
  "vec4f",
  "vec4h",
  "vec4i",
  "vec4u"
]), gl = /* @__PURE__ */ new Set([
  "abs",
  "acos",
  "acosh",
  "all",
  "any",
  "arrayLength",
  "asin",
  "asinh",
  "atan",
  "atan2",
  "atanh",
  "ceil",
  "clamp",
  "cos",
  "cosh",
  "countLeadingZeros",
  "countOneBits",
  "countTrailingZeros",
  "cross",
  "degrees",
  "determinant",
  "distance",
  "dot",
  "dot4I8Packed",
  "dot4U8Packed",
  "dpdx",
  "dpdxCoarse",
  "dpdxFine",
  "dpdy",
  "dpdyCoarse",
  "dpdyFine",
  "exp",
  "exp2",
  "extractBits",
  "faceForward",
  "firstLeadingBit",
  "firstTrailingBit",
  "floor",
  "fma",
  "fract",
  "frexp",
  "fwidth",
  "fwidthCoarse",
  "fwidthFine",
  "insertBits",
  "inverseSqrt",
  "ldexp",
  "length",
  "log",
  "log2",
  "max",
  "min",
  "mix",
  "modf",
  "normalize",
  "pack2x16float",
  "pack2x16snorm",
  "pack2x16unorm",
  "pack4x8snorm",
  "pack4x8unorm",
  "pack4xI8",
  "pack4xU8",
  "pack4xI8Clamp",
  "pack4xU8Clamp",
  "pow",
  "quantizeToF16",
  "radians",
  "reflect",
  "refract",
  "reverseBits",
  "round",
  "saturate",
  "select",
  "sign",
  "sin",
  "sinh",
  "smoothstep",
  "sqrt",
  "step",
  "storageBarrier",
  "tan",
  "tanh",
  "textureBarrier",
  "textureDimensions",
  "textureGather",
  "textureGatherCompare",
  "textureLoad",
  "textureNumLayers",
  "textureNumLevels",
  "textureNumSamples",
  "textureSample",
  "textureSampleBaseClampToEdge",
  "textureSampleBias",
  "textureSampleCompare",
  "textureSampleCompareLevel",
  "textureSampleGrad",
  "textureSampleLevel",
  "textureStore",
  "transpose",
  "trunc",
  "unpack2x16float",
  "unpack2x16snorm",
  "unpack2x16unorm",
  "unpack4x8snorm",
  "unpack4x8unorm",
  "unpack4xI8",
  "unpack4xU8",
  "workgroupBarrier"
]), bl = /* @__PURE__ */ new Set([
  "frag_depth",
  "front_facing",
  "global_invocation_id",
  "instance_index",
  "local_invocation_id",
  "local_invocation_index",
  "num_workgroups",
  "position",
  "sample_index",
  "sample_mask",
  "subgroup_invocation_id",
  "subgroup_size",
  "vertex_index",
  "workgroup_id"
]), xl = /* @__PURE__ */ new Set([
  "align",
  "binding",
  "blend_src",
  "builtin",
  "compute",
  "diagnostic",
  "fragment",
  "group",
  "id",
  "interpolate",
  "invariant",
  "location",
  "must_use",
  "size",
  "vertex",
  "workgroup_size"
]), wl = /* @__PURE__ */ new Set(["function", "private", "storage", "uniform", "workgroup"]), _l = /* @__PURE__ */ new Set(["read", "read_write", "write"]), yl = /* @__PURE__ */ new Set([
  "bgra8unorm",
  "r32float",
  "r32sint",
  "r32uint",
  "rg32float",
  "rg32sint",
  "rg32uint",
  "rgba16float",
  "rgba16sint",
  "rgba16uint",
  "rgba32float",
  "rgba32sint",
  "rgba32uint",
  "rgba8sint",
  "rgba8snorm",
  "rgba8uint",
  "rgba8unorm"
]);
[
  ...hs,
  ...La,
  ...Fa,
  ...ml,
  ...gl,
  ...bl,
  ...xl,
  ...wl,
  ..._l,
  ...yl
];
const vl = "VGPU-WGSL-IDENT-NONASCII", Sl = "https://github.com/vercel-labs/vgpu/issues/294";
function El(t, e) {
  const n = [];
  let r = 0, i = 1, s = 1;
  const o = (c, l, u, d, f) => n.push({ kind: c, text: t.slice(l, u), start: l, end: u, line: d, column: f }), a = () => {
    t[r] === `
` ? (i++, s = 1) : s++, r++;
  };
  for (; r < t.length; ) {
    const c = t[r];
    if (/\s/.test(c)) {
      a();
      continue;
    }
    const l = r, u = i, d = s;
    if (c === "/" && t[r + 1] === "/") {
      for (; r < t.length && t[r] !== `
`; )
        a();
      o("lineComment", l, r, u, d);
      continue;
    }
    if (c === "/" && t[r + 1] === "*") {
      let f = 0;
      for (; r < t.length; ) {
        if (t[r] === "/" && t[r + 1] === "*") {
          f++, a(), a();
          continue;
        }
        if (t[r] === "*" && t[r + 1] === "/") {
          if (f--, a(), a(), f === 0) {
            o("blockComment", l, r, u, d);
            break;
          }
          continue;
        }
        a();
      }
      if (f !== 0)
        throw B("VGPU-WGSL-LEX-UNTERM-COMMENT", "Unterminated block comment", u, d);
      continue;
    }
    if (c === '"' || c === "'") {
      const f = c;
      for (a(); r < t.length && t[r] !== f; ) {
        if (t[r] === `
`)
          throw B("VGPU-WGSL-LEX-UNTERM-STRING", "Unterminated string", u, d);
        t[r] === "\\" && a(), a();
      }
      if (r >= t.length)
        throw B("VGPU-WGSL-LEX-UNTERM-STRING", "Unterminated string", u, d);
      a(), o("string", l, r, u, d);
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      for (; r < t.length && /[A-Za-z0-9_]/.test(t[r]); )
        a();
      const f = t.slice(l, r);
      o(hs.has(f) ? "keyword" : "ident", l, r, u, d);
      continue;
    }
    if (/[0-9]/.test(c) || c === "." && /[0-9]/.test(t[r + 1] ?? "")) {
      for (c === "." && a(); r < t.length; ) {
        const f = t[r];
        if (/[A-Za-z0-9_.]/.test(f)) {
          a();
          continue;
        }
        if ((f === "+" || f === "-") && Il(t[r - 1]) && /[0-9]/.test(t[r + 1] ?? "")) {
          a();
          continue;
        }
        break;
      }
      o("number", l, r, u, d);
      continue;
    }
    if (c.charCodeAt(0) > 127)
      throw Al(t, r, i, s, e);
    a(), o("punct", l, r, u, d);
  }
  return n;
}
function Al(t, e, n, r, i) {
  let s = e;
  for (; s > 0 && xi(t[s - 1]); )
    s--;
  let o = e + 1;
  for (; o < t.length && xi(t[o]); )
    o++;
  const a = t.slice(s, o), c = r - (e - s), l = i === void 0 ? "" : ` in ${i}`, u = tl(vl, `Non-ASCII identifier '${a}'${l} at line ${n} column ${c}; vgpu's WGSL pipeline supports ASCII identifiers only`, { fix: `Rename '${a}' using ASCII letters, digits and '_'. Unicode (XID) identifiers are tracked in ${Sl}`, line: n, column: c });
  return u.range = { file: i, start: { line: n, column: c } }, u;
}
function xi(t) {
  return t.charCodeAt(0) > 127 || /[A-Za-z0-9_]/.test(t);
}
function Il(t) {
  return t === "e" || t === "E" || t === "p" || t === "P";
}
const ie = (1n << 64n) - 1n, Ve = 11400714785074694791n, Dt = 14029467366897019727n, wi = 1609587929392839161n, Ls = 9650029242287828579n, _i = 2870177450012600261n;
function $l(t, e = 0n) {
  const n = new TextEncoder().encode(t);
  let r = 0, i;
  if (n.length >= 32) {
    let s = e + Ve + Dt, o = e + Dt, a = e, c = e - Ve;
    const l = n.length - 32;
    do
      s = ct(s, Ft(n, r)), r += 8, o = ct(o, Ft(n, r)), r += 8, a = ct(a, Ft(n, r)), r += 8, c = ct(c, Ft(n, r)), r += 8;
    while (r <= l);
    i = Le(s, 1n) + Le(o, 7n) + Le(a, 12n) + Le(c, 18n), i = cn(i, s), i = cn(i, o), i = cn(i, a), i = cn(i, c);
  } else
    i = e + _i;
  for (i = i + BigInt(n.length) & ie; r + 8 <= n.length; )
    i ^= ct(0n, Ft(n, r)), i = Le(i, 27n) * Ve + Ls & ie, r += 8;
  for (r + 4 <= n.length && (i ^= Cl(n, r) * Ve & ie, i = Le(i, 23n) * Dt + wi & ie, r += 4); r < n.length; )
    i ^= BigInt(n[r]) * _i & ie, i = Le(i, 11n) * Ve & ie, r++;
  return i ^= i >> 33n, i = i * Dt & ie, i ^= i >> 29n, i = i * wi & ie, i ^= i >> 32n, i.toString(16).padStart(16, "0");
}
function ct(t, e) {
  return Le(t + e * Dt & ie, 31n) * Ve & ie;
}
function cn(t, e) {
  return t ^= ct(0n, e), t * Ve + Ls & ie;
}
function Le(t, e) {
  return (t << e | t >> 64n - e) & ie;
}
function Ft(t, e) {
  let n = 0n;
  for (let r = 7; r >= 0; r--)
    n = (n << 8n) + BigInt(t[e + r]);
  return n;
}
function Cl(t, e) {
  return BigInt(t[e]) | BigInt(t[e + 1]) << 8n | BigInt(t[e + 2]) << 16n | BigInt(t[e + 3]) << 24n;
}
function Tl(t) {
  return $l(t);
}
function Ll(t) {
  return Tl(t).slice(0, 8);
}
function Fl(t, e) {
  return `_vgsl_${Ll(t)}__${e}`;
}
function ee(t, e) {
  const n = t.find((s) => s.name === e);
  if (!n)
    return;
  const r = n.args.map((s) => s.text).join(""), i = Number(r.replace(/[ui]$/, ""));
  return Number.isFinite(i) ? i : void 0;
}
function Tr(t) {
  const e = [[]];
  let n = 0, r = 0;
  for (const i of t) {
    if (i.text === "<" ? n++ : i.text === ">" ? n = Math.max(0, n - 1) : i.text === "(" ? r++ : i.text === ")" && (r = Math.max(0, r - 1)), i.text === "," && n === 0 && r === 0) {
      e.push([]);
      continue;
    }
    e[e.length - 1].push(i);
  }
  return e.map(Fs).filter((i) => i.length > 0);
}
function Fs(t) {
  let e = 0, n = t.length;
  for (; e < n && t[e].text === ","; )
    e++;
  for (; n > e && t[n - 1].text === ","; )
    n--;
  return t.slice(e, n);
}
function kl(t) {
  if (t !== void 0 && ks(t))
    return Number(t.replace(/[ui]$/, ""));
}
function ks(t) {
  return /^(0|[1-9][0-9]*)([ui])?$/.test(t);
}
function Ds(t) {
  if (t === "read" || t === "write" || t === "read_write")
    return t;
}
function Dl(t) {
  return ["f32", "f16", "i32", "u32", "bool"].find((e) => e === t);
}
function Ml(t) {
  return { kind: "scalar", name: t === "f" ? "f32" : t === "h" ? "f16" : t === "i" ? "i32" : "u32" };
}
function Ms(t) {
  return t === "f16" ? 2 : 4;
}
function st(t, e) {
  return Math.ceil(e / t) * t;
}
function le(t) {
  var s;
  const e = Fs(t);
  if (e.length === 0)
    throw B("VGPU-WGSL-REFLECT-TYPE", "Expected WGSL type");
  const n = e.map((o) => o.text).join(""), r = Pl(n);
  if (r)
    return r;
  if (((s = e[1]) == null ? void 0 : s.text) === "<") {
    const o = e[0].text, a = Tr(e.slice(2, -1)), c = Rl(o, a);
    if (c)
      return c;
  }
  const i = Ol(n);
  return i || Gl(n);
}
function Pl(t) {
  const e = Dl(t);
  if (e)
    return { kind: "scalar", name: e };
  const n = t.match(/^vec([234])([fiuh])$/);
  if (n)
    return { kind: "vector", width: Number(n[1]), element: Ml(n[2]) };
  const r = t.match(/^mat([234])x([234])([fh])$/);
  if (r) {
    const i = r[3] === "h" ? { kind: "scalar", name: "f16" } : { kind: "scalar", name: "f32" };
    return { kind: "matrix", columns: Number(r[1]), rows: Number(r[2]), element: i };
  }
}
function Rl(t, e) {
  var n, r, i, s, o;
  if (t === "array") {
    const a = (n = e[1]) == null ? void 0 : n.map((l) => l.text).join(""), c = a === void 0 ? void 0 : kl(a);
    return { kind: "array", element: le(e[0] ?? []), count: c, countExpression: a };
  }
  if (t === "atomic")
    return { kind: "atomic", element: le(e[0] ?? []) };
  if (t === "vec2" || t === "vec3" || t === "vec4")
    return { kind: "vector", width: Number(t.slice(3)), element: le(e[0] ?? []) };
  if (/^mat[234]x[234]$/.test(t))
    return { kind: "matrix", columns: Number(t[3]), rows: Number(t[5]), element: le(e[0] ?? []) };
  if (t === "ptr")
    return { kind: "ptr", addressSpace: ((r = e[0]) == null ? void 0 : r.map((a) => a.text).join("")) ?? "", element: le(e[1] ?? []), access: (i = e[2]) == null ? void 0 : i.map((a) => a.text).join("") };
  if (t === "sampler")
    return { kind: "sampler", comparison: !1 };
  if (t.startsWith("texture_storage_"))
    return { kind: "texture", textureKind: t, dimension: t.slice(16), texelFormat: (s = e[0]) == null ? void 0 : s.map((a) => a.text).join(""), access: Ds((o = e[1]) == null ? void 0 : o.map((a) => a.text).join("")) };
  if (t.startsWith("texture_"))
    return { kind: "texture", textureKind: t, dimension: t.slice(8), sampleType: e[0] ? le(e[0]) : void 0 };
}
function Ol(t) {
  if (t === "sampler" || t === "sampler_comparison")
    return { kind: "sampler", comparison: t === "sampler_comparison" };
  if (t === "texture_external")
    return { kind: "texture", textureKind: t };
  if (t.startsWith("texture_depth_"))
    return { kind: "texture", textureKind: t, dimension: t.slice(8) };
  if (t.startsWith("texture_"))
    return { kind: "texture", textureKind: t, dimension: t.slice(8) };
}
function Gl(t) {
  return { kind: "identifier", name: t };
}
function Ne(t) {
  if ((t == null ? void 0 : t.kind) !== "ident" && (t == null ? void 0 : t.kind) !== "keyword")
    throw B("VGPU-WGSL-REFLECT-PARSE", "Expected identifier", t == null ? void 0 : t.line, t == null ? void 0 : t.column);
  return t.text;
}
function ot(t, e, n) {
  var r, i;
  for (let s = e; s < t.length; s++)
    if (t[s].text === n)
      return s;
  throw B("VGPU-WGSL-REFLECT-PARSE", `Expected ${n}`, (r = t[e]) == null ? void 0 : r.line, (i = t[e]) == null ? void 0 : i.column);
}
function Nl(t, e, n, r) {
  for (let i = e; i < n; i++)
    if (t[i].text === r)
      return i;
}
function Mn(t, e, n) {
  let r = 0;
  for (let i = e; i < t.length; i++)
    if ((t[i].text === "{" || t[i].text === "(") && r++, (t[i].text === "}" || t[i].text === ")") && (r = Math.max(0, r - 1)), r === 0 && t[i].text === n)
      return i;
  return t.length;
}
function Lr(t, e) {
  var s, o;
  const n = t[e].text, r = n === "(" ? ")" : n === "{" ? "}" : ">";
  let i = 0;
  for (let a = e; a < t.length; a++)
    if (t[a].text === n && i++, t[a].text === r && (i--, i === 0))
      return a;
  throw B("VGPU-WGSL-REFLECT-PARSE", `Unclosed ${n}`, (s = t[e]) == null ? void 0 : s.line, (o = t[e]) == null ? void 0 : o.column);
}
function Fr(t, e) {
  var i, s;
  const n = [];
  let r = e;
  for (; ((i = t[r]) == null ? void 0 : i.text) === "@"; ) {
    const o = t[r], a = Ne(t[r + 1]);
    r += 2;
    let c = [];
    if (((s = t[r]) == null ? void 0 : s.text) === "(") {
      const l = Lr(t, r);
      c = t.slice(r + 1, l), r = l + 1;
    }
    n.push({ name: a, args: c, token: o });
  }
  return [n, r];
}
function dt(t) {
  switch (t.kind) {
    case "scalar":
      return t.name;
    case "identifier":
      return t.name;
    case "vector":
      return `vec${t.width}<${dt(t.element)}>`;
    case "matrix":
      return `mat${t.columns}x${t.rows}<${dt(t.element)}>`;
    case "array":
      return `array<${dt(t.element)}${t.count === void 0 ? "" : `,${t.count}`}>`;
    default:
      return t.kind;
  }
}
function Ul(t) {
  const e = t.find((r) => r.name === "workgroup_size");
  if (!e)
    return;
  const n = Tr(e.args).map((r) => Number(r.map((i) => i.text).join("")));
  return [n[0] ?? 1, n[1] ?? 1, n[2] ?? 1];
}
function Vl(t, e) {
  var i;
  if (((i = t[e]) == null ? void 0 : i.text) !== "<")
    return { after: e };
  const n = ot(t, e, ">"), r = Tr(t.slice(e + 1, n)).map((s) => s.map((o) => o.text).join(""));
  return { addressSpace: r[0], access: Ds(r[1]), after: n + 1 };
}
function Bl(t) {
  var u, d, f;
  const e = [], n = [], r = [], i = [], s = [], o = [], a = t.tokens.filter((h) => h.kind !== "lineComment" && h.kind !== "blockComment");
  let c = 0, l = 0;
  for (; c < a.length; ) {
    const h = a[c];
    if (h.text === "{") {
      l++, c++;
      continue;
    }
    if (h.text === "}") {
      l = Math.max(0, l - 1), c++;
      continue;
    }
    if (l > 0) {
      c++;
      continue;
    }
    const g = c, [w, b] = Fr(a, c);
    c = b, ((u = a[c]) == null ? void 0 : u.text) === "export" && c++;
    const _ = (d = a[c]) == null ? void 0 : d.text;
    if (_ === "enable") {
      ((f = a[c + 1]) == null ? void 0 : f.kind) === "ident" && o.push(a[c + 1].text), c = Mn(a, c, ";") + 1;
      continue;
    }
    if (_ === "struct") {
      const y = zl(t, a, c);
      y.item && e.push(y.item), c = y.next;
      continue;
    }
    if (_ === "alias") {
      const y = Wl(t, a, c);
      y.item && n.push(y.item), c = y.next;
      continue;
    }
    if (_ === "var") {
      const y = Hl(t, a, c, w);
      y.item && r.push(y.item), c = y.next;
      continue;
    }
    if (_ === "fn") {
      const y = jl(t, a, c, w);
      y.item && i.push(y.item), c = y.next;
      continue;
    }
    if (_ === "override") {
      const y = ql(a, c, w);
      y.item && s.push(y.item), c = y.next;
      continue;
    }
    c = Math.max(g + 1, c + 1);
  }
  return { structs: e, aliases: n, vars: r, entries: i, overrides: s, features: o };
}
function zl(t, e, n, r) {
  const i = Ne(e[n + 1]), s = ot(e, n + 2, "{"), o = Lr(e, s);
  return {
    item: { name: i, originalName: i, mangledName: kr(t, i, "struct"), members: Xl(e.slice(s + 1, o)), path: t.path },
    next: o + 1
  };
}
function Wl(t, e, n, r) {
  const i = Ne(e[n + 1]), s = ot(e, n + 2, "="), o = Mn(e, s + 1, ";");
  return {
    item: { name: i, originalName: i, mangledName: kr(t, i, "alias"), target: le(e.slice(s + 1, o)), path: t.path },
    next: o + 1
  };
}
function Hl(t, e, n, r) {
  const { addressSpace: i, access: s, after: o } = Vl(e, n + 1), a = Ne(e[o]), c = ot(e, o + 1, ":"), l = Mn(e, c + 1, ";");
  return {
    item: { path: t.path, name: a, mangledName: Yl(r) ? a : kr(t, a, "var"), attrs: r, addressSpace: i, access: s, type: le(e.slice(c + 1, l)) },
    next: l + 1
  };
}
function jl(t, e, n, r) {
  var c;
  const i = Ne(e[n + 1]), s = (c = r.find((l) => l.name === "vertex" || l.name === "fragment" || l.name === "compute")) == null ? void 0 : c.name;
  if (!s)
    return { item: void 0, next: n + 1 };
  const o = ot(e, n + 2, "("), a = Lr(e, o);
  return { item: { name: i, mangledName: i, stage: s, workgroupSize: Ul(r), path: t.path, params: Kl(e.slice(o + 1, a)) }, next: a + 1 };
}
function Kl(t) {
  const e = [];
  let n = 0;
  for (; n < t.length; ) {
    const [r, i] = Fr(t, n);
    if (n = i, !t[n] || t[n].text === ",") {
      n++;
      continue;
    }
    const s = Ne(t[n]), o = ot(t, n + 1, ":");
    let a = o + 1, c = 0;
    for (; a < t.length && (t[a].text === "<" && c++, t[a].text === ">" && (c = Math.max(0, c - 1)), !(c === 0 && t[a].text === ",")); )
      a++;
    e.push({ name: s, attrs: r, type: le(t.slice(o + 1, a)) }), n = a + 1;
  }
  return e;
}
function ql(t, e, n) {
  const r = Ne(t[e + 1]), i = Mn(t, e + 1, ";"), s = Nl(t, e + 2, i, "=");
  return { item: { name: r, mangledName: r, id: ee(n, "id"), defaultValue: s === void 0 ? void 0 : t.slice(s + 1, i).map((o) => o.text).join("") }, next: i + 1 };
}
function Xl(t) {
  const e = [];
  let n = 0;
  for (; n < t.length; ) {
    const [r, i] = Fr(t, n);
    if (n = i, !t[n] || t[n].text === "," || t[n].text === ";") {
      n++;
      continue;
    }
    const s = Ne(t[n]), o = ot(t, n + 1, ":");
    let a = o + 1, c = 0;
    for (; a < t.length && (t[a].text === "<" && c++, t[a].text === ">" && (c = Math.max(0, c - 1)), !(c === 0 && (t[a].text === "," || t[a].text === ";"))); )
      a++;
    e.push({ name: s, attrs: r, type: le(t.slice(o + 1, a)), align: ee(r, "align"), size: ee(r, "size") }), n = a + 1;
  }
  return e;
}
function kr(t, e, n) {
  return n === "override" ? e : Fl(t.path, e);
}
function Yl(t) {
  return ee(t, "group") !== void 0 || ee(t, "binding") !== void 0;
}
const Jl = "literal length required for auto layout; use draw.group(n, bg) manual binding", Zl = "VGPUError: `bool` is not host-shareable in uniform/storage. Fix: use `u32` (0 | 1) → struct Params { enabled: u32 }", Ps = "use a manual group claim (`draw.group(n, bg)`)";
function Ql(t = 1, e = 1) {
  return B("VGPU-WGSL-REFLECT-ARRAY-LENGTH", Jl, t, e);
}
function Rs(t = 1, e = 1) {
  return B("VGPU-WGSL-REFLECT-BOOL-HOST-SHAREABLE", Zl, t, e);
}
function Sn(t, e, n = 1, r = 1) {
  return B("VGPU-WGSL-REFLECT-UNKNOWN-TYPE", `type '${t}' is unknown in ${e}; ${Ps}`, n, r);
}
function yi(t, e, n = 1, r = 1) {
  return B("VGPU-WGSL-REFLECT-NS-TYPE", `type '${t}' is a namespace-member import; use a named import or manual @group(1+) binding`, n, r);
}
function Os(t, e = 1, n = 1) {
  return B("VGPU-WGSL-REFLECT-NON-HOST-SHAREABLE", `Type ${t} is not host-shareable; ${Ps}`, e, n);
}
const Ct = "naga-standard";
function eu(t, e, n) {
  var o, a, c;
  const r = /* @__PURE__ */ new Map();
  for (const l of e) {
    const u = /* @__PURE__ */ new Map();
    for (const d of [...l.structs, ...l.aliases])
      u.set(d.originalName, { path: d.path, name: d.originalName, mangledName: d.mangledName, kind: "members" in d ? "struct" : "alias" });
    r.set(((o = l.structs[0]) == null ? void 0 : o.path) ?? ((a = l.aliases[0]) == null ? void 0 : a.path) ?? ((c = l.vars[0]) == null ? void 0 : c.path) ?? "", u);
  }
  const i = new Map(t.map((l) => [l.path, r.get(l.path) ?? /* @__PURE__ */ new Map()])), s = /* @__PURE__ */ new Map();
  for (const l of t) {
    const u = new Map(i.get(l.path));
    for (const d of l.parsed.imports)
      tu(l, d, u, t, i);
    s.set(l.path, u);
  }
  return s;
}
function tu(t, e, n, r, i, s) {
  const o = ru(e, t.path, r), a = i.get(o);
  for (const c of e.bindings) {
    if (c.namespace) {
      n.set(c.local, { path: o, name: c.local, mangledName: c.local, kind: "namespace" });
      continue;
    }
    const l = a == null ? void 0 : a.get(c.imported);
    l && n.set(c.local, l);
  }
}
function nu(t, e) {
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  for (const s of t) {
    for (const o of s.structs) {
      const a = {
        name: o.name,
        mangledName: o.mangledName,
        members: o.members.map((c) => ({ name: c.name, type: rt(c.type, o.path, e), align: c.align, size: c.size }))
      };
      n.set(o.mangledName, a), i.set(o.mangledName, a);
    }
    for (const o of s.aliases) {
      const a = { name: o.name, mangledName: o.mangledName, target: rt(o.target, o.path, e) };
      r.set(o.mangledName, a), i.set(o.mangledName, a);
    }
  }
  return { structs: n, aliases: r, byMangled: i };
}
function rt(t, e, n, r) {
  var i, s;
  switch (t.kind) {
    case "identifier": {
      const o = t.name.indexOf(".");
      if (o > 0) {
        const c = t.name.slice(0, o), l = (i = n.get(e)) == null ? void 0 : i.get(c);
        if ((l == null ? void 0 : l.kind) === "namespace")
          throw yi(t.name);
      }
      const a = (s = n.get(e)) == null ? void 0 : s.get(t.name);
      if ((a == null ? void 0 : a.kind) === "namespace")
        throw yi(t.name);
      if (!a)
        throw Sn(t.name, e);
      return { kind: "identifier", name: a.name, mangledName: a.mangledName };
    }
    case "array":
    case "atomic":
    case "vector":
    case "matrix":
    case "ptr":
      return { ...t, element: rt(t.element, e, n) };
    case "texture":
      return { ...t, sampleType: t.sampleType ? rt(t.sampleType, e, n) : void 0 };
    default:
      return t;
  }
}
function Tt(t, e) {
  if (!e || t.kind !== "identifier")
    return t;
  const n = e.aliases.get(t.mangledName ?? t.name);
  return n ? Tt(n.target, e) : t;
}
function Qn(t, e) {
  const n = Tt(t, e);
  switch (n.kind) {
    case "array":
    case "atomic":
    case "vector":
    case "matrix":
    case "ptr":
      return { ...n, element: Qn(n.element, e) };
    case "texture":
      return { ...n, sampleType: n.sampleType ? Qn(n.sampleType, e) : void 0 };
    default:
      return n;
  }
}
function ru(t, e, n, r) {
  const i = void 0;
  if (i !== void 0 && n.some((l) => l.path === i))
    return i;
  const s = t.from, o = e.slice(0, e.lastIndexOf("/") + 1), a = s.startsWith("/") ? s : iu(`${o}${s}`);
  return [s, a].find((l) => n.some((u) => u.path === l)) ?? i ?? a;
}
function iu(t) {
  const e = t.startsWith("/"), n = [];
  for (const r of t.split("/"))
    !r || r === "." || (r === ".." ? n.pop() : n.push(r));
  return `${e ? "/" : ""}${n.join("/")}`;
}
function en(t, e, n = dt(t), r = n, i) {
  const s = i ? Qn(t, i) : t;
  return su(s, e, n, r, i);
}
function su(t, e, n, r, i) {
  switch (t.kind) {
    case "scalar":
      return ou(t, e, n, r);
    case "atomic":
      return au(t, e, n, r);
    case "vector":
      return cu(t, e, n, r, i);
    case "matrix":
      return lu(t, e, n, r, i);
    case "array":
      return uu(t, e, n, r, i);
    case "identifier":
      return fu(t, e, n, r, i);
    default:
      throw Os(dt(t));
  }
}
function ou(t, e, n, r) {
  const i = Ms(t.name);
  if (t.name === "bool")
    throw Rs();
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Ct, type: t, align: i, size: i };
}
function au(t, e, n, r) {
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Ct, type: t, align: 4, size: 4 };
}
function cu(t, e, n, r, i) {
  const o = en(t.element, e, n, r, i).size ?? 4, a = t.width === 2 ? o * 2 : o * 4;
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Ct, type: t, align: a, size: o * t.width };
}
function lu(t, e, n, r, i) {
  const s = { kind: "vector", width: t.rows, element: t.element }, o = en(s, e, `${n}[]`, `${r}[]`, i), a = st(o.align, o.size ?? 0);
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Ct, type: t, align: o.align, size: a * t.columns, stride: a, element: o };
}
function uu(t, e, n, r, i) {
  du(t.countExpression);
  const s = en(t.element, e, `${n}[]`, `${r}[]`, i), o = st(Bt(t.element, e, i), s.size ?? 0);
  return {
    name: n,
    mangledName: r,
    addressSpace: e,
    layoutMode: Ct,
    type: t,
    align: Bt(t, e, i),
    size: t.count === void 0 ? void 0 : o * t.count,
    stride: o,
    element: s,
    runtimeSized: t.count === void 0
  };
}
function du(t) {
  if (t !== void 0 && !ks(t))
    throw Ql();
}
function fu(t, e, n, r, i) {
  if (!i)
    throw Sn(t.name, "<unknown>");
  const s = i.structs.get(t.mangledName ?? t.name);
  if (!s)
    throw Sn(t.name, "<unknown>");
  const o = [];
  let a = 0, c = 1;
  for (const u of s.members) {
    const d = hu(u, e, a, i);
    o.push(d.member), a = pu(e, u.type, d.offset, d.member.size ?? 0, i), c = Math.max(c, d.member.align);
  }
  const l = gu(e, c);
  return { name: n, mangledName: r, addressSpace: e, layoutMode: Ct, type: t, align: l, size: st(l, a), members: o };
}
function hu(t, e, n, r) {
  const i = en(t.type, e, t.name, t.name, r), s = Math.max(Bt(t.type, e, r), t.align ?? 1), o = Math.max(i.size ?? 0, t.size ?? 0), a = st(s, n);
  return {
    member: { name: t.name, offset: a, align: s, size: o, type: t.type, layout: i, explicitAlign: t.align, explicitSize: t.size },
    offset: a
  };
}
function pu(t, e, n, r, i) {
  return n + (t === "uniform" && mu(e, i) ? st(16, r) : r);
}
function mu(t, e) {
  const n = Tt(t, e);
  return n.kind === "identifier" && e.structs.has(n.mangledName ?? n.name);
}
function gu(t, e) {
  return t === "uniform" ? st(16, e) : e;
}
function Bt(t, e, n) {
  const r = n ? Tt(t, n) : t, i = pn(r, e, n);
  return e === "uniform" && bu(r, n) ? st(16, i) : i;
}
function bu(t, e) {
  return t.kind === "array" || t.kind === "identifier" && !!(e != null && e.structs.get(t.mangledName ?? t.name));
}
function pn(t, e, n) {
  const r = n ? Tt(t, n) : t;
  switch (r.kind) {
    case "scalar":
      return xu(r.name);
    case "atomic":
      return 4;
    case "vector":
      return r.width === 2 ? pn(r.element, e, n) * 2 : pn(r.element, e, n) * 4;
    case "matrix":
      return pn({ kind: "vector", width: r.rows, element: r.element }, e, n);
    case "array":
      return Bt(r.element, e, n);
    case "identifier":
      return wu(r, e, n);
    default:
      throw Os(dt(r));
  }
}
function xu(t) {
  if (t === "bool")
    throw Rs();
  return Ms(t);
}
function wu(t, e, n) {
  const r = n == null ? void 0 : n.structs.get(t.mangledName ?? t.name);
  if (!r)
    throw Sn(t.name, "<unknown>");
  return Math.max(1, ...r.members.map((i) => Math.max(Bt(i.type, e, n), i.align ?? 1)));
}
const _u = /^_vgsl_[0-9a-f]{8,16}__[A-Za-z_][A-Za-z0-9_]*$/, yu = /* @__PURE__ */ new Set(["fn", "struct", "const", "alias", "var", "override"]);
function Gs(t) {
  return new vu(t).analyze();
}
class vu {
  constructor(e) {
    x(this, "tokens");
    x(this, "scopes", []);
    x(this, "declarations", []);
    x(this, "references", []);
    x(this, "functions", []);
    x(this, "preserved", /* @__PURE__ */ new Map());
    x(this, "symbolsByScope", /* @__PURE__ */ new Map());
    x(this, "moduleFallbackReasons", []);
    x(this, "pendingSymbols", []);
    x(this, "moduleScopeId");
    this.tokens = e, this.moduleScopeId = this.createScope("module", void 0, void 0, 0);
  }
  analyze() {
    this.collectTopLevel();
    for (const e of this.functions)
      this.walkFunction(e);
    return {
      tokens: this.tokens,
      scopes: this.scopes,
      declarations: this.declarations,
      references: this.references,
      functions: this.functions,
      preservedTokens: [...this.preserved.entries()].map(([e, n]) => ({ tokenIndex: e, reason: n })),
      fallback: { wholeModule: this.moduleFallbackReasons.length > 0, reasons: this.moduleFallbackReasons }
    };
  }
  collectTopLevel() {
    let e = 0;
    for (let n = 0; n < this.tokens.length; n++) {
      const r = this.tokens[n];
      if (!be(r)) {
        if (r.text === "{") {
          e++;
          continue;
        }
        if (r.text === "}") {
          e--, e < 0 && (this.moduleFallback("unmatched top-level closing brace", n), e = 0);
          continue;
        }
        if (e === 0) {
          if (r.text === "@") {
            n = this.preserveAttribute(n);
            continue;
          }
          if (r.text === "enable" || r.text === "requires" || r.text === "diagnostic" || r.text === "const_assert") {
            n = this.preserveStatement(n, "directive");
            continue;
          }
          if (r.text !== "export") {
            if (r.text === "struct") {
              n = this.collectStruct(n);
              continue;
            }
            if (r.text === "fn") {
              n = this.collectFunction(n);
              continue;
            }
            if (r.text === "const" || r.text === "alias" || r.text === "var" || r.text === "override") {
              n = this.preserveGlobalDeclaration(n);
              continue;
            }
            r.kind === "keyword" && !yu.has(r.text) && this.moduleFallback(`unexpected top-level keyword '${r.text}'`, n);
          }
        }
      }
    }
    e !== 0 && this.moduleFallback("unclosed top-level brace", this.tokens.length - 1), this.scopes[this.moduleScopeId].endToken = Math.max(0, this.tokens.length - 1);
  }
  collectStruct(e) {
    var s, o, a;
    const n = this.nextSig(e);
    if (n === void 0 || ((s = this.tokens[n]) == null ? void 0 : s.kind) !== "ident")
      return this.moduleFallback("struct without name", e), e;
    this.preserveToken(n, "global");
    const r = this.nextSig(n);
    if (r === void 0 || ((o = this.tokens[r]) == null ? void 0 : o.text) !== "{")
      return this.moduleFallback("struct without body", e), n;
    const i = this.findMatching(r, "{", "}");
    if (i === void 0)
      return this.moduleFallback("unclosed struct body", r), r;
    for (let c = r; c <= i; c++)
      ((a = this.tokens[c]) == null ? void 0 : a.kind) === "ident" && this.preserveToken(c, "struct");
    return i;
  }
  collectFunction(e) {
    var u, d;
    const n = this.nextSig(e);
    if (n === void 0 || ((u = this.tokens[n]) == null ? void 0 : u.kind) !== "ident")
      return this.moduleFallback("function without name", e), e;
    const r = this.tokens[n].text, i = _u.test(r) && !this.hasEntryAttributeBefore(e);
    this.addDeclaration(r, "function", n, this.moduleScopeId, void 0, i), i || this.preserveToken(n, "global");
    const s = this.nextSig(n);
    if (s === void 0 || ((d = this.tokens[s]) == null ? void 0 : d.text) !== "(")
      return this.moduleFallback("function without parameter list", n), n;
    const o = this.findMatching(s, "(", ")");
    if (o === void 0)
      return this.moduleFallback("unclosed function parameter list", s), s;
    const a = this.findNextText(o + 1, "{");
    if (a === void 0)
      return this.moduleFallback("function without body", o), o;
    this.preserveFunctionSignatureTail(o + 1, a);
    const c = this.findMatching(a, "{", "}");
    if (c === void 0)
      return this.moduleFallback("unclosed function body", a), a;
    const l = this.createScope("function", this.moduleScopeId, this.functions.length, s);
    return this.functions.push({ id: this.functions.length, name: r, nameTokenIndex: n, scopeId: l, bodyStartToken: a, bodyEndToken: c, skipped: !1, fallbackReasons: [] }), this.collectParams(s, o, l, this.functions.length - 1), this.scopes[l].endToken = c, c;
  }
  collectParams(e, n, r, i) {
    var s;
    for (let o = e + 1; o < n; o++) {
      const a = this.tokens[o];
      if (!be(a)) {
        if (a.text === "@") {
          o = this.preserveAttribute(o);
          continue;
        }
        if (a.kind === "ident" && this.nextSig(o) !== void 0 && ((s = this.tokens[this.nextSig(o)]) == null ? void 0 : s.text) === ":") {
          this.addDeclaration(a.text, "param", o, r, i, !0);
          const c = this.nextSig(o);
          o = this.preserveTypeFrom(c + 1, [",", ")"], n);
        }
      }
    }
  }
  preserveFunctionSignatureTail(e, n) {
    for (let r = e; r < n; r++) {
      const i = this.tokens[r];
      if (!be(i)) {
        if (i.text === "@") {
          r = this.preserveAttribute(r);
          continue;
        }
        i.kind === "ident" && this.preserveToken(r, "type");
      }
    }
  }
  preserveGlobalDeclaration(e) {
    var s, o, a;
    let n = e + 1;
    if (((s = this.tokens[e]) == null ? void 0 : s.text) === "var") {
      const c = this.nextSig(e);
      if (c !== void 0 && ((o = this.tokens[c]) == null ? void 0 : o.text) === "<") {
        const l = this.findMatching(c, "<", ">");
        if (l === void 0)
          return this.moduleFallback("unparseable top-level var template", c), c;
        this.preserveRange(c, l, "type"), n = l + 1;
      }
    }
    const r = this.findNextIdent(n);
    r !== void 0 && (this.preserveToken(r, "global"), this.addDeclaration(this.tokens[r].text, "global", r, this.moduleScopeId, void 0, !1));
    const i = this.findStatementEnd(e);
    for (let c = e; c <= i; c++)
      ((a = this.tokens[c]) == null ? void 0 : a.kind) === "ident" && this.preserveToken(c, "global");
    return i;
  }
  walkFunction(e) {
    var a, c, l;
    const n = [this.moduleScopeId, e.scopeId], r = [], i = (u, d) => {
      const f = this.createScope(u, n[n.length - 1], e.id, d);
      return n.push(f), f;
    }, s = (u) => {
      if (n.length <= 2) {
        this.functionFallback(e, "scope frame underflow", u);
        return;
      }
      const d = n.pop();
      return this.scopes[d].endToken = u, d;
    };
    i("block", e.bodyStartToken);
    let o = 1;
    for (let u = e.bodyStartToken + 1; u < e.bodyEndToken; u++) {
      this.activatePendingSymbols(u);
      const d = this.tokens[u];
      if (be(d))
        continue;
      if (d.text === "@") {
        u = this.preserveAttribute(u);
        continue;
      }
      if (d.text === ".") {
        const h = this.nextSig(u);
        h !== void 0 && ((a = this.tokens[h]) == null ? void 0 : a.kind) === "ident" && this.preserveToken(h, "member");
        continue;
      }
      if (d.text === "enable" || d.text === "requires" || d.text === "diagnostic") {
        u = this.preserveStatement(u, "directive");
        continue;
      }
      if (d.text === "for") {
        const h = i("for-init", u), g = this.nextSig(u);
        (g === void 0 || ((c = this.tokens[g]) == null ? void 0 : c.text) !== "(") && this.functionFallback(e, "for without parenthesized header", u), r.push({ scopeId: h, headerDepth: 0, awaitingBody: !1 });
        continue;
      }
      const f = r[r.length - 1];
      if (f && f.bodyDepth === void 0 && (d.text === "(" && f.headerDepth++, d.text === ")" && (f.headerDepth--, f.headerDepth <= 0 && (f.awaitingBody = !0))), d.text === "{") {
        o++;
        const h = Su(r, (g) => g.awaitingBody && g.bodyDepth === void 0);
        h && (h.bodyDepth = o), i("block", u);
        continue;
      }
      if (d.text === "}") {
        const h = o;
        for (s(u), o--; r.length > 0 && r[r.length - 1].bodyDepth === h; )
          s(u), r.pop();
        o < 0 && this.functionFallback(e, "unmatched closing brace", u);
        continue;
      }
      if (d.text === ":") {
        u = this.preserveTypeFrom(u + 1, ["=", ";", ",", ")", "{"], e.bodyEndToken);
        continue;
      }
      if (d.text === "-" && ((l = this.tokens[this.nextSig(u) ?? -1]) == null ? void 0 : l.text) === ">") {
        u = this.preserveTypeFrom((this.nextSig(u) ?? u) + 1, ["{"], e.bodyEndToken);
        continue;
      }
      if (d.text === "let" || d.text === "const" || d.text === "var") {
        u = this.collectLocalDeclaration(u, n[n.length - 1], e);
        continue;
      }
      if (d.kind === "ident" && !this.preserved.has(u)) {
        const h = this.resolve(d.text, n);
        h !== void 0 ? this.references.push({ name: d.text, tokenIndex: u, declarationId: h, scopeId: n[n.length - 1], functionId: e.id }) : this.preserveToken(u, "unknown");
      }
    }
    for (; n.length > 2; )
      s(e.bodyEndToken);
  }
  collectLocalDeclaration(e, n, r) {
    var c, l;
    const i = this.tokens[e].text;
    let s = e + 1;
    if (i === "var") {
      const u = this.nextSig(e);
      if (u !== void 0 && ((c = this.tokens[u]) == null ? void 0 : c.text) === "<") {
        const d = this.findMatching(u, "<", ">");
        if (d === void 0)
          return this.functionFallback(r, "unparseable var template", u), u;
        this.preserveRange(u, d, "type"), s = d + 1;
      }
    }
    const o = this.findNextIdent(s);
    if (o === void 0 || o >= r.bodyEndToken)
      return this.functionFallback(r, `${i} without identifier`, e), e;
    this.addDeclaration(this.tokens[o].text, i, o, n, r.id, !0, this.findStatementEnd(e));
    const a = this.nextSig(o);
    return a !== void 0 && ((l = this.tokens[a]) == null ? void 0 : l.text) === ":" ? this.preserveTypeFrom(a + 1, ["=", ";", ",", ")"], r.bodyEndToken) : o;
  }
  addDeclaration(e, n, r, i, s, o, a) {
    const c = this.declarations.length;
    return this.declarations.push({ id: c, name: e, kind: n, tokenIndex: r, scopeId: i, functionId: s, safeToRename: o }), a !== void 0 ? this.pendingSymbols.push({ name: e, id: c, scopeId: i, activateAfter: a }) : this.activateSymbol(e, c, i), c;
  }
  activatePendingSymbols(e) {
    for (let n = this.pendingSymbols.length - 1; n >= 0; n--) {
      const r = this.pendingSymbols[n];
      r.activateAfter >= e || (this.activateSymbol(r.name, r.id, r.scopeId), this.pendingSymbols.splice(n, 1));
    }
  }
  activateSymbol(e, n, r) {
    let i = this.symbolsByScope.get(r);
    i || (i = /* @__PURE__ */ new Map(), this.symbolsByScope.set(r, i)), i.has(e) || i.set(e, n);
  }
  resolve(e, n) {
    var r;
    for (let i = n.length - 1; i >= 0; i--) {
      const s = (r = this.symbolsByScope.get(n[i])) == null ? void 0 : r.get(e);
      if (s !== void 0)
        return s;
    }
  }
  preserveAttribute(e) {
    var s;
    this.preserveToken(e, "attribute");
    const n = this.nextSig(e);
    if (n === void 0)
      return e;
    this.preserveToken(n, "attribute");
    const r = this.nextSig(n);
    if (r === void 0 || ((s = this.tokens[r]) == null ? void 0 : s.text) !== "(")
      return n;
    const i = this.findMatching(r, "(", ")");
    return i === void 0 ? (this.preserveRange(r, r, "attribute"), r) : (this.preserveRange(r, i, "attribute"), i);
  }
  preserveTypeFrom(e, n, r) {
    let i = 0, s = 0, o = 0, a = e - 1;
    for (let c = e; c < r; c++) {
      const l = this.tokens[c];
      if (!be(l)) {
        if (i === 0 && s === 0 && o === 0 && n.includes(l.text))
          return Math.max(e - 1, c - 1);
        if (l.text === "<")
          i++;
        else if (l.text === ">")
          i = Math.max(0, i - 1);
        else if (l.text === "(")
          s++;
        else if (l.text === ")") {
          if (s === 0 && n.includes(")"))
            return Math.max(e - 1, c - 1);
          s = Math.max(0, s - 1);
        } else l.text === "[" ? o++ : l.text === "]" && (o = Math.max(0, o - 1));
        l.kind === "ident" && this.preserveToken(c, "type"), a = c;
      }
    }
    return a;
  }
  preserveStatement(e, n) {
    const r = this.findStatementEnd(e);
    return this.preserveRange(e, r, n), r;
  }
  preserveRange(e, n, r) {
    for (let i = e; i <= n; i++)
      this.tokens[i] && this.tokens[i].kind !== "lineComment" && this.tokens[i].kind !== "blockComment" && this.preserveToken(i, r);
  }
  preserveToken(e, n) {
    this.preserved.has(e) || this.preserved.set(e, n);
  }
  createScope(e, n, r, i) {
    const s = this.scopes.length;
    return this.scopes.push({ id: s, kind: e, parentId: n, functionId: r, startToken: i }), s;
  }
  nextSig(e) {
    for (let n = e + 1; n < this.tokens.length; n++)
      if (!be(this.tokens[n]))
        return n;
  }
  findNextIdent(e) {
    for (let n = e; n < this.tokens.length; n++) {
      const r = this.tokens[n];
      if (!be(r)) {
        if (r.kind === "ident")
          return n;
        if (r.text !== "@")
          return;
      }
    }
  }
  findNextText(e, n) {
    for (let r = e; r < this.tokens.length; r++)
      if (!be(this.tokens[r]) && this.tokens[r].text === n)
        return r;
  }
  // `<` / `>` are deliberately not tracked here: in a declaration's initializer they are
  // comparison or shift operators, not template brackets, and a net-positive count made this scan
  // overshoot the statement's own `;` (vgpu#251). A WGSL template argument list can never contain
  // `;`, `{` or `}`, so angle depth is not load-bearing for finding a statement end.
  findStatementEnd(e) {
    let n = 0;
    for (let r = e; r < this.tokens.length; r++) {
      const i = this.tokens[r].text;
      if (i === "(")
        n++;
      else if (i === ")")
        n = Math.max(0, n - 1);
      else if (n === 0 && (i === ";" || i === "{" || i === "}"))
        return r;
    }
    return this.tokens.length - 1;
  }
  findMatching(e, n, r) {
    let i = 0;
    for (let s = e; s < this.tokens.length; s++) {
      const o = this.tokens[s].text;
      if (o === n && i++, o === r && (i--, i === 0))
        return s;
    }
  }
  hasEntryAttributeBefore(e) {
    for (let n = e - 1; n >= 0; n--) {
      const r = this.tokens[n];
      if (!be(r)) {
        if (r.text === ")" || r.kind === "ident" || r.text === "@") {
          const i = r.text;
          if (i === "compute" || i === "vertex" || i === "fragment")
            return !0;
          continue;
        }
        break;
      }
    }
    return !1;
  }
  moduleFallback(e, n) {
    this.moduleFallbackReasons.push(`${e} at token ${n}`);
  }
  functionFallback(e, n, r) {
    e.skipped = !0, e.fallbackReasons.push(`${n} at token ${r}`);
  }
}
function Su(t, e) {
  for (let n = t.length - 1; n >= 0; n--)
    if (e(t[n]))
      return t[n];
}
function be(t) {
  return t.kind === "lineComment" || t.kind === "blockComment";
}
const Eu = /* @__PURE__ */ new Set(["textureSample", "textureSampleBias", "textureSampleLevel", "textureSampleGrad", "textureGather", "textureSampleBaseClampToEdge"]), Au = /* @__PURE__ */ new Set(["textureSampleCompare", "textureSampleCompareLevel", "textureGatherCompare"]);
function Iu(t, e, n) {
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = e[i], a = Gs(s.tokens), c = /* @__PURE__ */ new Map();
    for (const u of o.vars) {
      const d = ee(u.attrs, "group"), f = ee(u.attrs, "binding"), h = a.declarations.find((g) => g.kind === "global" && g.name === u.name);
      d !== void 0 && f !== void 0 && h && c.set(h.id, { group: d, binding: f });
    }
    const l = /* @__PURE__ */ new Map();
    for (const u of a.declarations) {
      if (u.kind !== "function")
        continue;
      const d = a.functions.find((f) => f.nameTokenIndex === u.tokenIndex);
      d && l.set(u.id, d.id);
    }
    for (const u of o.entries) {
      const d = a.functions.find((w) => w.name === u.name), f = [];
      let h = a.fallback.wholeModule || !d;
      !h && d && (h = !Ns(d.id, /* @__PURE__ */ new Map(), /* @__PURE__ */ new Set(), a, c, l, f));
      const g = d ? Fu(d.id, a, c, l) : n.map(er);
      r.set(u, h ? ku(n, g) : Du(f));
    }
  }
  return r;
}
function Ns(t, e, n, r, i, s, o) {
  var d, f;
  const a = r.functions[t];
  if (!a || a.skipped)
    return !1;
  const c = `${t}|${[...e].map(([h, g]) => `${h}:${g.group}:${g.binding}`).join(",")}`;
  if (n.has(c))
    return !0;
  n.add(c);
  const l = r.references.filter((h) => h.functionId === t), u = new Map(l.map((h) => [h.tokenIndex, h]));
  for (let h = a.bodyStartToken + 1; h < a.bodyEndToken; h++) {
    const g = (d = r.tokens[h]) == null ? void 0 : d.text, w = Eu.has(g ?? "") ? "filtering" : Au.has(g ?? "") ? "comparison" : void 0, b = u.get(h), _ = b && s.get(b.declarationId);
    if (!w && _ === void 0)
      continue;
    const y = Lu(r, h);
    if (y === void 0 || ((f = r.tokens[y]) == null ? void 0 : f.text) !== "(")
      continue;
    const E = Tu(r, y);
    if (!E)
      return !1;
    const L = E.map(([$, F]) => $u($, F, r, i, e));
    if (w) {
      const $ = g === "textureGather" && !Cu(E[0], r, i, e) ? 1 : 0, F = L[$], k = L[$ + 1];
      if (!F || !k)
        return !1;
      o.push({ texture: F, sampler: k, mode: w });
    } else {
      const $ = r.declarations.filter((k) => k.kind === "param" && k.functionId === _).sort((k, m) => k.tokenIndex - m.tokenIndex), F = /* @__PURE__ */ new Map();
      for (let k = 0; k < $.length; k++)
        L[k] && F.set($[k].id, L[k]);
      if (!Ns(_, F, n, r, i, s, o))
        return !1;
    }
  }
  return !0;
}
function $u(t, e, n, r, i) {
  for (const s of n.references) {
    if (s.tokenIndex < t || s.tokenIndex > e)
      continue;
    const o = r.get(s.declarationId) ?? i.get(s.declarationId);
    if (o)
      return o;
  }
}
function Cu(t, e, n, r) {
  const i = e.references.find((s) => s.tokenIndex >= t[0] && s.tokenIndex <= t[1]);
  return (i == null ? void 0 : i.tokenIndex) === t[0] ? n.get(i.declarationId) ?? r.get(i.declarationId) : void 0;
}
function Tu(t, e) {
  const n = [];
  let r = 1, i = 0, s = 0, o = 0, a = e + 1;
  for (let c = e + 1; c < t.tokens.length; c++) {
    const l = t.tokens[c].text;
    if (l === "(")
      r++;
    else if (l === ")") {
      if (r--, r === 0)
        return n.push([a, c - 1]), n;
    } else l === "[" ? i++ : l === "]" ? i-- : l === "{" ? s++ : l === "}" ? s-- : l === "<" ? o++ : l === ">" ? o-- : l === "," && r === 1 && i === 0 && s === 0 && o === 0 && (n.push([a, c - 1]), a = c + 1);
  }
}
function Lu(t, e) {
  for (let n = e + 1; n < t.tokens.length; n++)
    if (t.tokens[n].kind !== "lineComment" && t.tokens[n].kind !== "blockComment")
      return n;
}
function Fu(t, e, n, r) {
  const i = [t], s = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
  for (; i.length; ) {
    const a = i.pop();
    if (!s.has(a)) {
      s.add(a);
      for (const c of e.references) {
        if (c.functionId !== a)
          continue;
        const l = n.get(c.declarationId);
        l && o.set(`${l.group}:${l.binding}`, l);
        const u = r.get(c.declarationId);
        u !== void 0 && i.push(u);
      }
    }
  }
  return [...o.values()];
}
function ku(t, e) {
  const n = new Set(e.map((o) => `${o.group}:${o.binding}`)), r = t.filter((o) => n.has(`${o.group}:${o.binding}`)), i = r.filter((o) => {
    var a;
    return ((a = o.bindingLayout) == null ? void 0 : a.kind) === "texture" && o.bindingLayout.texture.sampleType === "unfilterable-float" && !o.bindingLayout.texture.multisampled;
  }), s = r.filter((o) => {
    var a;
    return ((a = o.bindingLayout) == null ? void 0 : a.kind) === "sampler" && o.bindingLayout.sampler.type === "filtering";
  });
  return i.flatMap((o) => s.map((a) => ({ texture: er(o), sampler: er(a), mode: "filtering" })));
}
function er(t) {
  return { group: t.group, binding: t.binding };
}
function Du(t) {
  const e = /* @__PURE__ */ new Set();
  return t.filter((n) => {
    const r = `${n.texture.group}:${n.texture.binding}:${n.sampler.group}:${n.sampler.binding}:${n.mode}`;
    return e.has(r) ? !1 : (e.add(r), !0);
  });
}
function Mu(t, e) {
  const n = t.map(Bl), r = eu(t, n), i = nu(n, r), s = [], o = [];
  for (const l of n)
    for (const u of l.vars) {
      const d = ee(u.attrs, "group"), f = ee(u.attrs, "binding");
      if (d === void 0 || f === void 0)
        continue;
      const h = rt(u.type, u.path, r), g = al(h, u.addressSpace), w = u.addressSpace === "uniform" || u.addressSpace === "storage" ? en(h, u.addressSpace, u.name, u.mangledName, i) : void 0;
      w && o.push(w), s.push({
        group: d,
        binding: f,
        name: u.name,
        mangledName: u.mangledName,
        type: h,
        kind: g,
        addressSpace: u.addressSpace,
        access: u.access,
        struct: h.kind === "identifier" ? i.structs.get(h.mangledName ?? h.name) : void 0,
        layout: w,
        bindingLayout: cl(g, u.addressSpace, u.access, h, w)
      });
    }
  s.sort((l, u) => l.group - u.group || l.binding - u.binding);
  const a = Pu(t, n, s), c = Iu(t, n, s);
  return {
    bindings: s,
    entryPoints: n.flatMap((l) => l.entries.map((u) => Ru(u, n.flatMap((d) => d.structs), r, i, a.get(u) ?? s, c.get(u) ?? []))),
    overrides: n.flatMap((l) => l.overrides),
    featuresRequired: [...new Set(n.flatMap((l) => l.features))],
    aliases: [...i.aliases.values()],
    structs: [...i.structs.values()],
    hostShareableLayouts: o
  };
}
function Pu(t, e, n) {
  const r = /* @__PURE__ */ new Map();
  for (let i = 0; i < t.length; i++) {
    const s = t[i], o = e[i], a = Gs(s.tokens), c = a.fallback.wholeModule, l = /* @__PURE__ */ new Map();
    for (const d of a.declarations) {
      if (d.kind !== "function")
        continue;
      const f = a.functions.find((h) => h.nameTokenIndex === d.tokenIndex);
      f && l.set(d.id, f.id);
    }
    const u = /* @__PURE__ */ new Map();
    for (const d of o.vars) {
      const f = ee(d.attrs, "group"), h = ee(d.attrs, "binding");
      if (f === void 0 || h === void 0)
        continue;
      const g = a.declarations.find((w) => w.kind === "global" && w.name === d.name);
      g && u.set(g.id, { group: f, binding: h });
    }
    for (const d of o.entries) {
      const f = a.functions.find((b) => b.name === d.name);
      if (c || !f) {
        r.set(d, n);
        continue;
      }
      const h = [f.id], g = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map();
      for (; h.length; ) {
        const b = h.pop();
        if (!g.has(b) && (g.add(b), !!a.functions[b]))
          for (const _ of a.references) {
            if (_.functionId !== b)
              continue;
            const y = u.get(_.declarationId);
            y && w.set(`${y.group}:${y.binding}`, y);
            const E = l.get(_.declarationId);
            E !== void 0 && h.push(E);
          }
      }
      r.set(d, [...w.values()].sort((b, _) => b.group - _.group || b.binding - _.binding));
    }
  }
  return r;
}
function Ru(t, e, n, r, i, s) {
  return {
    name: t.name,
    mangledName: t.mangledName,
    stage: t.stage,
    // `workgroupSize` and `inputs` stay absent rather than `undefined`-valued when they do not
    // apply: an own key valued `undefined` survives structuredClone but is dropped by
    // JSON.stringify, which would make the key set differ across serialization boundaries.
    ...t.workgroupSize ? { workgroupSize: t.workgroupSize } : {},
    bindings: i.map(({ group: o, binding: a }) => ({ group: o, binding: a })),
    samplingPairs: s,
    ...t.stage === "vertex" ? { inputs: Ou(t, e, n, r) } : {}
  };
}
function Ou(t, e, n, r) {
  var s;
  const i = [];
  for (const o of t.params) {
    if (vi(o.attrs, "builtin"))
      continue;
    const a = rt(o.type, t.path, n), c = ee(o.attrs, "location");
    if (c !== void 0) {
      i.push({ name: o.name, location: c, type: a });
      continue;
    }
    const l = Tt(a, r);
    if (l.kind !== "identifier")
      continue;
    const u = e.find((f) => f.mangledName === (l.mangledName ?? l.name)), d = r.structs.get(l.mangledName ?? l.name);
    if (u)
      for (let f = 0; f < u.members.length; f++) {
        const h = u.members[f];
        if (vi(h.attrs, "builtin"))
          continue;
        const g = ee(h.attrs, "location");
        g !== void 0 && i.push({ name: h.name, location: g, type: ((s = d == null ? void 0 : d.members[f]) == null ? void 0 : s.type) ?? rt(h.type, u.path, n) });
      }
  }
  return i;
}
function vi(t, e) {
  return t.some((n) => n.name === e);
}
function Us(t, e = "<runtime>") {
  const n = El(t, e), r = rl(n);
  if (r.imports.length > 0)
    throw B("VGPU-WGSL-REFLECT-SOURCE-IMPORT", "reflectSource() accepts a single raw WGSL string; use resolveShader() for WGSL import graphs.");
  return Mu([{ path: e, source: t, tokens: n, parsed: r }]);
}
function Vs() {
  const t = /* @__PURE__ */ new Map();
  return {
    getOrCreate(e, n, r, i) {
      const s = r.map(tr), o = `${e}:${n}:${s.join("|")}`, a = t.get(o);
      if (a)
        return a.bindGroup;
      const c = i();
      return t.set(o, { identities: s, bindGroup: c }), c;
    },
    evictIdentity(e) {
      const n = tr(e);
      for (const [r, i] of t)
        i.identities.includes(n) && t.delete(r);
    },
    clearDraw(e) {
      const n = `${e}:`;
      for (const r of t.keys())
        r.startsWith(n) && t.delete(r);
    },
    dispose() {
      t.clear();
    }
  };
}
function tr(t) {
  return typeof t == "string" || typeof t == "number" ? String(t) : `${t.kind}:${t.id}`;
}
function En(t, e, n) {
  const r = t[e];
  if (!r)
    throw new I({
      code: "VGPU-REFLECT-ENTRY-METADATA-MISSING",
      message: `Entry point '${t.name}' has no reflected ${e}.`,
      fix: "Pass the reflection from reflectSource()/resolveShader().",
      where: n
    });
  return r;
}
const An = /* @__PURE__ */ new WeakMap();
function Gt(t, e) {
  if (!t.gpu.pushErrorScope || !t.gpu.popErrorScope)
    return;
  t.gpu.pushErrorScope("validation");
  const n = An.get(t.gpu);
  n ? n.push(e) : An.set(t.gpu, [e]);
}
function se(t) {
  const e = An.get(t.gpu);
  if (!(e != null && e.length) || !t.gpu.popErrorScope)
    return;
  const n = e.pop();
  return e.length || An.delete(t.gpu), { context: n, error: t.gpu.popErrorScope() };
}
function Bs(t) {
  const e = [];
  let n = se(t);
  for (; n; )
    e.push(n), n = se(t);
  return e;
}
function Gu(t) {
  const e = se(t);
  e && Mr(e);
}
function zs(t) {
  for (const e of Bs(t))
    Mr(e);
}
function Q(t) {
  for (const e of t)
    Mr(e);
}
function Dr(t) {
  var e, n;
  return ((n = (e = t.gpu.queue).onSubmittedWorkDone) == null ? void 0 : n.call(e)) ?? Promise.resolve();
}
function Ws(t, e = [], n = {}) {
  return Uu(t, e, n.errorSink ?? Vu);
}
function In(t, e) {
  return {
    context: t.context,
    error: Nu(t.error, e.error)
  };
}
async function Nu(t, e) {
  const n = await Promise.allSettled([t, e]);
  for (const i of n)
    if (i.status === "fulfilled" && i.value)
      return i.value;
  const r = n.find((i) => i.status === "rejected");
  if ((r == null ? void 0 : r.status) === "rejected")
    throw r.reason;
  return null;
}
async function Uu(t, e, n) {
  await Dr(t);
  for (const r of e)
    try {
      const i = await r.error;
      i && await n(Et(r.context.label, r.context.group, i));
    } catch (i) {
      await n(Et(r.context.label, r.context.group, i));
    }
}
function Mr(t) {
  t.error.catch(() => {
  });
}
function Vu(t) {
  console.error(t);
}
function Hs(t, e, n, r) {
  var i;
  try {
    e.end();
  } catch (s) {
    const o = Bs(t);
    Q(n), Q(o), n.length = 0;
    const a = ((i = o[0]) == null ? void 0 : i.context) ?? r;
    throw a ? Et(a.label, a.group, s) : s;
  }
}
let Bu = 1;
const Si = /* @__PURE__ */ new WeakMap();
function zu(t) {
  return t === null || typeof t != "object" || ArrayBuffer.isView(t) || t instanceof ArrayBuffer || Array.isArray(t) ? !0 : t instanceof Ae || t instanceof $t ? !1 : !Ks(t);
}
function nr(t) {
  return typeof t != "object" || t === null || Array.isArray(t) || ArrayBuffer.isView(t) || t instanceof ArrayBuffer || t instanceof Ae || t instanceof $t ? !1 : !Ks(t);
}
function Ei(t, e, n) {
  var r;
  switch ((r = t.bindingLayout) == null ? void 0 : r.kind) {
    case "buffer":
      return Wu(t, e, n);
    case "texture":
      return Hu(t, e, n);
    case "sampler":
      return ju(t, e);
    case "storageTexture":
      throw Ee(t, "storage texture", "Pass a storage-compatible texture.");
    case "externalTexture":
      throw Ee(t, "external texture", "Pass a compatible GPUExternalTexture.");
    default:
      throw Ee(t, "reflected resource", "Fix shader reflection bindingLayout.");
  }
}
function Wu(t, e, n) {
  const r = Gc(e);
  if (r)
    return r[Ss](t, n.sourceHint);
  if (e instanceof Ae)
    return pi(e, `${n.sourceHint}.set`), qu(t, e.options.usage), { resource: { buffer: e.gpu }, identity: e.resourceIdentity, unsubscribe: (i) => e.onDestroy(i) };
  if (Yu(e))
    return pi(e.buffer, `${n.sourceHint}.set`), { resource: { buffer: e.gpu, offset: 0, size: e.size }, identity: e.buffer.resourceIdentity, unsubscribe: (i) => e.buffer.onDestroy(i) };
  if (Xs(e))
    return { resource: e, identity: zt(e.buffer) };
  if (Pr(e))
    return { resource: { buffer: e }, identity: zt(e) };
  throw Ee(t, "buffer", `Pass a compatible Buffer/Uniform: ${t.name}.set({ ${t.name}: gpu.device.createBuffer(...) }).`);
}
function Hu(t, e, n) {
  var i;
  const r = js(e);
  if (r) {
    const s = r.color;
    Ai(t, s, n);
    const o = (i = r.onTexturesRecreated) == null ? void 0 : i.bind(r);
    return { resource: s.createView(), identity: s.resourceIdentity, unsubscribe: (a) => r.onDestroy(a), onRecreate: o ? (a) => o(a) : void 0 };
  }
  if (e instanceof $t)
    return Xu(t, e.usage), Ai(t, e, n), { resource: e.createView(), identity: e.resourceIdentity, unsubscribe: (s) => e.onDestroy(s) };
  if (qs(e))
    return { resource: e.createView(), identity: e.resourceIdentity ?? zt(e) };
  if (typeof e == "object" && e !== null)
    return { resource: e, identity: zt(e) };
  throw Ee(t, "texture/target", `Pass a Texture or Target: ${t.name}.set({ ${t.name}: scene.color }) or set({ ${t.name}: scene }).`);
}
function ju(t, e) {
  if (Ku(e))
    return { resource: e, identity: zt(e) };
  throw Ee(t, "sampler", `Use the cached sampler: set({ ${t.name}: sampler(gpu) }).`);
}
function Ku(t) {
  return typeof t != "object" || t === null || t instanceof Ae || t instanceof $t ? !1 : !Pr(t) && !Xs(t) && !qs(t) && !js(t);
}
function qu(t, e) {
  var r;
  const n = ((r = t.bindingLayout) == null ? void 0 : r.kind) === "buffer" ? t.bindingLayout.buffer.type : void 0;
  if (n === "uniform" && !e.includes("uniform"))
    throw Ee(t, "uniform buffer", "Create with usage: ['uniform','copy_dst'].");
  if ((n === "storage" || n === "read-only-storage") && !e.includes("storage"))
    throw Ee(t, "storage buffer", "Create with usage: ['storage','copy_dst'].");
}
function Xu(t, e) {
  if (!e.includes("texture_binding") && !e.includes("render_attachment"))
    throw Ee(t, "sampled texture", "Use texture_binding usage or a sampleable Target.");
}
function Ai(t, e, n) {
  if (!(!n.filterableTexture || n.float32Filterable) && (e.format === "r32float" || e.format === "rg32float" || e.format === "rgba32float"))
    throw Qa(n.sourceHint, t, e.format, e.label ?? "texture", n.pairedSampler);
}
function js(t) {
  if (typeof t != "object" || t === null)
    return;
  const e = t;
  if (!(!e.resourceIdentity || !e.color || typeof e.onDestroy != "function"))
    return e;
}
function Ks(t) {
  const e = t;
  return "gpu" in e || "bindGroup" in e || "createView" in e || "resourceIdentity" in e;
}
function zt(t) {
  if (typeof t != "object" || t === null)
    return `value:${String(t)}`;
  let e = Si.get(t);
  return e || (e = { kind: "external", id: Bu++ }, Si.set(t, e)), e;
}
function Yu(t) {
  return typeof t == "object" && t !== null && "gpu" in t && "size" in t && "buffer" in t && t.buffer instanceof Ae;
}
function qs(t) {
  return typeof t == "object" && t !== null && typeof t.createView == "function";
}
function Xs(t) {
  return typeof t == "object" && t !== null && "buffer" in t && Pr(t.buffer);
}
function Pr(t) {
  return typeof t == "object" && t !== null && "size" in t && "usage" in t && typeof t.destroy == "function";
}
function Ju(t, e) {
  Zu(t);
  const n = new ArrayBuffer(t.size);
  return Rr(new DataView(n), t, 0, e), n;
}
function Zu(t) {
  if (t.size === void 0)
    throw oe("set", `No se puede inferir byteLength para layout runtime-sized '${t.name}'.`);
}
function Rr(t, e, n, r) {
  if (e.members)
    return Qu(t, e.members, n, r);
  ed(t, e, n, r);
}
function Qu(t, e, n, r) {
  const i = r;
  for (const s of e)
    Rr(t, s.layout, n + s.offset, i == null ? void 0 : i[s.name]);
}
function ed(t, e, n, r) {
  switch (e.type.kind) {
    case "scalar":
      return Or(t, n, e.type.name, r);
    case "vector":
      return td(t, n, e.type, r);
    case "matrix":
      return nd(t, e, n, r);
    case "array":
      return rd(t, e, n, r);
    default:
      throw oe("set", `No hay writer para layout ${e.type.kind}.`);
  }
}
function Or(t, e, n, r) {
  n === "f32" ? t.setFloat32(e, Number(r ?? 0), !0) : n === "i32" ? t.setInt32(e, Number(r ?? 0), !0) : n === "u32" || n === "bool" ? t.setUint32(e, n === "bool" ? r ? 1 : 0 : Number(r ?? 0), !0) : t.setUint16(e, id(Number(r ?? 0)), !0);
}
function td(t, e, n, r) {
  const i = r, s = Ys(n.element);
  for (let o = 0; o < n.width; o++)
    Or(t, e + o * s, Gr(n.element), (i == null ? void 0 : i[o]) ?? 0);
}
function nd(t, e, n, r) {
  const i = e.type, s = r, o = Ys(i.element), a = e.stride ?? 16;
  for (let c = 0; c < i.columns; c++)
    for (let l = 0; l < i.rows; l++)
      Or(t, n + c * a + l * o, Gr(i.element), (s == null ? void 0 : s[c * i.rows + l]) ?? 0);
}
function rd(t, e, n, r) {
  var o;
  const i = r, s = e.stride ?? ((o = e.element) == null ? void 0 : o.size) ?? 0;
  if (!e.element)
    throw oe("set", "Array layout sin element layout.");
  for (let a = 0; a < ((i == null ? void 0 : i.length) ?? 0); a++)
    Rr(t, e.element, n + a * s, i[a]);
}
function Ys(t) {
  return Gr(t) === "f16" ? 2 : 4;
}
function Gr(t) {
  if (t.kind !== "scalar")
    throw oe("set", `Expected scalar, got ${t.kind}`);
  return t.name;
}
function id(t) {
  const e = new Float32Array(1), n = new Uint32Array(e.buffer);
  e[0] = t;
  const r = n[0], i = r >> 16 & 32768, s = r & 8388607, o = r >> 23 & 255;
  if (o === 255)
    return i | (s ? 32256 : 31744);
  const a = o - 127 + 15;
  return a >= 31 ? i | 31744 : a <= 0 ? a < -10 ? i : i | (s | 8388608) >> 1 - a + 13 : i | a << 10 | s >> 13;
}
const Ii = /* @__PURE__ */ new WeakMap();
function sd(t, e) {
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  for (const s of e) {
    const o = s.stage === "vertex" ? 1 : s.stage === "fragment" ? 2 : 4;
    for (const a of En(s, "bindings", "visibility")) {
      const c = `${a.group}:${a.binding}`;
      n.set(c, (n.get(c) ?? 0) | o);
    }
    for (const a of En(s, "samplingPairs", "visibility"))
      a.mode === "filtering" && r.add(`${a.texture.group}:${a.texture.binding}`);
  }
  const i = (s) => n.get(`${s.group}:${s.binding}`) ?? 0;
  return Object.defineProperty(i, "filterable", { value: r }), i;
}
function Js(t, e, n = Nr) {
  return t.flatMap((r) => {
    var s;
    if (r.group !== e)
      return [];
    const i = n(r);
    return i === 0 ? [] : [{ binding: r.binding, visibility: i, ...cd(r, ((s = n.filterable) == null ? void 0 : s.has(`${r.group}:${r.binding}`)) ?? !1) }];
  });
}
function od(t, e, n, r = Nr) {
  const i = /* @__PURE__ */ new Map(), s = n.bindings.filter((a) => r(a) !== 0).map((a) => a.group), o = Math.max(-1, ...s);
  for (let a = 0; a <= o; a++)
    i.set(a, ad(t, e, n, a, r));
  return i;
}
function ad(t, e, n, r, i = Nr) {
  return Zs(t, `${e}.group${r}.bgl`, Js(n.bindings, r, i));
}
function Zs(t, e, n) {
  let r = Ii.get(t.gpu);
  r || (r = /* @__PURE__ */ new Map(), Ii.set(t.gpu, r));
  const i = JSON.stringify(n), s = r.get(i);
  if (s)
    return s;
  const o = Ya(t.gpu.createBindGroupLayout({ label: e, entries: n }), { entries: n });
  return r.set(i, o), o;
}
function cd(t, e) {
  const n = t.bindingLayout;
  if (!n)
    throw oe("bindGroupLayout", `Binding '${t.name}' does not have a reflected bindingLayout.`);
  return e && n.kind === "texture" && n.texture.sampleType === "unfilterable-float" && !n.texture.multisampled ? { texture: { ...n.texture, sampleType: "float" } } : ld(n);
}
function ld(t) {
  switch (t.kind) {
    case "buffer":
      return { buffer: { ...t.buffer } };
    case "sampler":
      return { sampler: { ...t.sampler } };
    case "texture":
      return { texture: { ...t.texture } };
    case "storageTexture":
      return { storageTexture: { ...t.storageTexture } };
    case "externalTexture":
      return { externalTexture: {} };
  }
}
function Nr(t) {
  const e = globalThis.GPUShaderStage, n = (e == null ? void 0 : e.VERTEX) ?? 1, r = (e == null ? void 0 : e.FRAGMENT) ?? 2, i = (e == null ? void 0 : e.COMPUTE) ?? 4;
  return t.kind === "buffer" ? n | r | i : r | i;
}
function ud(t) {
  const e = dd(t.reflection), n = [...t.bindGroupLayouts.keys()].sort((m, v) => m - v), r = /* @__PURE__ */ new Map();
  function i(m) {
    const v = [];
    for (const [C, A] of Object.entries(m))
      v.push(...o(C, A));
    return v;
  }
  function s(m) {
    var C;
    const v = t.bindGroupLayouts.get(m.info.group);
    return !!v && !!((C = Ot(v)) != null && C.entries.some((A) => A.binding === m.info.binding));
  }
  function o(m, v) {
    const C = e.get(m);
    if (C)
      return a(C, m, v);
    const A = fd(m, e, t.label);
    if (!A)
      throw oe(`${t.label}.set`, `Binding '${m}' does not exist in '${t.label}'.`);
    return c(A, m, v);
  }
  function a(m, v, C) {
    $(m.info.group);
    const A = $i(m.info, C);
    Ci(m, v, A);
    const R = mn(m.identity);
    return A === "lib" ? l(m, gd(m.libValue, C)) : d(m, C), s(m) ? zn(m, R) : [];
  }
  function c(m, v, C) {
    $(m.info.group);
    const A = $i(m.info, C);
    if (Ci(m, v, A), hd(m, v, A), A !== "lib")
      throw oe(`${t.label}.set`, `Member '${v}' needs a JS value; set resource '${m.info.name}' instead.`);
    const R = mn(m.identity);
    return l(m, { ...bd(m.libValue), [v]: C }), s(m) ? zn(m, R) : [];
  }
  function l(m, v) {
    const C = k(m);
    m.libValue = v;
    const A = Ju(C, v);
    m.buffer || F(m, C.size), m.bytes = A, m.buffer.write(A, 0);
  }
  function u(m) {
    var R, G;
    const v = (R = Ot(t.bindGroupLayouts.get(m.group))) == null ? void 0 : R.entries.find((P) => P.binding === m.binding), C = t.reflection.entryPoints.flatMap((P) => En(P, "samplingPairs", t.label)).find((P) => P.mode === "filtering" && P.texture.group === m.group && P.texture.binding === m.binding), A = C && t.reflection.bindings.find((P) => P.group === C.sampler.group && P.binding === C.sampler.binding);
    return { sourceHint: t.label, filterableTexture: ((G = v == null ? void 0 : v.texture) == null ? void 0 : G.sampleType) === "float", float32Filterable: t.device.features.has("float32-filterable"), pairedSampler: A };
  }
  function d(m, v) {
    var A, R, G, P;
    const C = Ei(m.info, v, u(m.info));
    (A = m.unsubscribe) == null || A.call(m), (R = m.unsubscribeRecreate) == null || R.call(m), m.resource = C.resource, m.identity = C.identity, m.unsubscribe = (G = C.unsubscribe) == null ? void 0 : G.call(C, () => {
      m.identity && t.cache.evictIdentity(m.identity);
    }), m.unsubscribeRecreate = (P = C.onRecreate) == null ? void 0 : P.call(C, () => f(m, v));
  }
  function f(m, v) {
    var R, G, P, X, Y;
    const C = mn(m.identity);
    m.identity && t.cache.evictIdentity(m.identity);
    const A = Ei(m.info, v, u(m.info));
    if ((R = m.unsubscribe) == null || R.call(m), (G = m.unsubscribeRecreate) == null || G.call(m), m.resource = A.resource, m.identity = A.identity, m.unsubscribe = (P = A.unsubscribe) == null ? void 0 : P.call(A, () => {
      m.identity && t.cache.evictIdentity(m.identity);
    }), m.unsubscribeRecreate = (X = A.onRecreate) == null ? void 0 : X.call(A, () => f(m, v)), s(m))
      for (const Ue of zn(m, C))
        (Y = t.onIdentityChange) == null || Y.call(t, Ue);
  }
  function h(m, v, C) {
    g(m), pd(t.label, m, v, C);
    const A = r.has(m) ? `claimed-group:${m}` : void 0;
    return r.set(m, v), A;
  }
  function g(m) {
    const v = t.bindGroupLayouts.get(m);
    if (!v)
      throw oe(`${t.label}.layout`, `@group(${m}) does not exist in '${t.label}'.`);
    return v;
  }
  function w() {
    return n.map(b);
  }
  function b(m) {
    var X;
    const v = r.get(m);
    if (v)
      return { group: m, bindGroup: v, offsets: [], claimValidation: _(v, m) };
    const C = new Set((X = Ot(g(m))) == null ? void 0 : X.entries.map((Y) => Y.binding)), A = t.reflection.bindings.filter((Y) => Y.group === m && C.has(Y.binding)), R = y(A), G = E(A), P = t.cache.getOrCreate(t.drawId, m, G, () => t.device.gpu.createBindGroup({
      label: `${t.label}.group${m}`,
      layout: g(m),
      entries: R
    }));
    return { group: m, bindGroup: P, offsets: [] };
  }
  function _(m, v) {
    return bs(m) ? void 0 : { label: t.label, group: v };
  }
  function y(m) {
    return m.map((v) => {
      const C = L(v);
      return { binding: v.binding, resource: C.resource };
    });
  }
  function E(m) {
    return m.map((v) => L(v).identity);
  }
  function L(m) {
    const v = e.get(m.name);
    if (!(v != null && v.resource) || !v.identity)
      throw ec(t.label, m);
    return v;
  }
  function $(m) {
    if (r.has(m))
      throw tc(t.label, m);
  }
  function F(m, v) {
    m.buffer = t.device.createBuffer({ size: v, usage: ["uniform", "copy_dst"], label: `${t.label}.${m.info.name}` }), m.resource = { buffer: m.buffer.gpu, offset: 0, size: v }, m.identity = m.buffer.resourceIdentity, m.unsubscribe = m.buffer.onDestroy(() => t.cache.evictIdentity(m.buffer.resourceIdentity));
  }
  function k(m) {
    var v;
    if (m.info.kind !== "buffer" || !((v = m.info.layout) != null && v.size))
      throw oe(`${t.label}.set`, `Binding '${m.info.name}' needs a compatible resource, not JS.`);
    return m.info.layout;
  }
  return {
    get groups() {
      return n;
    },
    set: i,
    claimGroup: h,
    layout: g,
    bindGroups: w,
    bindingState(m) {
      const v = e.get(m);
      if (!(!(v != null && v.ownership) || !v.resource || !v.identity))
        return { info: v.info, ownership: v.ownership, resource: v.resource, identity: v.identity };
    }
  };
}
function dd(t) {
  return new Map(t.bindings.map((e) => [e.name, { info: e, memberOwnership: /* @__PURE__ */ new Map() }]));
}
function fd(t, e, n) {
  var i, s;
  let r;
  for (const o of e.values())
    if ((s = (i = o.info.layout) == null ? void 0 : i.members) != null && s.some((a) => a.name === t)) {
      if (r)
        throw oe(`${n}.set`, `Binding member '${t}' is ambiguous in '${n}'; set the complete binding.`);
      r = o;
    }
  return r;
}
function $i(t, e) {
  var n;
  return ((n = t.bindingLayout) == null ? void 0 : n.kind) === "buffer" && zu(e) ? "lib" : "user";
}
function Ci(t, e, n) {
  if (t.ownership && t.ownership !== n)
    throw xs(e, t.ownership);
  t.ownership ?? (t.ownership = n);
}
function hd(t, e, n) {
  const r = t.memberOwnership.get(e);
  if (r && r !== n)
    throw xs(e, r);
  t.memberOwnership.set(e, n);
}
function pd(t, e, n, r) {
  const i = bs(n);
  if (!i)
    return;
  const s = Ot(r);
  if (!s)
    return;
  const o = md(s.entries, i.layout.entries);
  if (o)
    throw nc(t, e, o);
}
function md(t, e) {
  if (t.length !== e.length)
    return `expected ${t.length} bindings and received ${e.length}`;
  const n = Ti(t), r = Ti(e);
  for (const [i, s] of n) {
    const o = r.get(i);
    if (!o)
      return `missing @binding(${i})`;
    if (Li(s) !== Li(o))
      return `@binding(${i}) does not match the reflected layout`;
  }
}
function Ti(t) {
  return new Map(t.map((e) => [e.binding, e]));
}
function Li(t) {
  return JSON.stringify({
    binding: t.binding,
    visibility: t.visibility,
    buffer: t.buffer,
    sampler: t.sampler,
    texture: t.texture,
    storageTexture: t.storageTexture,
    externalTexture: t.externalTexture ? {} : void 0
  });
}
function zn(t, e) {
  const n = mn(t.identity);
  return !n || e === n ? [] : [{
    group: t.info.group,
    binding: t.info.binding,
    bindingName: t.info.name,
    bindingKind: t.info.kind,
    previousIdentity: e,
    newIdentity: n
  }];
}
function mn(t) {
  return t === void 0 ? void 0 : tr(t);
}
function gd(t, e) {
  return nr(t) && nr(e) ? { ...t, ...e } : e;
}
function bd(t) {
  return nr(t) ? t : {};
}
const xd = "rgba8unorm", Ur = Object.freeze([0, 0, 0, 1]);
function $n(t, e) {
  const n = t, r = Array.isArray(t) ? t : [n == null ? void 0 : n.r, n == null ? void 0 : n.g, n == null ? void 0 : n.b, n == null ? void 0 : n.a];
  if (r.length !== 4 || !r.every((i) => typeof i == "number" && Number.isFinite(i)))
    throw Ic(e);
  return Vr(t);
}
function Vr(t) {
  const e = t;
  return Array.isArray(t) ? [t[0], t[1], t[2], t[3]] : { r: e.r, g: e.g, b: e.b, a: e.a };
}
function gn(t) {
  return t.colors ?? [{ format: t.format ?? xd }];
}
function Qs(t) {
  return t.depth === !0 ? "depth24plus" : t.depth || void 0;
}
function eo(t) {
  const e = t.msaa;
  if (e === !0 || e === 4)
    return 4;
  if (e === void 0 || e === !1)
    return 1;
  const n = _s();
  throw n.code = "VGPU-TARGET-MSAA-INVALID", n.message = `msaa received ${e}; WebGPU 1|4; use true`, n;
}
function wd(t, e) {
  if (!(t != null && t.size))
    throw _s();
  const n = Qs(t);
  if (n === "stencil8")
    throw _c(n);
  if (eo(t) === 4)
    for (const r of gn(t))
      _d(r.format, e);
}
function _d(t, e) {
  if (e.isCompatibilityMode && t === "rgba16float")
    throw oe("target", "Dawn compatibility mode does not support rgba16float+msaa.", "Use rgba8unorm for MSAA here, or disable msaa.");
}
function yd(t, e, n, r) {
  const i = {
    view: (e ?? t).createView(),
    resolveTarget: e ? t.createView() : void 0,
    loadOp: r ? "load" : "clear",
    storeOp: e ? "discard" : "store"
  };
  return r || (i.clearValue = to(n)), i;
}
function vd(t, e, n, r, i) {
  if (i) {
    const o = { view: t.createView(), depthReadOnly: !0 };
    return Wt(t.format) && (o.stencilReadOnly = !0), o;
  }
  const s = { view: t.createView(), depthLoadOp: e ? "load" : "clear", depthStoreOp: t.sampleCount > 1 ? "discard" : "store" };
  return e || (s.depthClearValue = n ?? 1), t.format && Wt(t.format) && (s.stencilLoadOp = e ? "load" : "clear", s.stencilStoreOp = t.sampleCount > 1 ? "discard" : "store", e || (s.stencilClearValue = r ?? 0)), s;
}
function Wt(t) {
  return !!t && t.includes("stencil");
}
function to(t) {
  return Array.isArray(t) ? { r: t[0], g: t[1], b: t[2], a: t[3] } : t;
}
function no(t, e) {
  return t[0] === e[0] && t[1] === e[1];
}
function Pn(t) {
  return typeof t == "object" && t !== null && typeof t.renderPassDescriptor == "function";
}
let Sd = 1, Ed = 1;
const Ad = /* @__PURE__ */ new WeakMap(), Id = /* @__PURE__ */ new WeakMap();
function ro(t) {
  var e;
  return Pn(t) ? {
    colors: t.colors.map((n) => n.format),
    depth: (e = t.depth) == null ? void 0 : e.format,
    sampleCount: t.sampleCount
  } : typeof t != "object" || t === null ? { colors: [] } : {
    colors: Array.isArray(t.colors) ? [...t.colors] : t.colors ?? [],
    depth: t.depth,
    sampleCount: t.sampleCount ?? 1
  };
}
function Cn(t) {
  return `${t.colors.join(",")}:${t.depth ?? "none"}:${t.sampleCount ?? 1}`;
}
function io(t, e) {
  if (!Array.isArray(t.colors) || t.colors.length === 0)
    throw sn(e, "colors must be a non-empty array.");
  const n = t.colors.find((i) => typeof i != "string" || i.length === 0);
  if (n !== void 0)
    throw sn(e, `colors must contain only GPUTextureFormat strings; received ${String(n)}.`);
  if (t.depth !== void 0 && (typeof t.depth != "string" || t.depth.length === 0))
    throw sn(e, "depth must be a GPUTextureFormat string.");
  const r = t.sampleCount ?? 1;
  if (r !== 1 && r !== 4)
    throw sn(e, `sampleCount must be 1 or 4; received ${String(r)}.`);
}
function $d(t) {
  const e = `${Mi(Ad, t.module, () => Sd++)}|${Mi(Id, t.pipelineLayout, () => Ed++)}|${Dd(t.vertexBufferLayouts ?? [])}|${Cn(t.signature)}`, n = t.topology || t.stripIndexFormat ? `${e}|${t.topology ?? "triangle-list"}|${t.stripIndexFormat ?? "none"}` : e, r = t.cullMode || t.frontFace ? `${n}|${t.cullMode ?? "none"}|${t.frontFace ?? "ccw"}` : n, i = t.unclippedDepth ? `${r}|unclipped` : r, s = t.depthKey ? `${i}|${t.depthKey}` : i, o = t.stencilKey ? `${s}|${t.stencilKey}` : s, a = t.multisampleKey ? `${o}|${t.multisampleKey}` : o, c = t.constantsKey ? `${a}|${t.constantsKey}` : a, l = t.entryKey ? `${c}|${t.entryKey}` : c;
  return t.fragmentKey ? `${l}|${t.fragmentKey}` : l;
}
function Fi(t, e, n, r, i) {
  if (r === void 0)
    return e.find((o) => o.stage === n);
  if (typeof r != "string")
    throw fn(t, `${n} received ${rr(r)}; expected an entry point name string.`, i);
  const s = e.find((o) => o.name === r);
  if (!s)
    throw fn(t, `"${r}" matches no entry point in the shader; available entry points: ${ki(e)}.`, i);
  if (s.stage !== n)
    throw fn(t, `"${r}" is a @${s.stage} entry point, not @${n}; available entry points: ${ki(e)}.`, i);
  return s;
}
function ki(t) {
  return t.length ? t.map((e) => `"${e.name}" (@${e.stage})`).join(", ") : "none";
}
function Cd(t, e, n, r) {
  if (e !== void 0 && (typeof e != "object" || e === null || Array.isArray(e)))
    throw rn(t, `received ${rr(e)}; expected { overrideNameOrId: number | boolean }.`, r);
  const i = new Map(n.map((o) => [Di(o), o])), s = {};
  for (const [o, a] of Object.entries(e ?? {})) {
    if (!i.has(o))
      throw rn(t, `"${o}" matches no override in the shader; available overrides: ${Td(n)}.`, r);
    if (typeof a == "boolean") {
      s[o] = a ? 1 : 0;
      continue;
    }
    if (typeof a != "number" || !Number.isFinite(a))
      throw rn(t, `"${o}" received ${rr(a)}; use a finite number or a boolean (WebGPU converts the value to the override's WGSL type, and NaN/Infinity fail that conversion).`, r);
    s[o] = a;
  }
  for (const o of n) {
    const a = Di(o);
    if (o.defaultValue === void 0 && !(a in s))
      throw rn(t, `override '${o.name}' has no default value and must be provided; add constants: { "${a}": value }.`, r);
  }
  return Object.keys(s).length === 0 ? {} : { constants: s, constantsKey: Ld(s) };
}
function Di(t) {
  return t.id !== void 0 ? String(t.id) : t.name;
}
function Td(t) {
  return t.length ? t.map((e) => e.id !== void 0 ? `"${e.id}" (@id of ${e.name})` : `"${e.name}"`).join(", ") : "none";
}
function Ld(t) {
  return `cn~${Object.entries(t).sort(([e], [n]) => e < n ? -1 : e > n ? 1 : 0).map(([e, n]) => `${e}=${n}`).join("~")}`;
}
function rr(t) {
  if (typeof t == "string")
    return `"${t}"`;
  try {
    return JSON.stringify(t) ?? String(t);
  } catch {
    return String(t);
  }
}
function so(t) {
  const e = /* @__PURE__ */ new Map();
  return {
    get(n, r) {
      let i = e.get(n);
      return i || (i = t.gpu.createShaderModule({ label: r, code: n }), e.set(n, i)), i;
    },
    dispose() {
      e.clear();
    }
  };
}
function oo(t) {
  const e = /* @__PURE__ */ new Map();
  return {
    get(n) {
      const r = Md(n);
      let i = e.get(r);
      return i || (i = t.gpu.createPipelineLayout({ bindGroupLayouts: Pd(n) }), e.set(r, i)), i;
    },
    dispose() {
      e.clear();
    }
  };
}
function ao(t, e = {}) {
  return new Fd(t, e);
}
var W, Me, Je, qt, mt, Z, co, lo, uo, ir, sr;
class Fd {
  constructor(e, n) {
    T(this, Z);
    x(this, "device");
    T(this, W, /* @__PURE__ */ new Map());
    T(this, Me, /* @__PURE__ */ new Set());
    T(this, Je);
    T(this, qt);
    T(this, mt, !1);
    var r;
    this.device = e, M(this, Je, n.errorSink ?? (() => {
    })), M(this, qt, (r = n.registerSettledSource) == null ? void 0 : r.call(n, () => [...p(this, Me)]));
  }
  getReady(e) {
    var n;
    return (n = p(this, W).get(e)) == null ? void 0 : n.pipeline;
  }
  getSync(e, n, r) {
    var a;
    S(this, Z, ir).call(this, r.where);
    const i = p(this, W).get(e);
    if (i != null && i.pipeline)
      return i.pipeline;
    const s = i ?? {};
    i || p(this, W).set(e, s);
    const o = S(this, Z, co).call(this, e, s, n, r);
    if (!o) {
      s.pending || p(this, W).delete(e);
      return;
    }
    return s.pipeline = o, (a = s.pending) == null || a.resolve(o), s.pending = void 0, o;
  }
  getAsync(e, n, r) {
    S(this, Z, ir).call(this, r.where);
    const i = p(this, W).get(e);
    if (i != null && i.pipeline)
      return Promise.resolve(i.pipeline);
    if (i != null && i.pending)
      return i.pending.promise;
    const s = {}, o = kd();
    s.pending = o, p(this, W).set(e, s);
    let a;
    try {
      a = n();
    } catch (c) {
      const l = Lt(r.where, c, r.signature);
      return o.reject(l), p(this, W).delete(e), o.promise;
    }
    return S(this, Z, sr).call(this, a), a.then((c) => {
      p(this, W).get(e) !== s || s.pipeline || s.pending !== o || (s.pipeline = c, s.pending = void 0, o.resolve(c));
    }, (c) => {
      p(this, W).get(e) !== s || s.pipeline || s.pending !== o || (s.pending = void 0, p(this, W).delete(e), o.reject(Lt(r.where, c, r.signature)));
    }), o.promise;
  }
  dispose() {
    var n, r;
    if (p(this, mt))
      return;
    M(this, mt, !0);
    const e = di("gpu.dispose");
    for (const i of p(this, W).values())
      (n = i.pending) == null || n.reject(e);
    p(this, W).clear(), p(this, Me).clear(), (r = p(this, qt)) == null || r.call(this);
  }
}
W = new WeakMap(), Me = new WeakMap(), Je = new WeakMap(), qt = new WeakMap(), mt = new WeakMap(), Z = new WeakSet(), co = function(e, n, r, i) {
  const s = this.device.gpu, o = typeof s.pushErrorScope == "function" && typeof s.popErrorScope == "function";
  o && s.pushErrorScope("validation");
  try {
    const a = r();
    return o && S(this, Z, lo).call(this, e, n, i), a;
  } catch (a) {
    o && S(this, Z, uo).call(this);
    const c = Lt(i.where, a, i.signature);
    p(this, Je).call(this, c);
    return;
  }
}, lo = function(e, n, r) {
  const i = this.device.gpu.popErrorScope().then((s) => {
    if (!s)
      return;
    const o = Lt(r.where, s, r.signature);
    return p(this, W).get(e) === n && p(this, W).delete(e), p(this, Je).call(this, o);
  }, (s) => {
    const o = Lt(r.where, s, r.signature);
    return p(this, W).get(e) === n && p(this, W).delete(e), p(this, Je).call(this, o);
  });
  S(this, Z, sr).call(this, i);
}, uo = function() {
  var n, r;
  const e = (r = (n = this.device.gpu).popErrorScope) == null ? void 0 : r.call(n);
  e && e.catch(() => {
  });
}, ir = function(e) {
  if (p(this, mt))
    throw di(e);
}, sr = function(e) {
  p(this, Me).add(e), e.catch(() => {
  }).then(() => p(this, Me).delete(e), () => p(this, Me).delete(e));
};
function kd() {
  let t, e;
  const n = new Promise((r, i) => {
    t = r, e = i;
  });
  return n.catch(() => {
  }), { promise: n, resolve: t, reject: e };
}
function Mi(t, e, n) {
  let r = t.get(e);
  return r || (r = n(), t.set(e, r)), r;
}
function Dd(t) {
  return JSON.stringify(t.map((e) => ({
    arrayStride: e.arrayStride,
    stepMode: e.stepMode ?? "vertex",
    attributes: [...e.attributes].map((n) => ({
      shaderLocation: n.shaderLocation,
      offset: n.offset,
      format: n.format
    }))
  })));
}
function Md(t) {
  return JSON.stringify([...t.entries()].map(([e, n]) => ({ group: e, entries: Od(n) })));
}
function Pd(t) {
  const e = Math.max(-1, ...t.keys()), n = [];
  for (let r = 0; r <= e; r++)
    n.push(Rd(t, r));
  return n;
}
function Rd(t, e) {
  const n = t.get(e);
  if (!n)
    throw wc(e);
  return n;
}
function Od(t) {
  var e;
  return (((e = Ot(t)) == null ? void 0 : e.entries) ?? []).map((n) => ({
    binding: n.binding,
    visibility: n.visibility,
    buffer: n.buffer ? { ...n.buffer } : void 0,
    sampler: n.sampler ? { ...n.sampler } : void 0,
    texture: n.texture ? { ...n.texture } : void 0,
    storageTexture: n.storageTexture ? { ...n.storageTexture } : void 0,
    externalTexture: n.externalTexture ? { ...n.externalTexture } : void 0
  }));
}
const Gd = Qt("frame-state");
function Br(t) {
  return t.service(Gd, Nd);
}
function Nd() {
  const t = /* @__PURE__ */ new Set();
  let e = Pi(), n = !1, r = !1;
  const i = {
    time: 0,
    deltaTime: 0,
    frameCount: 0,
    advanceBy(s) {
      i.deltaTime = s, i.time += s, r = !0;
    },
    tick() {
      if (n)
        throw ys();
      n = !0;
      try {
        const s = Pi();
        r ? r = !1 : (i.deltaTime = Math.max(0, (s - e) / 1e3), i.time += i.deltaTime), e = s, i.frameCount += 1;
        for (const o of [...t])
          o();
      } finally {
        n = !1;
      }
    },
    onAdvance(s) {
      return t.add(s), () => {
        t.delete(s);
      };
    }
  };
  return i;
}
function Pi() {
  var t, e;
  return ((e = (t = globalThis.performance) == null ? void 0 : t.now) == null ? void 0 : e.call(t)) ?? Date.now();
}
function Ud(t, e, n = {}) {
  const r = Ie(t, "surface"), i = Bd(r), s = i.get(e);
  if (s && !s.disposed)
    throw vc(s.label);
  const o = new ho(r.device, e, n, (l) => {
    i.get(l.canvas) === l && i.delete(l.canvas), a(), c();
  }), a = Br(r).onAdvance(() => o.applyAutoResize()), c = r.own("resource", () => o.dispose());
  return i.set(e, o), o;
}
const Vd = Qt("surfaces");
function Bd(t) {
  return t.service(Vd, () => /* @__PURE__ */ new Map());
}
let Mt = 0, zr = 0;
function zd() {
  return Mt > 0;
}
function fo() {
  return zr > 0;
}
function Wd() {
  zr += 1;
}
function Hd() {
  zr -= 1;
}
function Wr(t) {
  return t instanceof ho;
}
var Xt, Ze, Qe, xe, gt, Pe, Re, U, or, po, mo, ar, ne;
class ho {
  constructor(e, n, r, i) {
    T(this, U);
    x(this, "device");
    x(this, "canvas");
    x(this, "options");
    x(this, "unregister");
    x(this, "resourceIdentity", kn("render-target"));
    x(this, "label");
    x(this, "context");
    x(this, "autoResize");
    x(this, "layoutBacked");
    x(this, "format");
    T(this, Xt, new Dn());
    T(this, Ze, /* @__PURE__ */ new Set());
    T(this, Qe, /* @__PURE__ */ new Set());
    T(this, xe);
    T(this, gt);
    T(this, Pe, !1);
    T(this, Re, !1);
    this.device = e, this.canvas = n, this.options = r, this.unregister = i, this.label = r.label, M(this, gt, r.clearColor === void 0 ? Ur : $n(r.clearColor, "surface.clearColor"));
    const s = n.getContext("webgpu");
    if (!s)
      throw yc();
    if (this.context = s, this.layoutBacked = jd(n), r.autoResize === !0 && !this.layoutBacked)
      throw Ec();
    this.autoResize = r.autoResize ?? (r.size ? !1 : this.layoutBacked), M(this, xe, Oi(r.dpr)), this.format = r.format ?? qd();
    const o = Kd(n, r, this.layoutBacked, p(this, xe));
    (r.size || this.layoutBacked) && Ri(n, o), s.configure({
      device: e.gpu,
      format: this.format,
      alphaMode: r.alphaMode ?? "premultiplied",
      colorSpace: r.colorSpace ?? "srgb",
      usage: Xd()
    });
  }
  get gpu() {
    return this.context;
  }
  get size() {
    return S(this, U, ne).call(this), bn(this.canvas);
  }
  get texelSize() {
    const e = this.size;
    return [1 / e[0], 1 / e[1]];
  }
  get color() {
    return S(this, U, ne).call(this), new $t(this.device, this.context.getCurrentTexture(), {
      size: this.size,
      format: this.format,
      usage: ["render_attachment", "texture_binding", "copy_src"],
      label: this.options.label ? `${this.options.label}.color` : "surface.color"
    }, "external");
  }
  get colors() {
    return [this.color];
  }
  get depth() {
    S(this, U, ne).call(this);
  }
  get sampleCount() {
    return S(this, U, ne).call(this), 1;
  }
  get dpr() {
    return p(this, xe);
  }
  /** Default clear color of this surface; passes that clear without naming a color use it. */
  get clearColor() {
    return Vr(p(this, gt));
  }
  set clearColor(e) {
    M(this, gt, $n(e, "surface.clearColor"));
  }
  get disposed() {
    return p(this, Pe);
  }
  resize(e) {
    if (S(this, U, ne).call(this), p(this, Re))
      throw Ac(this.options.label);
    S(this, U, or).call(this, Tn(e), p(this, xe), !0);
  }
  applyAutoResize() {
    if (p(this, Pe) || !this.autoResize || !this.layoutBacked)
      return;
    const e = Oi(this.options.dpr), n = go(this.canvas, e);
    S(this, U, or).call(this, n, e, !0);
  }
  onResize(e) {
    S(this, U, ne).call(this), p(this, Ze).add(e), M(this, Re, !0), Mt += 1;
    try {
      e(S(this, U, ar).call(this));
    } finally {
      Mt -= 1, M(this, Re, !1);
    }
    return () => {
      p(this, Ze).delete(e);
    };
  }
  async read() {
    return S(this, U, ne).call(this), this.color.read();
  }
  async readFloats() {
    return S(this, U, ne).call(this), this.color.readFloats();
  }
  onDestroy(e) {
    return S(this, U, ne).call(this), p(this, Xt).onDestroy(this, e);
  }
  onTexturesRecreated(e) {
    return S(this, U, ne).call(this), p(this, Qe).add(e), () => {
      p(this, Qe).delete(e);
    };
  }
  renderPassDescriptor(e = {}) {
    const { clear: n = [0, 0, 0, 1], preserve: r } = e;
    S(this, U, ne).call(this);
    const i = { view: this.context.getCurrentTexture().createView(), loadOp: r ? "load" : "clear", storeOp: "store" };
    return r || (i.clearValue = to(n)), { colorAttachments: [i] };
  }
  dispose() {
    var e, n;
    if (!p(this, Pe)) {
      M(this, Pe, !0);
      try {
        (n = (e = this.context).unconfigure) == null || n.call(e);
      } catch {
      }
      this.unregister(this), p(this, Ze).clear(), p(this, Qe).clear(), p(this, Xt).emit(this);
    }
  }
}
Xt = new WeakMap(), Ze = new WeakMap(), Qe = new WeakMap(), xe = new WeakMap(), gt = new WeakMap(), Pe = new WeakMap(), Re = new WeakMap(), U = new WeakSet(), or = function(e, n, r) {
  const i = !no(bn(this.canvas), e);
  M(this, xe, n), i && (Ri(this.canvas, e), S(this, U, po).call(this), r && S(this, U, mo).call(this));
}, po = function() {
  for (const e of [...p(this, Qe)])
    e();
}, mo = function() {
  M(this, Re, !0), Mt += 1;
  try {
    const e = S(this, U, ar).call(this);
    for (const n of [...p(this, Ze)])
      n(e);
  } finally {
    Mt -= 1, M(this, Re, !1);
  }
}, ar = function() {
  const e = bn(this.canvas);
  return { width: e[0], height: e[1], dpr: p(this, xe), surface: this };
}, ne = function() {
  if (p(this, Pe))
    throw Sc(this.options.label);
};
function jd(t) {
  return typeof t.clientWidth == "number";
}
function Kd(t, e, n, r) {
  return e.size ? Tn(e.size) : n ? go(t, r) : Tn(bn(t));
}
function go(t, e) {
  const n = t;
  return Tn([Math.round(n.clientWidth * e), Math.round(n.clientHeight * e)]);
}
function bn(t) {
  const e = t;
  return [e.width, e.height];
}
function Ri(t, e) {
  const n = t;
  n.width = e[0], n.height = e[1];
}
function Tn(t) {
  return [Math.max(1, Math.floor(t[0])), Math.max(1, Math.floor(t[1]))];
}
function Oi(t) {
  const e = globalThis.devicePixelRatio ?? 1;
  return Array.isArray(t) ? Math.min(t[1], Math.max(t[0], e)) : typeof t == "number" ? t : e;
}
function qd() {
  var t, e, n;
  return ((n = (e = (t = globalThis.navigator) == null ? void 0 : t.gpu) == null ? void 0 : e.getPreferredCanvasFormat) == null ? void 0 : n.call(e)) ?? "bgra8unorm";
}
function Xd() {
  const t = globalThis.GPUTextureUsage;
  return t ? t.RENDER_ATTACHMENT | t.TEXTURE_BINDING | t.COPY_SRC : void 0;
}
const Yd = {
  drawIndirect: { bytes: 16, args: "4 u32 values: vertexCount, instanceCount, firstVertex, firstInstance" },
  drawIndexedIndirect: { bytes: 20, args: "5 32-bit values: indexCount, instanceCount, firstIndex, baseVertex (signed), firstInstance" },
  dispatchWorkgroupsIndirect: { bytes: 12, args: "3 u32 values: workgroupCountX, workgroupCountY, workgroupCountZ" }
};
function Jd(t, e, n, r) {
  const i = typeof n == "object" && n !== null ? n.buffer : void 0, s = Gi(n) ? n : Gi(i) ? i : void 0;
  if (!s)
    throw at(t, `received ${Ni(n)}; expected a StorageBuffer or { buffer, offset? }.`, e);
  const o = s === n ? 0 : n.offset ?? 0;
  if (typeof o != "number" || !Number.isInteger(o) || o < 0)
    throw at(t, `offset must be an integer >= 0; received ${Ni(o)}.`, e);
  if (o % 4 !== 0)
    throw at(t, `offset must be a multiple of 4 (WebGPU requires "indirectOffset is a multiple of 4"); received ${o}.`, e);
  if (!s.buffer.options.usage.includes("indirect"))
    throw at(t, `the buffer lacks the "indirect" usage (WebGPU requires "indirectBuffer.usage contains INDIRECT"); create it with storage(gpu, ${s.size}, { indirect: true }).`, e);
  const { bytes: a, args: c } = Yd[r];
  if (o + a > s.size)
    throw at(t, `${r} reads ${a} bytes (${c}) at offset ${o}, but offset + ${a} = ${o + a} exceeds the buffer size ${s.size}.`, e);
  return { buffer: s.gpu, offset: o };
}
function Gi(t) {
  return typeof t == "object" && t !== null && "gpu" in t && "size" in t && t.buffer instanceof Ae;
}
function Ni(t) {
  if (typeof t == "string")
    return `"${t}"`;
  try {
    return JSON.stringify(t) ?? String(t);
  } catch {
    return String(t);
  }
}
const Ln = Symbol("vgpu.frame.drawable");
function Zd(t) {
  return t == null ? void 0 : t[Ln];
}
const bo = Symbol("vgpu.frame.bundle");
function Qd(t) {
  return t == null ? void 0 : t[bo];
}
const xo = Symbol("vgpu.frame.passAttachment");
function ef(t) {
  return typeof (t == null ? void 0 : t[xo]) == "function" ? t : void 0;
}
let Ui = 1;
function tf(t) {
  const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new WeakMap();
  return {
    sampler(r = {}) {
      const i = cr(r);
      let s = e.get(i);
      return s || (s = t.gpu.createSampler(r), e.set(i, s), n.set(s, { kind: "sampler", id: Ui++ })), s;
    },
    identity(r) {
      let i = n.get(r);
      return i || (i = { kind: "sampler", id: Ui++ }, n.set(r, i)), i;
    }
  };
}
function cr(t) {
  if (t === null || typeof t != "object")
    return JSON.stringify(t);
  if (Array.isArray(t))
    return `[${t.map(cr).join(",")}]`;
  const e = t;
  return `{${Object.keys(e).sort().map((n) => `${JSON.stringify(n)}:${cr(e[n])}`).join(",")}}`;
}
const nf = Qt("render-service");
function rf(t) {
  return t.service(nf, sf);
}
function sf(t) {
  const e = t.device, n = Vs(), r = ao(e, {
    errorSink: (a) => t.reportError(a),
    registerSettledSource: (a) => t.registerSettledSource(a)
  }), i = so(e), s = oo(e), o = tf(e);
  return t.own("service", () => {
    r.dispose(), i.dispose(), s.dispose(), n.dispose();
  }), { binds: n, pipelines: r, shaderModules: i, pipelineLayouts: s, sampler: (a) => o.sampler(a) };
}
function of(t) {
  if (typeof t == "string")
    return t;
  if (!af(t) || !("version" in t) || t.version !== 1)
    throw on(t);
  const n = t.wgsl;
  if (typeof n != "string")
    throw on(t);
  return n;
}
function af(t) {
  return typeof t == "object" && t !== null;
}
function xn(t, e) {
  const n = Ie(t, "draw"), r = rf(n), i = of(e.shader);
  return new _o(n.device, i, { ...e, shader: i }, r.binds, void 0, r.pipelines, r.shaderModules, r.pipelineLayouts, (s) => n.reportError(s), (s) => {
    n.trackDelivery(s);
  });
}
let cf = 1;
const wo = /* @__PURE__ */ new WeakMap();
var bt, N, yo, vo, Pt, So, Eo, Ao, Io, lr, ur;
class _o {
  constructor(e, n, r, i = Vs(), s, o = ao(e), a = so(e), c = oo(e), l, u) {
    T(this, N);
    x(this, "source");
    x(this, "label");
    T(this, bt, /* @__PURE__ */ new Map());
    this.source = n, H(e, "Draw.constructor"), this.label = r.label ?? "draw";
    const d = cf++, f = Us(n, `${this.label}.wgsl`), h = bf(this.label, r.entry), g = Fi(this.label, f.entryPoints, "vertex", h.vertex, "draw"), w = Fi(this.label, f.entryPoints, "fragment", h.fragment, "draw"), b = xf(f, g, w), _ = [g, w].filter((ce) => !!ce), y = sd(f.bindings, _);
    lf(e, this.label, f.bindings, _, y);
    const E = r.geometry, L = g ? En(g, "inputs", this.label) : [], $ = E && It in E ? E[It](L, `${this.label}.geometry`) : E == null ? void 0 : E.vertexBufferLayouts, F = new Map(od(e, this.label, f, y)), k = c.get(F), m = a.get(n, `${this.label}.shader`), v = Of(), C = ff(this.label, r), A = pf(this.label, r, C), R = wf(e, this.label, r), G = Sf(e, this.label, r), P = $f(this.label, r), X = Tf(this.label, r), Y = Cd(this.label, r.constants, f.overrides, "draw"), Ue = ud({
      device: e,
      label: this.label,
      drawId: d,
      reflection: f,
      bindGroupLayouts: F,
      cache: i,
      onIdentityChange: (ce) => v.markStale({ kind: "binding-identity", drawLabel: this.label, ...ce })
    });
    wo.set(this, { id: d, device: e, opts: r, vertexBufferLayouts: $, cache: i, defaultTarget: s, reflection: f, visibility: y, vertexEntry: (g == null ? void 0 : g.name) ?? "vs_main", fragmentEntry: (w == null ? void 0 : w.name) ?? "fs_main", entryKey: b, setCore: Ue, bindGroupLayouts: F, pipelineLayout: k, shaderModule: m, pipelineStore: o, pipelineLayouts: c, errorSink: l, trackSettled: u, resolvedPipelineKeys: /* @__PURE__ */ new Set(), recordedIn: v, ...C, ...A, ...R, ...G, ...P, ...X, ...Y }), r.set && this.set(r.set);
    for (const ce of r.targets ?? [])
      this.compileSync(ce);
  }
  get gpu() {
    const e = D(this);
    for (const n of e.resolvedPipelineKeys) {
      const r = e.pipelineStore.getReady(n);
      if (r)
        return r;
    }
  }
  get targets() {
    return D(this).opts.targets;
  }
  /**
   * Frame drawable protocol: a `Frame` encodes through this instead of importing draw.ts, so a
   * program that never draws never pulls this module. The instance is its own protocol object —
   * `encode`, `label` and the depth/stencil metadata below are exactly what a pass needs.
   */
  get [Ln]() {
    return this;
  }
  /** @internal Frame drawable protocol; see {@link drawWritesDepth}. */
  writesDepth() {
    return Pf(this);
  }
  /** @internal Frame drawable protocol; see {@link drawStencilWritingOps}. */
  stencilWritingOps() {
    return Rf(this);
  }
  set(e) {
    const n = D(this);
    H(n.device, `${this.label}.set`);
    for (const r of n.setCore.set(e))
      n.recordedIn.markStale({ kind: "binding-identity", drawLabel: this.label, ...r });
    return this;
  }
  group(e, n) {
    const r = D(this);
    H(r.device, `${this.label}.group`);
    const i = p(this, bt).get(e) ?? this.layout(e), s = r.setCore.claimGroup(e, n, i);
    return r.recordedIn.markStale({ kind: "group-claim", drawLabel: this.label, group: e, previousIdentity: s, newIdentity: `claimed-group:${e}` }), this;
  }
  layout(e, n = {}) {
    return H(D(this).device, `${this.label}.layout`), n.dynamicOffsets ? S(this, N, yo).call(this, e) : D(this).setCore.layout(e);
  }
  /**
   * Encodes and submits this draw as a one-shot render pass.
   *
   * Raw claimed-bind-group validation failures are delivered asynchronously via
   * `gpu.onError` as `VGPU-R4-GROUP-VALIDATION`.
   */
  draw(e = {}) {
    var d, f, h, g;
    H(D(this).device, `${this.label}.draw`);
    const n = Pn(e) ? { target: e } : e, r = D(this), i = n.target ?? r.defaultTarget;
    if (!i)
      throw Zn(`${this.label}.draw`);
    es(i, `${this.label}.draw`);
    const s = r.device.gpu.createCommandEncoder(), o = s.beginRenderPass(i.renderPassDescriptor()), a = [];
    try {
      this.encode(o, i, n, (w) => a.push(w));
    } catch (w) {
      Q(a), zs(r.device);
      try {
        o.end();
      } catch {
      }
      throw w;
    }
    Hs(r.device, o, a, (d = a[0]) == null ? void 0 : d.context);
    let c;
    const l = (f = a[0]) == null ? void 0 : f.context;
    l && Gt(r.device, l);
    try {
      c = s.finish();
    } catch (w) {
      const b = l ? se(r.device) : void 0;
      Q(a), b && Q([b]);
      const _ = (b == null ? void 0 : b.context) ?? l;
      if (_) {
        Qi(r, _.label, _.group, w);
        return;
      }
      throw w;
    }
    if (l) {
      const w = se(r.device);
      w && (a[0] = a[0] ? In(w, a[0]) : w);
    }
    const u = (h = a[0]) == null ? void 0 : h.context;
    u && Gt(r.device, u);
    try {
      r.device.gpu.queue.submit([c]);
    } catch (w) {
      const b = u ? se(r.device) : void 0;
      Q(a), b && Q([b]);
      const _ = (b == null ? void 0 : b.context) ?? u;
      if (_) {
        Qi(r, _.label, _.group, w);
        return;
      }
      throw w;
    }
    if (u) {
      const w = se(r.device);
      w && (a[0] = a[0] ? In(w, a[0]) : w);
    }
    if (a.length) {
      const w = Ws(r.device, a, { errorSink: r.errorSink });
      (g = r.trackSettled) == null || g.call(r, w);
    }
  }
  encode(e, n, r = {}, i) {
    H(D(this).device, `${this.label}.encode`);
    const s = this.pipelineFor(n, !0);
    if (!s)
      return;
    e.setPipeline(s);
    const o = D(this);
    o.blendConstant && e.setBlendConstant(o.blendConstant), o.stencilRef !== void 0 && e.setStencilReference(o.stencilRef);
    for (const a of o.setCore.bindGroups())
      S(this, N, vo).call(this, e, a, r, i);
    S(this, N, Ao).call(this, e, r);
  }
  compile(e) {
    H(D(this).device, `${this.label}.compile`);
    const { key: n, signature: r, signatureKey: i } = S(this, N, Pt).call(this, e, `${this.label}.compile`);
    return D(this).pipelineStore.getAsync(n, () => S(this, N, ur).call(this, r), { where: `${this.label}.compile`, signature: i }).then(() => (H(D(this).device, `${this.label}.compile`), D(this).resolvedPipelineKeys.add(n), this));
  }
  compileSync(e) {
    H(D(this).device, `${this.label}.compileSync`);
    const { key: n, signature: r, signatureKey: i } = S(this, N, Pt).call(this, e, `${this.label}.compileSync`);
    return D(this).pipelineStore.getSync(n, () => S(this, N, lr).call(this, r), { where: `${this.label}.compileSync`, signature: i }) && D(this).resolvedPipelineKeys.add(n), this;
  }
  pipelineFor(e, n = !1) {
    H(D(this).device, `${this.label}.pipelineFor`);
    const { key: r, signature: i, signatureKey: s } = S(this, N, Pt).call(this, e, `${this.label}.pipelineFor`, n), o = D(this).pipelineStore.getSync(r, () => S(this, N, lr).call(this, i), { where: `${this.label}.pipelineFor`, signature: s });
    return o && D(this).resolvedPipelineKeys.add(r), o;
  }
  pipelineForAsync(e) {
    H(D(this).device, `${this.label}.pipelineForAsync`);
    const { key: n, signature: r, signatureKey: i } = S(this, N, Pt).call(this, e, `${this.label}.pipelineForAsync`);
    return D(this).pipelineStore.getAsync(n, () => S(this, N, ur).call(this, r), { where: `${this.label}.pipelineForAsync`, signature: i }).then((o) => (H(D(this).device, `${this.label}.pipelineForAsync`), D(this).resolvedPipelineKeys.add(n), o));
  }
}
bt = new WeakMap(), N = new WeakSet(), yo = function(e) {
  const n = D(this);
  n.setCore.layout(e);
  const r = p(this, bt).get(e);
  if (r)
    return r;
  const i = Nf(this, e), s = Zs(n.device, `${this.label}.group${e}.dynamic.bgl`, i);
  return p(this, bt).set(e, s), n.bindGroupLayouts.set(e, s), n.pipelineLayout = n.pipelineLayouts.get(n.bindGroupLayouts), s;
}, vo = function(e, n, r, i) {
  const s = Gf(r.offsets, n.group, n.offsets);
  if (!n.claimValidation || !i) {
    e.setBindGroup(n.group, n.bindGroup, s);
    return;
  }
  Gt(D(this).device, n.claimValidation);
  try {
    e.setBindGroup(n.group, n.bindGroup, s);
  } catch (a) {
    throw Gu(D(this).device), Et(n.claimValidation.label, n.claimValidation.group, a);
  }
  const o = se(D(this).device);
  o && i(o);
}, Pt = function(e, n, r = !1) {
  const i = S(this, N, So).call(this, e, n, r), s = Cn(i);
  return { signature: i, signatureKey: s, key: S(this, N, Eo).call(this, i) };
}, So = function(e, n, r = !1) {
  var a;
  const i = D(this), s = e ?? i.defaultTarget;
  if (!s)
    throw Zn(n);
  r || es(s, n);
  const o = ro(s);
  if (io(o, n), i.colorStates && i.colorStates.length !== o.colors.length)
    throw Jn(this.label, `expected one entry per color attachment; colors has ${i.colorStates.length}, but the target signature has ${o.colors.length}.`, n);
  if ((a = i.multisampleState) != null && a.alphaToCoverageEnabled && (o.sampleCount ?? 1) <= 1)
    throw dn(this.label, `alphaToCoverage requires a multisampled target, but the target signature has sampleCount ${o.sampleCount ?? 1}; create the target with msaa: true.`, n);
  if ((i.stencilState || i.stencilRef !== void 0) && !Wt(o.depth))
    throw lt(this.label, `stencil requires a depth format with a stencil aspect, but the target signature has ${o.depth ? `"${o.depth}"` : "no depth"}; create the target with depth: "depth24plus-stencil8".`, n);
  return o;
}, Eo = function(e) {
  const n = D(this), r = n.opts.geometry;
  return $d({ module: n.shaderModule, pipelineLayout: n.pipelineLayout, vertexBufferLayouts: n.vertexBufferLayouts, signature: e, fragmentKey: n.fragmentKey, topology: r == null ? void 0 : r.topology, stripIndexFormat: $o(r), cullMode: n.cullMode, frontFace: n.frontFace, unclippedDepth: n.unclippedDepth, depthKey: n.depthKey, stencilKey: n.stencilKey, multisampleKey: n.multisampleKey, constantsKey: n.constantsKey, entryKey: n.entryKey });
}, Ao = function(e, n = {}) {
  const r = D(this).opts.geometry;
  if (r != null && r.vertexBuffers && r.vertexBuffers.forEach((s, o) => e.setVertexBuffer(o, s)), n.indirect !== void 0)
    return S(this, N, Io).call(this, e, r, n);
  const i = df(this.label, r, D(this).opts, n);
  if (!(r != null && r.indexBuffer))
    return e.draw(i.vertexCount, i.instanceCount, i.firstVertex, i.firstInstance);
  e.setIndexBuffer(r.indexBuffer, r.indexFormat ?? "uint32"), e.drawIndexed(i.indexCount, i.instanceCount, i.firstIndex, i.baseVertex, i.firstInstance);
}, /**
 * The GPU reads the draw arguments from the buffer, so per-call counts alongside indirect are dead options and throw.
 * A non-zero firstInstance in the buffered arguments cannot be validated on the CPU; per WebGPU, it "must be 0,
 * unless the 'indirect-first-instance' feature is enabled", otherwise the indirect call "will be treated as a no-op".
 */
Io = function(e, n, r) {
  const i = `${this.label}.draw`, s = uf.find((l) => r[l] !== void 0);
  if (s !== void 0)
    throw at(this.label, `indirect cannot be combined with ${s} in the same call; the GPU reads the draw arguments from the buffer, so the CPU-side value would be ignored.`, i);
  const o = !!(n != null && n.indexBuffer), { buffer: a, offset: c } = Jd(this.label, i, r.indirect, o ? "drawIndexedIndirect" : "drawIndirect");
  if (!o)
    return e.drawIndirect(a, c);
  e.setIndexBuffer(n.indexBuffer, n.indexFormat ?? "uint32"), e.drawIndexedIndirect(a, c);
}, lr = function(e) {
  const n = D(this);
  return n.device.gpu.createRenderPipeline({
    label: `${this.label}.pipeline`,
    layout: n.pipelineLayout,
    vertex: { module: n.shaderModule, entryPoint: n.vertexEntry, buffers: [...n.vertexBufferLayouts ?? []], ...n.constants ? { constants: n.constants } : {} },
    fragment: { module: n.shaderModule, entryPoint: n.fragmentEntry, targets: Vi(e, n), ...n.constants ? { constants: n.constants } : {} },
    primitive: Bi(n.opts.geometry, n.cullMode, n.frontFace, n.unclippedDepth),
    depthStencil: qi(e, n),
    multisample: Ji(e, n)
  });
}, ur = function(e) {
  const n = D(this);
  return n.device.gpu.createRenderPipelineAsync({
    label: `${this.label}.pipeline`,
    layout: n.pipelineLayout,
    vertex: { module: n.shaderModule, entryPoint: n.vertexEntry, buffers: [...n.vertexBufferLayouts ?? []], ...n.constants ? { constants: n.constants } : {} },
    fragment: { module: n.shaderModule, entryPoint: n.fragmentEntry, targets: Vi(e, n), ...n.constants ? { constants: n.constants } : {} },
    primitive: Bi(n.opts.geometry, n.cullMode, n.frontFace, n.unclippedDepth),
    depthStencil: qi(e, n),
    multisample: Ji(e, n)
  });
};
function lf(t, e, n, r, i) {
  const s = t.limits;
  for (const [o, a, c] of [["vertex", 1, "maxStorageBuffersInVertexStage"], ["fragment", 2, "maxStorageBuffersInFragmentStage"]]) {
    const l = r.find((f) => f.stage === o);
    if (!l)
      continue;
    const u = n.filter((f) => {
      var h;
      return ((h = f.bindingLayout) == null ? void 0 : h.kind) === "buffer" && f.bindingLayout.buffer.type !== "uniform" && i(f) & a;
    }), d = s[c] ?? s.maxStorageBuffersPerShaderStage;
    if (d !== void 0 && u.length > d)
      throw Za(e, o, l.name, u.length, d, u);
  }
}
const uf = ["vertices", "indices", "instances", "firstVertex", "firstIndex", "baseVertex", "firstInstance"];
function Vi(t, e) {
  return t.colors.map((n, r) => {
    var c;
    const i = (c = e.colorStates) == null ? void 0 : c[r], s = (i == null ? void 0 : i.blendState) ?? e.blendState, o = (i == null ? void 0 : i.writeMask) ?? e.writeMask, a = { format: n };
    return s && (a.blend = s), o !== void 0 && (a.writeMask = o), a;
  });
}
function df(t, e, n, r) {
  Te(t, "DrawOptions.instances", n.instances), Te(t, "DrawOptions.vertices", n.vertices), Te(t, "DrawOptions.firstInstance", n.firstInstance), Te(t, "DrawCallOptions.instances", r.instances), Ce(t, "DrawCallOptions.vertices", r.vertices), Ce(t, "DrawCallOptions.indices", r.indices), Ce(t, "DrawCallOptions.firstVertex", r.firstVertex), Ce(t, "DrawCallOptions.firstIndex", r.firstIndex), Ce(t, "DrawCallOptions.baseVertex", r.baseVertex), Te(t, "DrawCallOptions.firstInstance", r.firstInstance), Te(t, "GeometryLike.vertexCount", e == null ? void 0 : e.vertexCount), Te(t, "GeometryLike.indexCount", e == null ? void 0 : e.indexCount), Te(t, "GeometryLike.instanceCount", e == null ? void 0 : e.instanceCount), Ce(t, "GeometryLike.firstVertex", e == null ? void 0 : e.firstVertex), Ce(t, "GeometryLike.firstIndex", e == null ? void 0 : e.firstIndex), Ce(t, "GeometryLike.baseVertex", e == null ? void 0 : e.baseVertex);
  const i = !!(e != null && e.indexBuffer), o = (e == null ? void 0 : e.geometry) ?? (e && It in e ? e : void 0), a = r.firstVertex ?? (e == null ? void 0 : e.firstVertex) ?? 0, c = r.vertices ?? (e == null ? void 0 : e.vertexCount) ?? n.vertices ?? 3, l = r.firstIndex ?? (e == null ? void 0 : e.firstIndex) ?? 0, u = r.indices ?? (e == null ? void 0 : e.indexCount) ?? 0, d = r.baseVertex ?? (e == null ? void 0 : e.baseVertex) ?? 0;
  if (i)
    zi(t, "index", l, u, o == null ? void 0 : o.indexCount);
  else if (r.indices !== void 0 || r.firstIndex !== void 0 || r.baseVertex !== void 0)
    throw At(`${t}.draw`, "Index range needs an indexed geometry.");
  return i || zi(t, "vertex", a, c, o == null ? void 0 : o.vertexCount), {
    instanceCount: r.instances ?? n.instances ?? (e == null ? void 0 : e.instanceCount) ?? 1,
    firstInstance: r.firstInstance ?? n.firstInstance ?? 0,
    vertexCount: c,
    firstVertex: a,
    indexCount: u,
    firstIndex: l,
    baseVertex: d
  };
}
function $o(t) {
  const e = (t == null ? void 0 : t.topology) ?? "triangle-list";
  return (t == null ? void 0 : t.stripIndexFormat) ?? (e.endsWith("strip") ? t == null ? void 0 : t.indexFormat : void 0);
}
function Bi(t, e, n, r) {
  const i = (t == null ? void 0 : t.topology) ?? "triangle-list", s = $o(t), o = s ? { topology: i, stripIndexFormat: s } : { topology: i };
  return e !== void 0 && (o.cullMode = e), n !== void 0 && (o.frontFace = n), r && (o.unclippedDepth = !0), o;
}
function zi(t, e, n, r, i) {
  if (!(i === void 0 || n + r <= i))
    throw At(`${t}.draw`, `${e} range [${n}, ${n + r}) exceeds parent geometry ${e} count ${i}.`);
}
function Ce(t, e, n) {
  if (!(n === void 0 || Number.isInteger(n) && n >= 0))
    throw At(`${t}.draw`, `${e} must be an integer >= 0; received ${String(n)}.`);
}
function Te(t, e, n) {
  if (n !== void 0 && !(Number.isInteger(n) && n >= 0))
    throw new I({
      code: "VGPU-R1-DRAW-COUNT",
      message: `${e} of '${t}' must be an integer >= 0; received ${String(n)}. Use 0 only when you want to issue a valid draw with no vertices/instances.`,
      where: `${t}.draw`
    });
}
function ff(t, e) {
  const n = e.blend === void 0 ? void 0 : Co(t, e.blend), r = e.writeMask === void 0 ? void 0 : Fo(t, e.writeMask), i = e.colors === void 0 ? void 0 : hf(t, e.colors), s = i ? `${Zi(n, r)}@${i.map(Ff).join("@")}` : n || r !== void 0 ? Zi(n, r) : void 0;
  return { blendState: n, writeMask: r, colorStates: i, fragmentKey: s };
}
function hf(t, e) {
  if (!Array.isArray(e))
    throw Jn(t, `colors must be an array; received ${V(e)}.`);
  return e.map((n, r) => {
    if (n == null)
      return null;
    if (typeof n != "object" || Array.isArray(n))
      throw Jn(t, `colors[${r}] must be null or { blend?, writeMask? }; received ${V(n)}.`);
    const i = n.blend === void 0 ? void 0 : Co(`${t}.colors[${r}]`, n.blend), s = n.writeMask === void 0 ? void 0 : Fo(`${t}.colors[${r}]`, n.writeMask);
    return !i && s === void 0 ? null : { blendState: i, writeMask: s };
  });
}
function Co(t, e) {
  if (e === "alpha")
    return ln({ src: "src-alpha", dst: "one-minus-src-alpha" }, { src: "one", dst: "one-minus-src-alpha" });
  if (e === "premultiplied")
    return ln({ src: "one", dst: "one-minus-src-alpha" }, { src: "one", dst: "one-minus-src-alpha" });
  if (e === "additive")
    return ln({ src: "one", dst: "one" }, { src: "one", dst: "one" });
  if (typeof e != "object" || e === null || !Wi(e.color))
    throw ri(t, e);
  const n = e.color, r = e.alpha;
  if (r !== void 0 && !Wi(r))
    throw ri(t, e);
  return ln(n, r ?? n);
}
function Wi(t) {
  return typeof t == "object" && t !== null && typeof t.src == "string" && typeof t.dst == "string";
}
function ln(t, e) {
  return { color: Hi(t), alpha: Hi(e) };
}
function Hi(t) {
  return { srcFactor: t.src, dstFactor: t.dst, operation: t.op ?? "add" };
}
function pf(t, e, n) {
  if (e.blendConstant === void 0)
    return {};
  const r = e.blendConstant;
  if (!Array.isArray(r) || r.length !== 4 || r.some((i) => typeof i != "number" || !Number.isFinite(i)))
    throw ii(t, `received ${V(r)}; expected [r, g, b, a] finite numbers.`);
  if (!mf(n).some((i) => i && gf(i)))
    throw ii(t, `no color target's effective blend uses a "constant"/"one-minus-constant" factor (colors[i].blend replaces the top-level blend for that target), so blendConstant would have no effect.`);
  return { blendConstant: { r: r[0], g: r[1], b: r[2], a: r[3] } };
}
function mf(t) {
  return t.colorStates ? t.colorStates.map((e) => (e == null ? void 0 : e.blendState) ?? t.blendState) : [t.blendState];
}
function gf(t) {
  return [t.color.srcFactor, t.color.dstFactor, t.alpha.srcFactor, t.alpha.dstFactor].some((e) => e === "constant" || e === "one-minus-constant");
}
function bf(t, e) {
  if (e === void 0)
    return {};
  if (typeof e != "object" || e === null || Array.isArray(e))
    throw fn(t, `received ${V(e)}; expected { vertex?, fragment? } entry point names.`);
  return e;
}
function xf(t, e, n) {
  const r = t.entryPoints.find((s) => s.stage === "vertex"), i = t.entryPoints.find((s) => s.stage === "fragment");
  if (!(e === r && n === i))
    return `en~${(e == null ? void 0 : e.name) ?? ""}~${(n == null ? void 0 : n.name) ?? ""}`;
}
function wf(t, e, n) {
  const r = n.cull === void 0 ? void 0 : yf(e, n.cull), i = n.frontFace === void 0 ? void 0 : vf(e, n.frontFace), s = n.unclippedDepth === void 0 ? void 0 : _f(t, e, n.unclippedDepth);
  return { cullMode: r, frontFace: i, unclippedDepth: s };
}
function _f(t, e, n) {
  if (typeof n != "boolean")
    throw oi(e, `received ${V(n)}; expected a boolean.`);
  if (n) {
    if (!t.features.has("depth-clip-control"))
      throw oi(e, 'the device lacks the "depth-clip-control" feature; request it at init: init({ requiredFeatures: ["depth-clip-control"] }) on an adapter that supports it.');
    return !0;
  }
}
function yf(t, e) {
  if (e === "none" || e === "front" || e === "back")
    return e;
  throw ic(t, e);
}
function vf(t, e) {
  if (e === "ccw" || e === "cw")
    return e;
  throw sc(t, e);
}
const To = { depthWriteEnabled: !0, depthCompare: "less-equal" }, Lo = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"], ji = -2147483648, Ki = 2147483647;
function qi(t, e) {
  if (t.depth)
    return { format: t.depth, ...e.depthState ?? To, ...e.stencilState ?? {} };
}
function Sf(t, e, n) {
  var i;
  if (n.depth === void 0)
    return {};
  const r = Ef(t, e, n.depth, ((i = n.geometry) == null ? void 0 : i.topology) ?? "triangle-list");
  return { depthState: r, depthKey: Af(r) };
}
function Ef(t, e, n, r) {
  if (n === !1)
    return { depthWriteEnabled: !1, depthCompare: "always" };
  if (typeof n != "object" || n === null)
    throw me(e, `received ${V(n)}.`);
  if (n.write !== void 0 && typeof n.write != "boolean")
    throw me(e, `write must be a boolean; received ${V(n.write)}.`);
  if (n.compare !== void 0 && !Lo.includes(n.compare))
    throw me(e, `compare must be a GPUCompareFunction; received ${V(n.compare)}.`);
  if (n.bias !== void 0 && !Number.isInteger(n.bias))
    throw me(e, `bias must be an integer (WebGPU depthBias is i32); received ${V(n.bias)}.`);
  if (n.bias !== void 0 && (n.bias < ji || n.bias > Ki))
    throw me(e, `bias must fit in the i32 range [${ji}, ${Ki}] (WebGPU depthBias is i32); received ${V(n.bias)}.`);
  if (n.biasSlopeScale !== void 0 && !Number.isFinite(n.biasSlopeScale))
    throw me(e, `biasSlopeScale must be a finite number; received ${V(n.biasSlopeScale)}.`);
  if (n.biasClamp !== void 0 && !Number.isFinite(n.biasClamp))
    throw me(e, `biasClamp must be a finite number; received ${V(n.biasClamp)}.`);
  const i = n.bias ?? 0, s = n.biasSlopeScale ?? 0, o = n.biasClamp ?? 0;
  if ((i !== 0 || s !== 0 || o !== 0) && !r.startsWith("triangle"))
    throw me(e, `bias, biasSlopeScale, and biasClamp must be 0 for "${r}" topology.`);
  if (o !== 0 && t.isCompatibilityMode)
    throw me(e, `biasClamp must be 0 on a compatibility-mode device; received ${V(n.biasClamp)}.`);
  return {
    depthWriteEnabled: n.write ?? !0,
    depthCompare: n.compare ?? "less-equal",
    ...i !== 0 ? { depthBias: i } : {},
    ...s !== 0 ? { depthBiasSlopeScale: s } : {},
    ...o !== 0 ? { depthBiasClamp: o } : {}
  };
}
function Af(t) {
  return `${t.depthWriteEnabled ? 1 : 0}~${t.depthCompare}~${t.depthBias ?? 0}~${t.depthBiasSlopeScale ?? 0}~${t.depthBiasClamp ?? 0}`;
}
const If = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];
function $f(t, e) {
  if (e.stencil === void 0)
    return {};
  const n = e.stencil;
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw lt(t, `received ${V(n)}; expected { front?, back?, readMask?, writeMask?, ref? }.`);
  const r = n.front === void 0 ? void 0 : Xi(t, "front", n.front), i = n.back === void 0 ? void 0 : Xi(t, "back", n.back);
  Wn(t, "readMask", n.readMask), Wn(t, "writeMask", n.writeMask), Wn(t, "ref", n.ref);
  const s = {
    ...r ? { stencilFront: r } : {},
    // Omitted back mirrors the normalized front so both faces behave the same; with neither given, both keep the WebGPU defaults.
    ...i ?? r ? { stencilBack: i ?? { ...r } } : {},
    ...n.readMask !== void 0 ? { stencilReadMask: n.readMask } : {},
    ...n.writeMask !== void 0 ? { stencilWriteMask: n.writeMask } : {}
  }, o = s.stencilFront !== void 0 || s.stencilBack !== void 0 || s.stencilReadMask !== void 0 || s.stencilWriteMask !== void 0;
  return !o && n.ref === void 0 ? {} : {
    ...o ? { stencilState: s, stencilKey: Cf(s) } : {},
    // The reference is encoder state (setStencilReference), not pipeline state; it stays out of the pipeline key.
    ...n.ref !== void 0 ? { stencilRef: n.ref } : {}
  };
}
function Xi(t, e, n) {
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw lt(t, `${e} must be a { compare?, fail?, depthFail?, pass? } object; received ${V(n)}.`);
  if (n.compare !== void 0 && !Lo.includes(n.compare))
    throw lt(t, `${e}.compare must be a GPUCompareFunction; received ${V(n.compare)}.`);
  for (const [r, i] of [["fail", n.fail], ["depthFail", n.depthFail], ["pass", n.pass]])
    if (i !== void 0 && !If.includes(i))
      throw lt(t, `${e}.${r} must be a GPUStencilOperation; received ${V(i)}.`);
  return { compare: n.compare ?? "always", failOp: n.fail ?? "keep", depthFailOp: n.depthFail ?? "keep", passOp: n.pass ?? "keep" };
}
function Wn(t, e, n) {
  if (n !== void 0 && (typeof n != "number" || !Number.isInteger(n) || n < 0 || n > 4294967295))
    throw lt(t, `${e} must be an integer in [0, 0xFFFFFFFF] (WebGPU GPUStencilValue is u32); received ${V(n)}.`);
}
function Cf(t) {
  return `st~${Yi(t.stencilFront)}~${Yi(t.stencilBack)}~${t.stencilReadMask ?? 4294967295}~${t.stencilWriteMask ?? 4294967295}`;
}
function Yi(t) {
  return t ? `${t.compare},${t.failOp},${t.depthFailOp},${t.passOp}` : "default";
}
function Ji(t, e) {
  return { count: t.sampleCount ?? 1, ...e.multisampleState ?? {} };
}
function Tf(t, e) {
  if (e.multisample === void 0)
    return {};
  const n = e.multisample;
  if (typeof n != "object" || n === null || Array.isArray(n))
    throw dn(t, `received ${V(n)}; expected { alphaToCoverage?, mask? }.`);
  if (n.alphaToCoverage !== void 0 && typeof n.alphaToCoverage != "boolean")
    throw dn(t, `alphaToCoverage must be a boolean; received ${V(n.alphaToCoverage)}.`);
  if (n.mask !== void 0 && (typeof n.mask != "number" || !Number.isInteger(n.mask) || n.mask < 0 || n.mask > 4294967295))
    throw dn(t, `mask must be an integer in [0, 0xFFFFFFFF] (WebGPU GPUSampleMask is u32); received ${V(n.mask)}.`);
  const r = {
    ...n.alphaToCoverage !== void 0 ? { alphaToCoverageEnabled: n.alphaToCoverage } : {},
    ...n.mask !== void 0 ? { mask: n.mask } : {}
  };
  return r.alphaToCoverageEnabled === void 0 && r.mask === void 0 ? {} : { multisampleState: r, multisampleKey: Lf(r) };
}
function Lf(t) {
  return `ms~${t.alphaToCoverageEnabled ? 1 : 0}~${t.mask ?? 4294967295}`;
}
function Fo(t, e) {
  if (!Array.isArray(e))
    throw si(t, V(e));
  let n = 0;
  for (const r of e)
    if (r === "r")
      n |= 1;
    else if (r === "g")
      n |= 2;
    else if (r === "b")
      n |= 4;
    else if (r === "a")
      n |= 8;
    else
      throw si(t, V(r));
  return n;
}
function Zi(t, e) {
  return `${ko(t)};${e ?? 15}`;
}
function ko(t) {
  if (!t)
    return "none;none";
  const e = t.color, n = t.alpha;
  return `${e.srcFactor},${e.dstFactor},${e.operation};${n.srcFactor},${n.dstFactor},${n.operation}`;
}
function Ff(t) {
  return t ? `${t.blendState ? ko(t.blendState) : "inherit"};${t.writeMask ?? "inherit"}` : "inherit";
}
function V(t) {
  if (typeof t == "string")
    return `"${t}"`;
  try {
    return JSON.stringify(t) ?? String(t);
  } catch {
    return String(t);
  }
}
function kf(t, e) {
  D(t).recordedIn.add(e);
}
function Df(t) {
  return D(t).blendConstant !== void 0;
}
function Mf(t) {
  return D(t).stencilRef !== void 0;
}
function Pf(t) {
  return (D(t).depthState ?? To).depthWriteEnabled;
}
function Rf(t) {
  const e = D(t), n = e.stencilState;
  if (!n || n.stencilWriteMask === 0)
    return [];
  const r = e.cullMode ?? "none", i = [], s = (o, a) => {
    if (a)
      for (const [c, l] of [["fail", a.failOp], ["depthFail", a.depthFailOp], ["pass", a.passOp]])
        l !== void 0 && l !== "keep" && i.push(`${o}.${c}: "${l}"`);
  };
  return r !== "front" && s("front", n.stencilFront), r !== "back" && s("back", n.stencilBack), i;
}
function Do(t, e, n, r = {}, i) {
  t.encode(e, n, r, i);
}
function D(t) {
  const e = wo.get(t);
  if (!e)
    throw new TypeError("Invalid Draw instance");
  return e;
}
function Qi(t, e, n, r) {
  var s;
  const i = (async () => {
    await Dr(t.device), H(t.device, `${e}.validation`);
    const o = Et(e, n, r);
    t.errorSink ? await t.errorSink(o) : console.error(o);
  })();
  return (s = t.trackSettled) == null || s.call(t, i), i;
}
function Of() {
  const t = /* @__PURE__ */ new Set();
  return {
    add(e) {
      t.add(e);
    },
    delete(e) {
      t.delete(e);
    },
    list() {
      return [...t];
    },
    markStale(e) {
      for (const n of t)
        n.markStale(e);
    }
  };
}
function Gf(t, e, n) {
  return t ? Array.isArray(t) ? t : t[e] ?? n : n;
}
function Nf(t, e) {
  const n = D(t);
  return Js(n.reflection.bindings, e, n.visibility).map(Uf);
}
function Uf(t) {
  return t.buffer ? { ...t, buffer: { ...t.buffer, hasDynamicOffset: !0 } } : t;
}
function es(t, e) {
  if (Wr(t) && !fo())
    throw $r(e);
}
const Mo = /* @__PURE__ */ new WeakMap();
class Vf {
  get gpu() {
    return Fe(this).gpu;
  }
  constructor(e, n, r = {}, i, s, o, a, c, l, u) {
    const d = zf(n), f = new _o(e, d, { shader: d, set: r.set, label: r.label ?? "effect", blend: r.blend, writeMask: r.writeMask }, i, s, o, a, c, l, u);
    Mo.set(this, f);
  }
  set(e) {
    return Fe(this).set(e), this;
  }
  draw(e = {}) {
    Fe(this).draw(Pn(e) ? { target: e } : e);
  }
  compile(e) {
    return Fe(this).compile(e).then(() => this);
  }
  compileSync(e) {
    return Fe(this).compileSync(e), this;
  }
  /** @internal FramePass delegates here; not part of the frozen public Effect surface. */
  encode(e, n, r = {}, i) {
    Do(Fe(this), e, n, r, i);
  }
  /**
   * Frame drawable protocol: an effect is encoded as its underlying draw, so it reuses that draw's
   * protocol object — same encode path, same depth/stencil metadata for read-only passes.
   */
  get [Ln]() {
    return Fe(this)[Ln];
  }
}
function Bf(t) {
  return Fe(t);
}
function Fe(t) {
  const e = Mo.get(t);
  if (!e)
    throw new TypeError("Invalid Effect instance");
  return e;
}
function zf(t) {
  return Wf(t) ? t : `
struct VgpuFullscreenVertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};
@vertex fn vgpu_fullscreen_vs(@builtin(vertex_index) vi: u32) -> VgpuFullscreenVertexOut {
  var pos = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  var uv = array<vec2f, 3>(vec2f(0.0, 1.0), vec2f(2.0, 1.0), vec2f(0.0, -1.0));
  var out: VgpuFullscreenVertexOut;
  out.position = vec4f(pos[vi], 0.0, 1.0);
  out.uv = uv[vi];
  return out;
}
${t}`;
}
function Wf(t) {
  return Us(t, "effect.wgsl").entryPoints.some((e) => e.stage === "vertex");
}
function dr(t, e, n) {
  return jf(Ie(t, "bundle").device, e, n);
}
let Hf = 1, Hn = 0;
function jf(t, e, n) {
  const r = e.label ?? `bundle${Hf++}`;
  if (Wr(e.target) && !fo())
    throw $r("bundle");
  const i = Ro(e.target), s = new Kf(t, r, i);
  return s.record(n), s;
}
var xt, wt, Yt, Fn, Po;
class Kf {
  constructor(e, n, r) {
    T(this, Fn);
    x(this, "device");
    x(this, "id");
    x(this, "signature");
    x(this, "gpu");
    T(this, xt);
    T(this, wt);
    T(this, Yt, /* @__PURE__ */ new Set());
    this.device = e, this.id = n, this.signature = r, M(this, wt, Cn(r));
  }
  record(e) {
    this.gpu = Qc(this.device, {
      label: this.id,
      colorFormats: this.signature.colors,
      depthStencilFormat: this.signature.depth,
      sampleCount: this.signature.sampleCount ?? 1,
      record: (n) => S(this, Fn, Po).call(this, e, n.gpu)
    });
    for (const n of p(this, Yt))
      kf(n, this);
  }
  /**
   * Frame bundle protocol: `pass.bundles()` replays through this, so `frame.ts` never imports
   * bundle.ts. The recorded bundle is its own protocol object — `gpu` and the staleness check.
   */
  get [bo]() {
    return this;
  }
  markStale(e) {
    Hn > 0 || (p(this, xt) ?? M(this, xt, e));
  }
  assertReplayable(e) {
    const n = Ro(e), r = Cn(n);
    if (p(this, wt) !== r)
      throw ts(this.id, Xf(this.id, p(this, wt), r));
    if (p(this, xt))
      throw ts(this.id, Yf(this.id, p(this, xt)));
  }
  remember(e) {
    p(this, Yt).add(e);
  }
}
xt = new WeakMap(), wt = new WeakMap(), Yt = new WeakMap(), Fn = new WeakSet(), Po = function(e, n) {
  Hn += 1;
  try {
    e(new qf(this, n));
  } finally {
    Hn -= 1;
  }
};
class qf {
  constructor(e, n) {
    x(this, "bundle");
    x(this, "encoder");
    this.bundle = e, this.encoder = n;
  }
  draw(e, n = {}) {
    const r = e instanceof Vf ? Bf(e) : e;
    if (Df(r))
      throw rc(this.bundle.id, r.label);
    if (Mf(r))
      throw oc(this.bundle.id, r.label);
    this.bundle.remember(r), Do(r, this.encoder, this.bundle.signature, n);
  }
}
function Ro(t) {
  const e = ro(t);
  return io(e, "bundle"), e;
}
function Xf(t, e, n) {
  return `bundle '${t}' is stale: the replay target signature does not match the recorded signature. Bundles freeze format/depth/sampleCount and bind groups.
  Recorded signature: ${e}
  Actual signature: ${n}
  Fix: re-record the bundle for this target → ${t} = bundle(gpu, { target: scene }, ...)
  (re-recording is always your responsibility; the library only detects this).`;
}
function Yf(t, e) {
  return e.kind === "group-claim" ? `bundle '${t}' is stale: group ${e.group} of draw
  '${e.drawLabel}' changed bind group after recording. Bundles freeze commands and bind groups.
  Fix: re-record it → ${t} = bundle(gpu, { target: scene }, ...)
  (re-recording is always your responsibility; the library only detects this).` : `bundle '${t}' is stale: binding \`${e.bindingName}\` (@group(${e.group}) @binding(${e.binding})) of draw
  '${e.drawLabel}' changed resource after recording. Bundles freeze commands and bind groups.
  Fix: re-record it → ${t} = bundle(gpu, { target: scene }, ...)
  (re-recording is always your responsibility; the library only detects this).`;
}
function ts(t, e) {
  return new I({ code: "VGPU-R3-BUNDLE-STALE", message: e, where: `bundle '${t}' replay` });
}
const Jf = Qt("clock");
function Zf(t) {
  return Qf(Ie(t, "clock"));
}
function Qf(t) {
  return t.service(Jf, (e) => {
    const n = Br(e), r = (i) => {
      if (e.disposed)
        throw Es(i);
      H(e.device, i);
    };
    return {
      get time() {
        return r("clock.time"), n.time;
      },
      get deltaTime() {
        return r("clock.deltaTime"), n.deltaTime;
      },
      get frameCount() {
        return r("clock.frameCount"), n.frameCount;
      },
      advance(i) {
        if (r("clock.advance"), typeof i != "number" || !Number.isFinite(i) || i < 0)
          throw $c(i);
        n.advanceBy(i);
      }
    };
  });
}
function eh(t, e) {
  return Go(Ie(t, "frame")).frame(e);
}
function th(t, e, n = {}) {
  return Go(Ie(t, "frameLoop")).loop(e, n);
}
let Oo;
const nh = Qt("frame-runner");
function Go(t) {
  return t.service(nh, (e) => {
    const n = Br(e);
    return new hh(() => {
      let r = () => {
      };
      const i = new rh(e.device, void 0, (s) => e.reportError(s), (s) => {
        e.trackDelivery(s);
      }, () => r());
      return r = e.own("scheduler", () => i.cancel()), i;
    }, () => n.tick(), (r) => e.own("scheduler", () => r.stop()));
  });
}
var et, z, we, Oe, _e, ye, _t, O, Rt, wn, fr, hr, pr, mr, _n;
class rh {
  constructor(e, n, r, i, s) {
    T(this, O);
    x(this, "device");
    x(this, "defaultTarget");
    x(this, "errorSink");
    x(this, "trackSettled");
    x(this, "releaseLifecycle");
    /**
     * Resolves after submitted GPU work completes and raw claimed-bind-group
     * validation has been delivered to `gpu.onError`.
     *
     * This is a completion/timing signal only; it never rejects and is not an error
     * channel.
     */
    x(this, "done", Promise.resolve());
    T(this, et);
    T(this, z, []);
    /**
     * Everything a pass of this frame attached, as opaque {@link FrameOwner}s: timers and
     * visibilities today, scene view generations later. The frame never learns what they are — it
     * only guarantees each one sees exactly one `frameSubmitted` or `frameAbandoned`.
     */
    T(this, we, /* @__PURE__ */ new Set());
    /**
     * Owners whose per-frame bookkeeping a failed pass invalidated: their frame is neither finalized
     * nor read back, so a throwing pass callback cannot leave a phantom result. Kept alongside the
     * live set so a later pass re-attaching the same instance in this frame stays dropped too — the
     * failed pass's span/slots are still in that instance's frame bookkeeping.
     */
    T(this, Oe, /* @__PURE__ */ new Set());
    T(this, _e, !1);
    T(this, ye, !1);
    T(this, _t, !1);
    this.device = e, this.defaultTarget = n, this.errorSink = r, this.trackSettled = i, this.releaseLifecycle = s, H(e, "Frame.constructor"), M(this, et, e.gpu.createCommandEncoder({ label: "vgpu.frame" }));
  }
  pass(e, n) {
    var w;
    if (p(this, ye))
      throw fi("Frame.pass");
    H(this.device, "Frame.pass");
    const r = Pn(e), i = typeof n == "function" ? n : (b) => b.draw(n), s = r ? e : e.target ?? this.defaultTarget;
    if (!s)
      throw Zn("Frame.pass");
    if (Wr(s) && p(this, _e))
      throw $r("Frame.pass");
    const o = r ? void 0 : e.clear, a = o === !1;
    if (a && s.sampleCount === 4)
      throw ac();
    const c = r ? void 0 : e.clearDepth;
    if (c !== void 0) {
      if (typeof c != "number" || !(c >= 0 && c <= 1))
        throw ai(c);
      if (a)
        throw cc();
      if (!s.depth)
        throw ai(c, "but the target has no depth attachment, so clearDepth would have no effect.", "Create the target with depth: true (or a depth format), or drop clearDepth.");
    }
    const l = r ? void 0 : e.clearStencil;
    if (l !== void 0) {
      if (typeof l != "number" || !Number.isInteger(l) || l < 0 || l > 4294967295)
        throw ci(`received ${String(l)}; expected an integer in [0, 0xFFFFFFFF] (WebGPU GPUStencilValue).`);
      if (a)
        throw lc();
      const b = (w = s.depth) == null ? void 0 : w.format;
      if (!Wt(b))
        throw ci(`received ${String(l)}, but the target's depth format ${b ? `"${b}"` : "(none)"} has no stencil aspect, so clearStencil would have no effect.`);
    }
    const u = r ? void 0 : e.depthReadOnly;
    if (u !== void 0 && typeof u != "boolean")
      throw Be(`received ${Ge(u)}; expected a boolean.`, "Pass depthReadOnly: true to open the pass with a read-only depth attachment, or omit it.");
    if (u) {
      if (!s.depth)
        throw Be("is set, but the target has no depth attachment, so there is nothing to make read-only.", "Create the target with depth: true (or a depth format), or drop depthReadOnly.");
      if (s.sampleCount === 4)
        throw uc();
      if (c !== void 0)
        throw Be("cannot be combined with clearDepth; a read-only depth aspect omits its load/store ops and is never cleared.", "Remove clearDepth, or drop depthReadOnly.");
      if (l !== void 0)
        throw Be("cannot be combined with clearStencil; a read-only stencil aspect omits its load/store ops and is never cleared.", "Remove clearStencil, or drop depthReadOnly.");
    }
    const d = r ? void 0 : uh(e.viewport, this.device.gpu.limits, s.size), f = r ? void 0 : dh(e.scissor, s.size), h = [];
    let g;
    try {
      const b = r || e.timer === void 0 ? void 0 : S(this, O, pr).call(this, e.timer, s, h, ch), _ = r || e.visibility === void 0 ? void 0 : S(this, O, pr).call(this, e.visibility, s, h, lh), y = _ == null ? void 0 : _.occlusion;
      let E = s.renderPassDescriptor({ clear: o === void 0 || o === !0 || o === !1 ? s.clearColor ?? Ur : o, preserve: a, clearDepth: c, clearStencil: l, depthReadOnly: u });
      b != null && b.timestampWrites && (E = { ...E, timestampWrites: b.timestampWrites }), y && (E = { ...E, occlusionQuerySet: y.querySet }), g = p(this, et).beginRenderPass(E), d && g.setViewport(d.x, d.y, d.width, d.height, d.minDepth, d.maxDepth), f && g.setScissorRect(f[0], f[1], f[2], f[3]), M(this, _t, !0);
      try {
        i(new ih(g, s, p(this, z), u === !0, y, this, (L) => {
          if (H(this.device, L), p(this, ye))
            throw fi(L);
        }));
      } finally {
        M(this, _t, !1);
      }
    } catch (b) {
      S(this, O, fr).call(this, h), Q(p(this, z)), p(this, z).length = 0, zs(this.device);
      try {
        g == null || g.end();
      } catch {
      }
      throw b;
    }
    Hs(this.device, g, p(this, z));
  }
  submit() {
    var i, s, o;
    if (p(this, _e) || p(this, ye))
      return;
    H(this.device, "Frame.submit"), M(this, _e, !0), (i = this.releaseLifecycle) == null || i.call(this);
    for (const a of S(this, O, hr).call(this))
      a.finalizeFrame(this, p(this, et));
    let e;
    const n = (s = p(this, z)[0]) == null ? void 0 : s.context;
    n && Gt(this.device, n);
    try {
      e = p(this, et).finish();
    } catch (a) {
      S(this, O, Rt).call(this, S(this, O, wn).call(this));
      const c = n ? se(this.device) : void 0;
      Q(p(this, z)), c && Q([c]);
      const l = (c == null ? void 0 : c.context) ?? n;
      if (!l)
        throw a;
      this.done = S(this, O, _n).call(this, S(this, O, mr).call(this, l.label, l.group, a));
      return;
    }
    if (n) {
      const a = se(this.device);
      a && (p(this, z)[0] = p(this, z)[0] ? In(a, p(this, z)[0]) : a);
    }
    const r = (o = p(this, z)[0]) == null ? void 0 : o.context;
    r && Gt(this.device, r);
    try {
      this.device.gpu.queue.submit([e]);
    } catch (a) {
      S(this, O, Rt).call(this, S(this, O, wn).call(this));
      const c = r ? se(this.device) : void 0;
      Q(p(this, z)), c && Q([c]);
      const l = (c == null ? void 0 : c.context) ?? r;
      if (!l)
        throw a;
      this.done = S(this, O, _n).call(this, S(this, O, mr).call(this, l.label, l.group, a));
      return;
    }
    if (r) {
      const a = se(this.device);
      a && (p(this, z)[0] = p(this, z)[0] ? In(a, p(this, z)[0]) : a);
    }
    for (const a of S(this, O, hr).call(this))
      a.frameSubmitted(this);
    S(this, O, Rt).call(this, p(this, Oe)), this.done = S(this, O, _n).call(this, Ws(this.device, p(this, z), { errorSink: this.errorSink }));
  }
  /**
   * Discards the frame without submitting it: the command encoder is dropped (nothing this frame
   * encoded ever runs) and every telemetry instance it attached releases the retain it took on its
   * query ring, so a `timer(gpu)` / `visibility(gpu)` can be disposed for good without waiting for
   * `gpu.dispose()`. This is the explicit way out of the leak a manual `frame(gpu)` would otherwise
   * hold: a frame is never assumed abandoned, because an old frame can still be submitted.
   *
   * Idempotent, like `submit()`: cancelling twice is a no-op, and `submit()` after `cancel()` does
   * nothing. Cancelling a frame that was already submitted throws `VGPU-FRAME-SUBMITTED` — its work
   * is on the queue and cannot be taken back, so silently accepting the call would hide a real
   * lifecycle bug.
   */
  cancel() {
    var e;
    if (!p(this, ye)) {
      if (p(this, _e))
        throw Tc("Frame.cancel");
      if (p(this, _t))
        throw Cc("Frame.cancel");
      M(this, ye, !0), (e = this.releaseLifecycle) == null || e.call(this), S(this, O, Rt).call(this, S(this, O, wn).call(this)), p(this, we).clear(), p(this, Oe).clear(), Q(p(this, z)), p(this, z).length = 0;
    }
  }
}
et = new WeakMap(), z = new WeakMap(), we = new WeakMap(), Oe = new WeakMap(), _e = new WeakMap(), ye = new WeakMap(), _t = new WeakMap(), O = new WeakSet(), /**
 * Ends the frame for telemetry instances that will never see a real frameSubmitted: a pass whose
 * callback threw, a frame whose finish/submit failed, or a canceled frame. Each one took a retain
 * on its query ring when it was attached to a pass descriptor (so a mid-frame dispose() cannot
 * destroy a set the frame still points at); without the matching release, a dispose() after the
 * failure leaves the ring alive forever. frameAbandoned() drops the instance's pending encoded
 * state as it releases: a resolve that never reached the queue must not be decoded — its staging
 * buffer holds stale bytes, which would surface as a phantom duration or a phantom "hidden".
 */
Rt = function(e) {
  for (const n of [...e])
    n.frameAbandoned(this);
}, /** Every owner this frame attached, discarded ones included. */
wn = function() {
  return [...p(this, we), ...p(this, Oe)];
}, /** Moves owners out of this frame's live set: they are neither finalized nor read back. */
fr = function(e) {
  for (const n of [...e])
    p(this, we).delete(n), p(this, Oe).add(n);
}, hr = function() {
  return [...p(this, we)].filter((e) => !p(this, Oe).has(e));
}, /**
 * Attaches one `FramePassOptions` telemetry value to this pass through the nominal attachment
 * protocol, so the frame never learns whether it is a timer span, a visibility or a future
 * scene-view generation: it only records the owner it must settle exactly once.
 */
pr = function(e, n, r, i) {
  const s = ef(e);
  if (!s)
    throw i(e);
  let o;
  try {
    o = s[xo]({ frame: this, device: this.device, target: n });
  } catch (a) {
    throw S(this, O, fr).call(this, p(this, we)), a;
  }
  return p(this, we).add(o.owner), r.push(o.owner), o;
}, mr = async function(e, n, r) {
  await Dr(this.device), H(this.device, "Frame.validation");
  const i = Et(e, n, r);
  this.errorSink ? await this.errorSink(i) : console.error(i);
}, _n = function(e) {
  var n;
  return (n = this.trackSettled) == null || n.call(this, e), e;
}, Oo = (e) => !qr(_e, e) || !p(e, _e) && !p(e, ye);
var yt;
class ih {
  constructor(e, n, r, i = !1, s, o, a) {
    x(this, "encoder");
    x(this, "target");
    x(this, "validations");
    x(this, "depthReadOnly");
    x(this, "occlusionSource");
    x(this, "frame");
    x(this, "assertFrameOpen");
    T(this, yt, !1);
    this.encoder = e, this.target = n, this.validations = r, this.depthReadOnly = i, this.occlusionSource = s, this.frame = o, this.assertFrameOpen = a;
  }
  draw(e, n = {}) {
    var i;
    (i = this.assertFrameOpen) == null || i.call(this, "FramePass.draw");
    const r = oh(e);
    this.depthReadOnly && sh(r, this.target), r.encode(this.encoder, this.target, n, (s) => this.validations.push(s));
  }
  /**
   * Wraps one or more draws in begin/endOcclusionQuery. The body ALWAYS executes; condition your
   * real draws on `q.hidden` outside.
   */
  occlusion(e, n) {
    var i;
    if ((i = this.assertFrameOpen) == null || i.call(this, "FramePass.occlusion"), !this.occlusionSource)
      throw hc();
    if (p(this, yt))
      throw pc();
    const r = this.occlusionSource.beginQuery(e, this.frame);
    this.encoder.beginOcclusionQuery(r), M(this, yt, !0);
    try {
      typeof n == "function" ? n() : this.draw(n);
    } finally {
      M(this, yt, !1), this.encoder.endOcclusionQuery();
    }
  }
  bundles(...e) {
    var r;
    if ((r = this.assertFrameOpen) == null || r.call(this, "FramePass.bundles"), this.depthReadOnly)
      throw Be("pass cannot replay bundles: bundle records bundles with writable depth/stencil, and WebGPU only executes read-only-recorded bundles in a read-only pass.", "Encode the draws directly with pass.draw(...) inside the depthReadOnly pass.", "FramePass.bundles");
    const n = e.map((i) => Qd(i) ?? ah());
    for (const i of n)
      i.assertReplayable(this.target);
    this.encoder.executeBundles(n.map((i) => i.gpu));
  }
}
yt = new WeakMap();
function sh(t, e) {
  var n;
  if (t.writesDepth())
    throw Be(`pass cannot encode draw '${t.label}': its depth state writes depth (the default is write: true). Give the draw depth: { write: false } (or depth: false to disable depth testing).`, "Use depth: { write: false } on the draw, or open the pass without depthReadOnly.", "FramePass.draw");
  if (Wt((n = e.depth) == null ? void 0 : n.format)) {
    const r = t.stencilWritingOps();
    if (r.length)
      throw Be(`pass cannot encode draw '${t.label}': its stencil ops can write (${r.join(", ")}), and the pass's stencil aspect is read-only too.`, 'Use "keep" for those ops or stencil writeMask: 0, or open the pass without depthReadOnly.', "FramePass.draw");
  }
}
function oh(t) {
  const e = Zd(t);
  if (!e)
    throw new TypeError("Invalid Effect instance: pass.draw() expects a Draw or an Effect created by this library.");
  return e;
}
function ah() {
  throw new I({ code: "VGPU-R3-BUNDLE-INVALID", message: "p.bundles() expected bundles created by bundle(gpu, { target }, cb).", where: "FramePass.bundles" });
}
function ch(t) {
  return dc(`FramePassOptions.timer received ${Ge(t)}; expected a TimerSpan from timer.span(name).`, 'Create const passTimer = timer(gpu) once, then pass passTimer.span("name") per pass.', "Frame.pass");
}
function lh(t) {
  return fc(`FramePassOptions.visibility received ${Ge(t)}; expected a Visibility from visibility(gpu).`, "Create const vis = visibility(gpu) once, then pass { target, visibility: vis } per pass.", "Frame.pass");
}
function uh(t, e, n) {
  if (t === void 0)
    return;
  if (typeof t != "object" || t === null || Array.isArray(t))
    throw ge(`received ${Ge(t)}; expected { x?, y?, width, height, minDepth?, maxDepth? }.`);
  const { x: r = 0, y: i = 0, width: s, height: o, minDepth: a = 0, maxDepth: c = 1 } = t;
  for (const [f, h] of [["x", r], ["y", i], ["width", s], ["height", o], ["minDepth", a], ["maxDepth", c]])
    if (typeof h != "number" || !Number.isFinite(h))
      throw ge(`${f} received ${Ge(h)}; expected a finite number.`);
  const l = e.maxTextureDimension2D, u = l * 2, d = `target is ${n[0]}x${n[1]}px, device maxTextureDimension2D is ${l}`;
  if (!(s >= 0 && s <= l))
    throw ge(`width ${s} is outside [0, ${l}] (${d}).`);
  if (!(o >= 0 && o <= l))
    throw ge(`height ${o} is outside [0, ${l}] (${d}).`);
  if (!(r >= -u && r + s <= u - 1))
    throw ge(`x ${r} with width ${s} is outside [${-u}, ${u - 1}] (${d}).`);
  if (!(i >= -u && i + o <= u - 1))
    throw ge(`y ${i} with height ${o} is outside [${-u}, ${u - 1}] (${d}).`);
  if (!(a >= 0 && a <= 1))
    throw ge(`minDepth ${a} is outside [0, 1].`);
  if (!(c >= 0 && c <= 1))
    throw ge(`maxDepth ${c} is outside [0, 1].`);
  if (!(a <= c))
    throw ge(`minDepth ${a} exceeds maxDepth ${c}.`);
  return { x: r, y: i, width: s, height: o, minDepth: a, maxDepth: c };
}
function dh(t, e) {
  if (t === void 0)
    return;
  if (!Array.isArray(t) || t.length !== 4)
    throw Nn(`received ${Ge(t)}; expected [x, y, width, height].`);
  const [n, r, i, s] = t;
  for (const [c, l] of [["x", n], ["y", r], ["width", i], ["height", s]])
    if (typeof l != "number" || !Number.isInteger(l) || l < 0)
      throw Nn(`${c} received ${Ge(l)}; expected a non-negative integer.`);
  const [o, a] = e;
  if (n + i > o || r + s > a)
    throw Nn(`[${n}, ${r}, ${i}, ${s}] exceeds the target's current size ${o}x${a}px (x + width <= ${o}, y + height <= ${a}).`);
  return [n, r, i, s];
}
function Ge(t) {
  return typeof t == "string" ? `'${t}'` : Array.isArray(t) ? `[${t.map((e) => Ge(e)).join(", ")}]` : typeof t == "object" && t !== null ? "an object" : String(t);
}
function fh(t) {
  const e = t == null ? void 0 : t.code;
  return e === "VGPU-DEVICE-DISPOSED" || e === "VGPU-DEVICE-LOST";
}
var vt;
class hh {
  /**
   * @param trackLoop Lifecycle hook for the owning gpu: called with each started loop handle and
   * returns the untrack function the handle runs when it stops on its own, so `gpu.dispose()` can
   * stop the loops still running without holding on to the ones already stopped.
   */
  constructor(e, n, r) {
    x(this, "createFrame");
    x(this, "advance");
    x(this, "trackLoop");
    T(this, vt, !1);
    this.createFrame = e, this.advance = n, this.trackLoop = r;
  }
  frame(e) {
    if (p(this, vt) || zd())
      throw ys();
    M(this, vt, !0), Wd();
    try {
      this.advance();
      const n = this.createFrame();
      if (e) {
        try {
          e(n);
        } catch (r) {
          if (Oo(n))
            try {
              n.cancel();
            } catch {
            }
          throw r;
        }
        try {
          n.submit();
        } catch (r) {
          if (!fh(r))
            throw r;
        }
      }
      return n;
    } finally {
      Hd(), M(this, vt, !1);
    }
  }
  loop(e, n = {}) {
    var h;
    let r = !1;
    const i = globalThis.requestAnimationFrame ?? ((g) => setTimeout(() => g(performance.now()), 16)), s = globalThis.cancelAnimationFrame ?? ((g) => clearTimeout(g)), o = n.fps && n.fps > 0 ? 1e3 / n.fps : 0;
    let a, c = 0, l;
    const u = () => {
      r = !0, s(c), l == null || l(), l = void 0;
    }, d = (g) => {
      if (!r) {
        if (ph(g, a, o)) {
          a = g;
          try {
            this.frame(e);
          } catch (w) {
            throw u(), w;
          }
        }
        r || (c = i(d));
      }
    };
    c = i(d);
    const f = { stop: u };
    return l = (h = this.trackLoop) == null ? void 0 : h.call(this, f), f;
  }
}
vt = new WeakMap();
function ph(t, e, n) {
  return e === void 0 || n <= 0 ? !0 : t - e >= n;
}
function gr(t, e) {
  return new mh(Ie(t, "target").device, e);
}
var Jt, tt, re, ve, nt, Se, St, j, No, Uo, br, xr, wr, _r;
class mh {
  constructor(e, n) {
    T(this, j);
    x(this, "device");
    x(this, "options");
    x(this, "resourceIdentity", kn("render-target"));
    T(this, Jt, new Dn());
    T(this, tt, /* @__PURE__ */ new Set());
    T(this, re);
    T(this, ve);
    T(this, nt);
    T(this, Se);
    T(this, St);
    this.device = e, this.options = n, wd(n, e), M(this, St, n.clearColor === void 0 ? Ur : $n(n.clearColor, "target.clearColor")), M(this, re, n.size), M(this, ve, S(this, j, xr).call(this)), M(this, nt, this.sampleCount === 4 ? S(this, j, wr).call(this) : void 0), M(this, Se, S(this, j, _r).call(this));
  }
  get gpu() {
    return this.color.gpu;
  }
  get size() {
    return p(this, re);
  }
  get texelSize() {
    return [1 / p(this, re)[0], 1 / p(this, re)[1]];
  }
  /** Resolved, sampleable color texture. For MSAA targets, render passes resolve into this texture. */
  get color() {
    return p(this, ve)[0];
  }
  /** Resolved, sampleable color textures. For MSAA targets, render passes resolve into these textures. */
  get colors() {
    return p(this, ve);
  }
  get depth() {
    return p(this, Se);
  }
  get format() {
    var e;
    return ((e = gn(this.options)[0]) == null ? void 0 : e.format) ?? "rgba8unorm";
  }
  /** Default clear color of this target; passes that clear without naming a color use it. */
  get clearColor() {
    return Vr(p(this, St));
  }
  set clearColor(e) {
    M(this, St, $n(e, "target.clearColor"));
  }
  get sampleCount() {
    return eo(this.options);
  }
  resize(e) {
    no(p(this, re), e) || S(this, j, No).call(this, e);
  }
  async read() {
    return this.color.read();
  }
  async readFloats() {
    return this.color.readFloats();
  }
  onDestroy(e) {
    return p(this, Jt).onDestroy(this, e);
  }
  onTexturesRecreated(e) {
    return p(this, tt).add(e), () => {
      p(this, tt).delete(e);
    };
  }
  destroy() {
    p(this, Jt).emit(this), p(this, tt).clear(), S(this, j, br).call(this);
  }
  renderPassDescriptor(e = {}) {
    const { clear: n = [0, 0, 0, 1], preserve: r, clearDepth: i, clearStencil: s, depthReadOnly: o } = e;
    return {
      colorAttachments: p(this, ve).map((a, c) => {
        var l;
        return yd(a, (l = p(this, nt)) == null ? void 0 : l[c], n, r);
      }),
      depthStencilAttachment: p(this, Se) ? vd(p(this, Se), r, i, s, o) : void 0
    };
  }
}
Jt = new WeakMap(), tt = new WeakMap(), re = new WeakMap(), ve = new WeakMap(), nt = new WeakMap(), Se = new WeakMap(), St = new WeakMap(), j = new WeakSet(), No = function(e) {
  S(this, j, br).call(this), M(this, re, [e[0], e[1]]), M(this, ve, S(this, j, xr).call(this)), M(this, nt, this.sampleCount === 4 ? S(this, j, wr).call(this) : void 0), M(this, Se, S(this, j, _r).call(this)), S(this, j, Uo).call(this);
}, Uo = function() {
  for (const e of [...p(this, tt)])
    e();
}, br = function() {
  var e;
  for (const n of p(this, ve))
    n.destroy();
  for (const n of p(this, nt) ?? [])
    n.destroy();
  (e = p(this, Se)) == null || e.destroy();
}, xr = function() {
  return gn(this.options).map((e, n) => this.device.createTexture({
    size: p(this, re),
    format: e.format,
    usage: ["render_attachment", "texture_binding", "copy_src"],
    sampleCount: 1,
    label: this.options.label ? `${this.options.label}.color${n}.resolve` : void 0
  }));
}, wr = function() {
  return gn(this.options).map((e, n) => this.device.createTexture({
    size: p(this, re),
    format: e.format,
    usage: ["render_attachment"],
    sampleCount: 4,
    label: this.options.label ? `${this.options.label}.color${n}` : void 0
  }));
}, _r = function() {
  const e = Qs(this.options);
  return e ? this.device.createTexture({
    size: p(this, re),
    format: e,
    usage: ["render_attachment", "texture_binding"],
    sampleCount: this.sampleCount,
    label: this.options.label ? `${this.options.label}.depth` : void 0
  }) : void 0;
};
function gh(t, e, n = "read-write") {
  const r = Ie(t, "storage"), i = typeof n == "string" ? { access: n } : n, s = bh(r.device, e, i.access ?? "read-write", void 0, i.indirect ?? !1);
  return As(r, s, (o) => o.destroy(), (o) => {
    s.onDestroy(o);
  });
}
class Hr {
  constructor(e, n) {
    x(this, "size");
    x(this, "access");
    x(this, "buffer");
    this.buffer = e, this.access = n, this.size = e.options.size;
  }
  static create(e, n, r, i, s = !1) {
    const o = s ? ["storage", "copy_dst", "copy_src", "indirect"] : ["storage", "copy_dst", "copy_src"], a = e.createBuffer({
      size: n,
      usage: o,
      label: i
    });
    return new Hr(a, r);
  }
  read() {
    return this.buffer.read(this.size);
  }
  write(e, n = 0) {
    this.buffer.write(xh(e), n);
  }
  get gpu() {
    return this.buffer.gpu;
  }
  get resourceIdentity() {
    return this.buffer.resourceIdentity;
  }
  onDestroy(e) {
    return this.buffer.onDestroy(e);
  }
  /** Frees the GPU allocation. Idempotent; bind groups holding it are invalidated through the buffer's destroy signal. */
  destroy() {
    this.buffer.destroy();
  }
}
function bh(t, e, n, r, i = !1) {
  return Hr.create(t, e, n, r, i);
}
function xh(t) {
  if (t instanceof ArrayBuffer || ArrayBuffer.isView(t))
    return t;
  throw new TypeError("StorageBuffer.write() requires ArrayBuffer or ArrayBufferView.");
}
const ue = 24, Vo = 180 / 630 * 0.8, Nt = 720, wh = 360, _h = 0.0236, yh = 2, vh = 1, Sh = 1, Eh = 5, Ah = 2, Ih = 1, Bo = 10, $h = 4, Ch = 0.2, ze = {
  edge: "edge",
  lines: "lines"
}, yr = {
  mode: ze.lines,
  transitionDuration: 0.25,
  edgeIndex: 0,
  edgeHighlightBrightness: 0.4
}, Ut = {
  glowEnabled: !0,
  glowRadius: 165,
  glowStrength: 1,
  glowSmoothing: 0.23,
  glowFacingEnabled: !0,
  glowFacingFullDeg: 90,
  glowFacingZeroDeg: 100,
  linesFadeDistance: 0.6
}, ns = {
  ledIntensity: 1,
  brightnessMin: 0.09,
  brightnessMinDark: 0.05,
  brightnessMax: 1
}, jn = {
  enabled: !0,
  amount: 1,
  radius: 173,
  power: 3,
  responseSmoothing: 0.2,
  edgeRedLinear: { r: 0.896269, g: 0.027321, b: 0.051269 },
  edgeGreenLinear: { r: 0, g: 0.40724, b: 0.048172 },
  edgeBlueLinear: { r: 0, g: 0.278894, b: 1 },
  edgeOverlap: 1
};
function zo(t) {
  return Math.max(1, wh / Math.max(1, t));
}
let Wo = 1;
function Th(t) {
  Wo = Number.isFinite(t) && t > 0 ? t : 1;
}
function Lh(t, e, n = !1) {
  return n || !Number.isFinite(e) || e <= 0 ? t : t * Math.min(1, 560 / e);
}
function $e(t) {
  const e = t.height * Vo * Wo, n = e * 2 / 3, r = e / 3, i = e * 2 / Math.sqrt(3), s = t.width * 0.5, o = t.height * 0.5, a = { x: s, y: o }, c = { x: s, y: o - n }, l = { x: s - i * 0.5, y: o + r }, u = { x: s + i * 0.5, y: o + r };
  return {
    center: a,
    top: c,
    left: l,
    right: u,
    height: e,
    circumradius: n,
    inradius: r,
    sideLength: i
  };
}
function Fh(t) {
  return $e(t).height * _h;
}
function Ho(t) {
  return Fh(t) * yh;
}
function kh(t) {
  const e = Ho(t) * Math.sqrt(3) + Sh, n = $e(t).sideLength;
  return Math.min(e, n * 0.45);
}
function Dh(t, e) {
  const n = $e(t), r = kh(t), s = Math.max(0, n.sideLength - r * 2) / Math.max(1, e), o = Ho(t), a = Math.max(
    0,
    s * 0.5 - vh * 0.5
  );
  return {
    normalHalfThickness: o,
    tangentHalfLength: a,
    cornerTrim: r,
    centerSpacing: s
  };
}
function jo(t, e) {
  const n = t.center, r = (i) => ({
    x: n.x + (i.x - n.x) * e,
    y: n.y + (i.y - n.y) * e
  });
  return {
    center: n,
    top: r(t.top),
    left: r(t.left),
    right: r(t.right),
    height: t.height * e,
    circumradius: t.circumradius * e,
    inradius: t.inradius * e,
    sideLength: t.sideLength * e
  };
}
function Ko(t) {
  const e = Nt * Vo, n = Eh * Math.min(t.height, e) / e;
  return t.inradius > n ? (t.inradius - n) / t.inradius : 1;
}
function Mh(t) {
  const e = $e(t);
  return jo(e, Ko(e));
}
function qo(t, e) {
  const n = $e(t), r = Ko(n), i = jo(n, r), { top: s, left: o, right: a, center: c } = i, l = [
    [s, o],
    [o, a],
    [a, s]
  ], u = { width: t.width, height: t.height * r }, d = Dh(u, e), f = [];
  for (const [h, g] of l) {
    const w = g.x - h.x, b = g.y - h.y, _ = Math.hypot(w, b), y = Math.atan2(b, w), E = _ > 0 ? d.cornerTrim / _ : 0, L = _ > 0 ? d.centerSpacing / _ : 0;
    for (let $ = 0; $ < e; $++) {
      const F = E + ($ + 0.5) * L;
      f.push({ x: h.x + w * F, y: h.y + b * F, angle: y });
    }
  }
  return { center: c, positions: f, geometry: i, ledShape: d };
}
const it = 8, he = ue * 3, de = 4, Ph = 0.1, Rh = 10, Oh = 0.125, Gh = { r: 0.896269, g: 0.027321, b: 0.051269 }, Nh = { r: 0, g: 0.40724, b: 0.048172 }, Uh = { r: 0, g: 0.278894, b: 1 }, Vh = 0.2126, Bh = 0.7152, zh = 0.0722, Xo = [6, 6, 6], Wh = [-3.302, -2.355, -1.636], Yo = ue, Jo = ue * 1.7, Hh = (Yo + Jo) / 2, jh = (Jo - Yo) / 2, Kh = [0.41, 0.31, 0.23], qh = [0, 2.1, 4.2], Xh = [0.52, 0.38, 0.28], Yh = [Math.PI / 2, 0.4, -0.6], Jh = 0.3, Zh = 1.2;
function Qh(t, e) {
  const n = qo(t, ue), r = new Float32Array(n.positions.length * it), i = new Float32Array(r.length), s = new Float32Array(r.length), o = new Float32Array(r.length), a = new Float32Array(n.positions.length * 2);
  for (const [c, l] of n.positions.entries()) {
    const u = c * it, d = l.x, f = l.y, h = l.angle ?? 0;
    r[u] = d, r[u + 1] = f, r[u + 2] = 0, r[u + 3] = h, r[u + de] = 1, r[u + de + 1] = 1, r[u + de + 2] = 1, r[u + de + 3] = 0;
    const g = d - n.center.x, w = f - n.center.y;
    let b = -Math.sin(h), _ = Math.cos(h);
    b * g + _ * w < 0 && (b = -b, _ = -_), a[c * 2] = b, a[c * 2 + 1] = _;
  }
  return i.set(r), s.set(r), o.set(r), {
    data: r,
    currentState: i,
    targetState: s,
    deployingState: o,
    normals: a,
    triangleHeight: n.geometry.height,
    deployEdgeCenters: [
      qn(n.geometry.top, n.geometry.left),
      qn(n.geometry.left, n.geometry.right),
      qn(n.geometry.right, n.geometry.top)
    ],
    triangleVertices: [
      { x: n.geometry.top.x, y: n.geometry.top.y },
      { x: n.geometry.left.x, y: n.geometry.left.y },
      { x: n.geometry.right.x, y: n.geometry.right.y }
    ],
    lastMode: e == null ? void 0 : e.lastMode,
    lastEdgeIndex: e == null ? void 0 : e.lastEdgeIndex,
    transitionStart: 0,
    transitionDuration: 0,
    transitionActive: !1,
    animationClock: (e == null ? void 0 : e.animationClock) ?? 0,
    lastFrameTime: e == null ? void 0 : e.lastFrameTime,
    lineCenters: (e == null ? void 0 : e.lineCenters) ?? Float32Array.from(Xo),
    lineVelocities: (e == null ? void 0 : e.lineVelocities) ?? Float32Array.from(Wh),
    glowState: (e == null ? void 0 : e.glowState) ?? new Float32Array(he),
    glowDecaying: (e == null ? void 0 : e.glowDecaying) ?? !1,
    hoverTransition: (e == null ? void 0 : e.hoverTransition) ?? 0,
    hoverActive: (e == null ? void 0 : e.hoverActive) ?? !1
  };
}
function ep(t, e, n, r, i, s) {
  const o = t.lastFrameTime === void 0, a = t.lastFrameTime === void 0 ? 0 : Math.max(0, Math.min(e - t.lastFrameTime, Ph));
  t.lastFrameTime = e;
  const c = 1 + (Rh - 1) * Math.sin(q((i == null ? void 0 : i.factor) ?? 0) * Math.PI), l = a * c;
  o && (t.animationClock = Bo), t.animationClock += l;
  const u = t.animationClock, d = lp(r.edgeIndex), f = r.mode === ze.edge && t.lastEdgeIndex !== void 0 && d !== t.lastEdgeIndex, h = t.lastMode === void 0 || r.mode !== t.lastMode;
  t.lastMode === void 0 ? (t.lastMode = r.mode, t.lastEdgeIndex = d, t.transitionActive = !1) : (r.mode !== t.lastMode || f) && (t.currentState.set(t.data), t.transitionStart = e, t.transitionDuration = Math.max(0, r.transitionDuration), t.transitionActive = t.transitionDuration > 0, t.lastMode = r.mode, t.lastEdgeIndex = d), h && r.mode === ze.lines && t.lineCenters.set(Xo), r.mode === ze.edge ? np(
    t.targetState,
    d,
    n.brightnessMin * Oh,
    r.edgeHighlightBrightness
  ) : tp(t, t.targetState, u, l);
  const g = r.mode === ze.lines && ((s == null ? void 0 : s.linesFadeDistance) ?? 0) > 0;
  let w = 0;
  if (g) {
    let $ = 0;
    if ((s == null ? void 0 : s.active) === !0 && s.isMouse === !0 && s.inside !== !0) {
      const F = (s.linesFadeDistance ?? 0) * t.triangleHeight, k = t.triangleVertices, m = sp(s.x, s.y, k[0], k[1], k[2]);
      !t.hoverActive && m < F ? t.hoverActive = !0 : t.hoverActive && m > F * Zh && (t.hoverActive = !1), $ = t.hoverActive ? 1 : 0;
    } else
      t.hoverActive = !1;
    if (t.hoverTransition > 1e-4 || $ > 0) {
      const F = 1 - Math.exp(-a / Jh);
      t.hoverTransition += ($ - t.hoverTransition) * F;
    }
    if (w = q(t.hoverTransition), w > 1e-4) {
      const F = 1 - w;
      for (let k = 0; k < he; k++)
        t.targetState[k * it + 2] *= F;
    }
  } else (t.hoverTransition !== 0 || t.hoverActive) && (t.hoverTransition = 0, t.hoverActive = !1);
  if (t.transitionActive) {
    const $ = q(
      (e - t.transitionStart) / t.transitionDuration
    );
    rs(
      t.data,
      t.currentState,
      t.targetState,
      up($)
    ), $ >= 1 && (t.transitionActive = !1);
  } else
    t.data.set(t.targetState);
  const b = q((i == null ? void 0 : i.factor) ?? 0);
  b > 0 && (rp(t, t.deployingState, i == null ? void 0 : i.tint), rs(t.data, t.data, t.deployingState, b));
  const _ = g ? w : 1, y = (s == null ? void 0 : s.glowStrength) ?? 0, E = (s == null ? void 0 : s.glowRadius) ?? 0, L = (s == null ? void 0 : s.active) === !0 && s.isMouse === !0 && s.glowEnabled === !0 && y > 0 && E > 0;
  if (L || t.glowDecaying) {
    const $ = (s == null ? void 0 : s.glowSmoothing) ?? 0, F = $ > 0 ? 1 - Math.exp(-a / $) : 1, k = (s == null ? void 0 : s.x) ?? 0, m = (s == null ? void 0 : s.y) ?? 0, v = (s == null ? void 0 : s.glowFacingEnabled) === !0, C = Math.cos(
      ((s == null ? void 0 : s.glowFacingFullDeg) ?? 90) * Math.PI / 180
    ), A = Math.cos(
      ((s == null ? void 0 : s.glowFacingZeroDeg) ?? 100) * Math.PI / 180
    ), R = C - A;
    let G = !1;
    for (let P = 0; P < he; P++) {
      const X = P * it;
      let Y = 0;
      if (L) {
        const ce = (t.data[X] ?? 0) - k, jr = (t.data[X + 1] ?? 0) - m, tn = Math.hypot(ce, jr);
        if (Y = y * (1 - dp(0, E, tn)), v && Y > 0 && tn > 1e-4) {
          const Kr = (t.normals[P * 2] ?? 0) * (-ce / tn) + (t.normals[P * 2 + 1] ?? 0) * (-jr / tn), ea = R > 1e-6 ? q((Kr - A) / R) : Kr >= C ? 1 : 0;
          Y *= ea;
        }
      }
      const Ue = (t.glowState[P] ?? 0) + (Y - (t.glowState[P] ?? 0)) * F;
      if (t.glowState[P] = Ue, Ue > 1e-4) {
        G = !0;
        const ce = Ue * _;
        ce > 1e-4 && (t.data[X + 2] = yn(t.data[X + 2] ?? 0, 1, ce));
      }
    }
    t.glowDecaying = L || G;
  }
}
function tp(t, e, n, r) {
  for (let c = 0; c < 3; c++)
    t.lineCenters[c] = cp(
      (t.lineCenters[c] ?? 0) + (t.lineVelocities[c] ?? 0) * r
    );
  const i = n - Bo, s = [], o = [], a = [];
  for (let c = 0; c < 3; c++) {
    const l = Hh + jh * Math.sin(
      i * (Kh[c] ?? 0) + (qh[c] ?? 0)
    ), u = Math.max(1, l * 0.5);
    s[c] = u, o[c] = u * 0.5, a[c] = 0.5 + 0.5 * Math.sin(
      i * (Xh[c] ?? 0) + (Yh[c] ?? 0)
    );
  }
  for (let c = 0; c < he; c++) {
    let l = 0;
    for (let u = 0; u < 3; u++) {
      const d = Math.abs(
        ap(c, t.lineCenters[u] ?? 0, he)
      ), f = s[u] ?? 1, h = o[u] ?? 0;
      let g = 0;
      d <= h ? g = 1 : g = q(1 - (d - h) / (f - h)), l = Math.max(l, g * (a[u] ?? 0));
    }
    Zo(e, c, q(l), 1, 1, 1);
  }
}
function np(t, e, n, r) {
  const i = e * ue, s = i + ue, o = q(n), a = q(r);
  for (let c = 0; c < he; c++)
    Zo(t, c, c >= i && c < s ? a : o, 1, 1, 1);
}
function rp(t, e, n) {
  e.set(t.data);
  for (let r = 0; r < he; r++) {
    const i = ip(t, r, n);
    op(e, r, i.r, i.g, i.b);
  }
}
function ip(t, e, n) {
  const r = q((n == null ? void 0 : n.amount) ?? 1), i = Math.max((n == null ? void 0 : n.radius) ?? 1, 1), s = Math.max((n == null ? void 0 : n.power) ?? 1, 1e-3), o = (n == null ? void 0 : n.edgeRedLinear) ?? Gh, a = (n == null ? void 0 : n.edgeGreenLinear) ?? Nh, c = (n == null ? void 0 : n.edgeBlueLinear) ?? Uh, l = e * it, u = t.data[l] ?? 0, d = t.data[l + 1] ?? 0, [f, h, g] = t.deployEdgeCenters, w = 1 / Math.max((n == null ? void 0 : n.edgeOverlap) ?? 1, 0.01), b = Kn(u, d, f.x, f.y, i, s) ** w, _ = Kn(u, d, h.x, h.y, i, s) ** w, y = Kn(u, d, g.x, g.y, i, s) ** w, E = Math.max(b + _ + y, 1e-4), L = (o.r * b + a.r * _ + c.r * y) / E, $ = (o.g * b + a.g * _ + c.g * y) / E, F = (o.b * b + a.b * _ + c.b * y) / E, k = Vh * L + Bh * $ + zh * F, m = k <= 1e-4 ? 1 : 1 / k;
  return {
    r: yn(1, L * m, r),
    g: yn(1, $ * m, r),
    b: yn(1, F * m, r)
  };
}
function Kn(t, e, n, r, i, s) {
  return (1 / (1 + Math.hypot(t - n, e - r) / i)) ** s;
}
function sp(t, e, n, r, i) {
  const s = r.x - n.x, o = r.y - n.y, a = i.x - r.x, c = i.y - r.y, l = n.x - i.x, u = n.y - i.y, d = t - n.x, f = e - n.y, h = t - r.x, g = e - r.y, w = t - i.x, b = e - i.y, _ = q(
    (d * s + f * o) / (s * s + o * o || 1)
  ), y = q(
    (h * a + g * c) / (a * a + c * c || 1)
  ), E = q(
    (w * l + b * u) / (l * l + u * u || 1)
  ), L = d - s * _, $ = f - o * _, F = h - a * y, k = g - c * y, m = w - l * E, v = b - u * E, C = Math.sign(s * u - o * l), A = Math.min(
    L * L + $ * $,
    F * F + k * k,
    m * m + v * v
  ), R = Math.min(
    C * (d * o - f * s),
    C * (h * c - g * a),
    C * (w * u - b * l)
  );
  return -Math.sqrt(A) * Math.sign(R);
}
function qn(t, e) {
  return { x: (t.x + e.x) * 0.5, y: (t.y + e.y) * 0.5 };
}
function rs(t, e, n, r) {
  for (let i = 0; i < t.length; i++) {
    const s = e[i] ?? 0;
    t[i] = s + ((n[i] ?? 0) - s) * r;
  }
}
function Zo(t, e, n, r, i, s) {
  const o = e * it;
  t[o + 2] = n, t[o + de] = r, t[o + de + 1] = i, t[o + de + 2] = s;
}
function op(t, e, n, r, i) {
  const s = e * it;
  t[s + de] = n, t[s + de + 1] = r, t[s + de + 2] = i;
}
function ap(t, e, n) {
  return ((t - e) % n + n + n / 2) % n - n / 2;
}
function cp(t) {
  return (t % he + he) % he;
}
function lp(t) {
  return Number.isFinite(t) ? Math.max(0, Math.min(2, Math.round(t))) : 0;
}
function up(t) {
  const e = q(t);
  return e * e;
}
function dp(t, e, n) {
  const r = q((n - t) / (e - t));
  return r * r * (3 - 2 * r);
}
function yn(t, e, n) {
  return t + (e - t) * n;
}
function q(t) {
  return Math.max(0, Math.min(1, t));
}
const fp = {
  x: -1e3,
  y: -1e3,
  active: !1,
  inside: !1,
  isMouse: !1
};
function hp() {
  const t = { initialized: !1, lastTime: 0, value: 0 }, e = { initialized: !1, lastTime: 0, value: 0 }, n = {
    ...Ut,
    x: -1e3,
    y: -1e3,
    active: !1
  }, r = { ...ns }, i = { ...yr };
  return {
    resolveFrame(s) {
      const { time: o } = s;
      Object.assign(n, Ut, fp, s.patch), Object.assign(r, ns), Object.assign(i, yr, s.hero);
      const a = is(
        t,
        jn.enabled && s.hoverRgbDeployActive ? 1 : 0,
        o,
        jn.responseSmoothing
      ), c = r.brightnessMinDark;
      return r.brightnessMin = is(
        e,
        n.active && n.inside === !0 ? c * $h : c,
        o,
        Ch
      ), s.updateLedsFor({
        time: o,
        tunables: r,
        settings: i,
        hoverDeploy: { factor: a, tint: jn },
        brush: n
      }), { tunables: r };
    }
  };
}
function is(t, e, n, r) {
  if (!t.initialized)
    return t.initialized = !0, t.lastTime = n, t.value = e, t.value;
  const i = n - t.lastTime;
  if (t.lastTime = n, r <= 0 || !Number.isFinite(r))
    return t.value = e, t.value;
  const s = Math.min(0.25, Math.max(0, Number.isFinite(i) ? i : 0)), o = 1 - Math.exp(-s / r);
  return t.value = t.value + (e - t.value) * o, Math.abs(t.value - e) < 1e-4 && (t.value = e), t.value;
}
const pp = { version: 1, wgsl: `struct Config {\r
  resolution: vec2f,\r
  tunables: vec4f,\r
  triangle: vec4f,\r
  led_clip: vec4f,\r
};\r
struct Led {\r
  pos_brightness: vec4f,\r
  color: vec4f,\r
};\r
@group(0) @binding(0) var<uniform> cfg: Config;\r
@group(0) @binding(1) var<storage, read> leds: array<Led>;\r
\r
struct VSIn {\r
  @location(0) position: vec2f,\r
  @location(1) led_index: f32,\r
};\r
struct VSOut {\r
  @builtin(position) pos: vec4f,\r
  @location(0) led_index: f32,\r
};\r
\r
@vertex fn vs_main(in: VSIn) -> VSOut {\r
  var out: VSOut;\r
  let clip = (in.position / cfg.resolution) * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0);\r
  out.pos = vec4f(clip, 0.0, 1.0);\r
  out.led_index = in.led_index;\r
  return out;\r
}\r
\r
fn signed_triangle_area(a: vec2f, b: vec2f, p: vec2f) -> f32 {\r
  let edge = b - a;\r
  return edge.x * (p.y - a.y) - edge.y * (p.x - a.x);\r
}\r
fn inside_triangle(p: vec2f, a: vec2f, b: vec2f, c: vec2f) -> bool {\r
  let side0 = signed_triangle_area(a, b, p);\r
  let side1 = signed_triangle_area(b, c, p);\r
  let side2 = signed_triangle_area(c, a, p);\r
  return (side0 <= 0.0 && side1 <= 0.0 && side2 <= 0.0) || (side0 >= 0.0 && side1 >= 0.0 && side2 >= 0.0);\r
}\r
fn segment_distance(p: vec2f, a: vec2f, b: vec2f) -> f32 {\r
  let pa = p - a;\r
  let ba = b - a;\r
  let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);\r
  return length(pa - ba * h);\r
}\r
fn triangle_sdf(p: vec2f, a: vec2f, b: vec2f, c: vec2f) -> f32 {\r
  let edge_dist = min(segment_distance(p, a, b), min(segment_distance(p, b, c), segment_distance(p, c, a)));\r
  return select(edge_dist, -edge_dist, inside_triangle(p, a, b, c));\r
}\r
\r
@fragment fn fs_main(in: VSOut) -> @location(0) vec4f {\r
  let pixel = in.pos.xy;\r
  let top = vec2f(cfg.triangle.x, cfg.triangle.y - cfg.triangle.z);\r
  let left = vec2f(cfg.triangle.x - cfg.triangle.w, cfg.triangle.y + cfg.triangle.z * 0.5);\r
  let right = vec2f(cfg.triangle.x + cfg.triangle.w, cfg.triangle.y + cfg.triangle.z * 0.5);\r
  let tri_dist = triangle_sdf(pixel, top, left, right);\r
  // Positive expansion reveals emitter pixels outside the canonical triangle.\r
  if (tri_dist - cfg.led_clip.x > 0.0) {\r
    discard;\r
  }\r
\r
  let raw_index = u32(max(round(in.led_index), 0.0));\r
  let i = min(raw_index, arrayLength(&leds) - 1u);\r
  let n01 = clamp(leds[i].pos_brightness.z, 0.0, 1.0);\r
  let intensity = mix(cfg.tunables.y, cfg.tunables.z, n01);\r
  let emit = leds[i].color.rgb * cfg.tunables.x * intensity;\r
  // Alpha (the LED SDF) is masked off by the pipeline writeMask (0x7 = RGB only) — the fullscreen\r
  // prepass owns the SDF — so the led_dist that used to go here is never written. Skip computing it.\r
  return vec4f(emit, 0.0);\r
}\r
`, functionExports: [] }, mp = "rgba16float";
function gp(t, e) {
  const n = { width: e.size[0], height: e.size[1] }, r = e.triangle ?? $e(n), i = gr(t, {
    size: [n.width, n.height],
    format: mp,
    label: "triangle-led-front-light-sources"
  }), s = wp(
    n,
    Ih
  ), o = Bc(t, {
    label: "triangle-led-front-led-emitters",
    buffers: [{
      data: s.buffer,
      stride: 12,
      attributes: {
        position: "float32x2",
        led_index: "float32"
      }
    }]
  }), a = xn(t, {
    shader: pp,
    label: "triangle-led-front-led-emitters-pass",
    geometry: o,
    writeMask: ["r", "g", "b"],
    set: { cfg: xp(), leds: e.ledStorage }
  }), c = a.compile(i), l = dr(
    t,
    { target: i, label: "triangle-led-front-led-emitters" },
    (u) => u.draw(a)
  );
  return {
    texture: i,
    ready: c,
    encode({ frame: u, tunables: d }) {
      const f = bp(
        n,
        d,
        r
      );
      a.set({ cfg: f }), u.pass(
        { target: i, clear: [0, 0, 0, 1e3] },
        (h) => h.bundles(l)
      );
    },
    destroy() {
      var u;
      (u = i.destroy) == null || u.call(i), o.destroy();
    }
  };
}
function bp(t, e, n) {
  return {
    resolution: [t.width, t.height],
    tunables: [
      e.ledIntensity,
      e.brightnessMin,
      e.brightnessMax,
      0
    ],
    triangle: [
      n.center.x,
      n.center.y,
      n.circumradius,
      n.sideLength * 0.5
    ],
    led_clip: [Ah, 0, 0, 0]
  };
}
function xp() {
  return {
    resolution: [0, 0],
    tunables: [0, 0, 0, 0],
    triangle: [0, 0, 0, 0],
    led_clip: [0, 0, 0, 0]
  };
}
function wp(t, e) {
  const n = qo(t, ue), { tangentHalfLength: r, normalHalfThickness: i } = n.ledShape, s = r + e, o = i + e, a = [], c = (d, f, h) => {
    a.push(f, h, d);
  }, l = (d, f, h, g, w, b, _, y) => {
    const E = [
      { t: w, n: _ },
      { t: b, n: _ },
      { t: b, n: y },
      { t: w, n: y }
    ], L = [0, 1, 2, 0, 2, 3];
    for (const $ of L) {
      const F = E[$];
      c(
        d,
        f.x + h.x * F.t + g.x * F.n,
        f.y + h.y * F.t + g.y * F.n
      );
    }
  };
  for (const [d, f] of n.positions.entries()) {
    const h = Xn(f.angle ?? 0);
    l(
      d,
      f,
      h.dir,
      h.normal,
      -s,
      s,
      -o,
      o
    );
  }
  const u = [
    n.geometry.top,
    n.geometry.left,
    n.geometry.right
  ];
  for (let d = 0; d < 3; d++) {
    const h = (d + 2) % 3 * ue + ue - 1, g = d * ue, w = n.positions[h], b = n.positions[g], _ = u[d];
    if (!w || !b || !_) continue;
    const y = Xn(w.angle ?? 0), E = Xn(b.angle ?? 0), L = {
      x: w.x + y.dir.x * s,
      y: w.y + y.dir.y * s
    }, $ = {
      x: b.x - E.dir.x * s,
      y: b.y - E.dir.y * s
    }, F = _p({
      x: L.x + $.x - _.x * 2,
      y: L.y + $.y - _.y * 2
    }), k = {
      x: _.x + F.x * (n.ledShape.cornerTrim + s),
      y: _.y + F.y * (n.ledShape.cornerTrim + s)
    }, m = ss(
      un(L, y.normal, -o),
      un(L, y.normal, o),
      $
    ), v = ss(
      un($, E.normal, -o),
      un($, E.normal, o),
      L
    ), C = yp(
      m,
      y.dir,
      v,
      E.dir
    ) ?? _;
    c(h, C.x, C.y), c(
      h,
      m.x,
      m.y
    ), c(h, k.x, k.y), c(g, C.x, C.y), c(g, k.x, k.y), c(
      g,
      v.x,
      v.y
    );
  }
  return new Float32Array(a);
}
function Xn(t) {
  const e = { x: Math.cos(t), y: Math.sin(t) };
  return { dir: e, normal: { x: -e.y, y: e.x } };
}
function _p(t) {
  const e = Math.hypot(t.x, t.y);
  return e <= 0 ? { x: 0, y: 0 } : { x: t.x / e, y: t.y / e };
}
function un(t, e, n) {
  return { x: t.x + e.x * n, y: t.y + e.y * n, n };
}
function ss(t, e, n) {
  return os(t, n) >= os(e, n) ? t : e;
}
function os(t, e) {
  const n = t.x - e.x, r = t.y - e.y;
  return n * n + r * r;
}
function yp(t, e, n, r) {
  const i = e.x * r.y - e.y * r.x;
  if (Math.abs(i) < 1e-6) return;
  const s = ((n.x - t.x) * r.y - (n.y - t.y) * r.x) / i;
  return { x: t.x + e.x * s, y: t.y + e.y * s };
}
function vp(t, e, n) {
  const r = zo(e);
  return {
    simulationWidth: t * r,
    simulationHeight: e * r,
    pixelRatio: n
  };
}
function vr(t, e) {
  return e != null && e.active ? {
    ...t,
    x: e.x,
    y: e.y,
    active: !0,
    inside: e.inside ?? !1,
    isMouse: e.isMouse ?? !1
  } : {
    ...t,
    x: -1e3,
    y: -1e3,
    active: !1,
    inside: !1,
    isMouse: !1
  };
}
function Sp(t, e, n) {
  const r = zo(n);
  return vr(t, {
    ...e,
    x: e.x * r,
    y: e.y * r
  });
}
const Ep = [0, 2, 1];
function as(t) {
  return t === 0 || t === 1 || t === 2 ? { mode: ze.edge, edgeIndex: Ep[t] } : {
    mode: ze.lines,
    edgeIndex: yr.edgeIndex
  };
}
const Ap = { version: 1, wgsl: `struct Config {\r
  tri_a_b: vec4f,\r
  tri_c_target: vec4f,\r
  size_steps: vec4f,\r
  params: vec4f,\r
  target_info: vec4f,\r
};\r
\r
@group(0) @binding(0) var<uniform> cfg: Config;\r
@group(0) @binding(1) var light_sources_tex: texture_2d<f32>;\r
\r
struct VSOut { @builtin(position) pos: vec4f };\r
struct Interval { start: f32, length: f32, valid: bool };\r
struct TraceHit { rgb: vec3f, distance: f32, hit: bool };\r
\r
const MAX_RAYS: u32 = 24u;\r
// Jitter amplitude as a fraction of one stratum width. 1.0 = full-width: adjacent\r
// strata can swap which discrete LED they sample, maximizing per-pixel variance (the\r
// clumpy chroma/luma noise at low ray counts). The half-res→full cubic upsample\r
// already protects against banding, so we attenuate the jitter and let regular\r
// stratification carry the signal — each ray stays near its stratum center and\r
// randomization only dithers residual stratum boundaries.\r
const JITTER_AMPLITUDE: f32 = 0.7;\r
const PI: f32 = 3.141592653589793;\r
const EPSILON: f32 = 1e-5;\r
\r
@vertex fn vs_main(@builtin(vertex_index) vi: u32) -> VSOut {\r
  var p = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));\r
  var out: VSOut;\r
  out.pos = vec4f(p[vi], 0.0, 1.0);\r
  return out;\r
}\r
\r
fn tri_a() -> vec2f { return cfg.tri_a_b.xy; }\r
fn tri_b() -> vec2f { return cfg.tri_a_b.zw; }\r
fn tri_c() -> vec2f { return cfg.tri_c_target.xy; }\r
\r
fn cross2(a: vec2f, b: vec2f) -> f32 {\r
  return a.x * b.y - a.y * b.x;\r
}\r
\r
fn wrap_pi(angle: f32) -> f32 {\r
  return atan2(sin(angle), cos(angle));\r
}\r
\r
fn triangle_signed_area(a: vec2f, b: vec2f, c: vec2f) -> f32 {\r
  return cross2(b - a, c - a);\r
}\r
\r
fn point_in_triangle(p: vec2f, a: vec2f, b: vec2f, c: vec2f) -> bool {\r
  let area = triangle_signed_area(a, b, c);\r
  if (abs(area) <= EPSILON) {\r
    return false;\r
  }\r
  let inv_area = 1.0 / area;\r
  let u = cross2(b - p, c - p) * inv_area;\r
  let v = cross2(c - p, a - p) * inv_area;\r
  let w = 1.0 - u - v;\r
  return u >= -EPSILON && v >= -EPSILON && w >= -EPSILON;\r
}\r
\r
fn segment_distance(p: vec2f, a: vec2f, b: vec2f) -> f32 {\r
  let e = b - a;\r
  let v = p - a;\r
  let h = clamp(dot(v, e) / max(dot(e, e), EPSILON), 0.0, 1.0);\r
  return length(v - e * h);\r
}\r
\r
fn triangle_edge_distance(p: vec2f, a: vec2f, b: vec2f, c: vec2f) -> f32 {\r
  return min(\r
    segment_distance(p, a, b),\r
    min(segment_distance(p, b, c), segment_distance(p, c, a)),\r
  );\r
}\r
\r
fn angular_interval(p: vec2f, a: vec2f, b: vec2f, c: vec2f) -> Interval {\r
  if (abs(triangle_signed_area(a, b, c)) <= EPSILON) {\r
    return Interval(0.0, 0.0, false);\r
  }\r
  if (point_in_triangle(p, a, b, c)) {\r
    return Interval(0.0, 0.0, false);\r
  }\r
  if (triangle_edge_distance(p, a, b, c) <= cfg.size_steps.w) {\r
    return Interval(0.0, 0.0, false);\r
  }\r
\r
  let center = (a + b + c) / 3.0;\r
  let center_angle = atan2(center.y - p.y, center.x - p.x);\r
  let ra = wrap_pi(atan2(a.y - p.y, a.x - p.x) - center_angle);\r
  let rb = wrap_pi(atan2(b.y - p.y, b.x - p.x) - center_angle);\r
  let rc = wrap_pi(atan2(c.y - p.y, c.x - p.x) - center_angle);\r
  let min_rel = min(ra, min(rb, rc));\r
  let max_rel = max(ra, max(rb, rc));\r
  let length = max_rel - min_rel;\r
  if (!(length > EPSILON) || length >= PI) {\r
    return Interval(0.0, 0.0, false);\r
  }\r
  return Interval(wrap_pi(center_angle + min_rel), length, true);\r
}\r
\r
// Interleaved gradient noise (Jimenez) → [0,1] with blue-noise-like spectrum: spatially\r
// high-frequency, so the per-pixel ray jitter it drives reads as fine grain (not white-noise\r
// clumps) and is removed far better by the half-res→full cubic upsample + the floor dither.\r
fn ign(p: vec2f) -> f32 {\r
  return fract(52.9829189 * fract(dot(p, vec2f(0.06711056, 0.00583715))));\r
}\r
\r
fn load_light_source(sample_pos: vec2f) -> vec4f {\r
  let dims = textureDimensions(light_sources_tex);\r
  let inside =\r
    sample_pos.x >= 0.0 && sample_pos.x < f32(dims.x) &&\r
    sample_pos.y >= 0.0 && sample_pos.y < f32(dims.y);\r
  if (!inside) {\r
    return vec4f(0.0, 0.0, 0.0, 1000.0);\r
  }\r
  let px = clamp(vec2i(floor(sample_pos)), vec2i(0), vec2i(dims) - vec2i(1));\r
  return textureLoad(light_sources_tex, px, 0);\r
}\r
\r
// Per-edge ray/segment invariants that don't change across the ray sweep (they depend only on the\r
// pixel origin and the fixed triangle edge): the edge vector, the origin->edge offset, and their\r
// 2D cross. Precomputed once per pixel and reused for all MAX_RAYS directions.\r
struct EdgePrecomp { e: vec2f, diff: vec2f, cross_diff_e: f32 };\r
\r
fn precompute_edge(origin: vec2f, p: vec2f, q: vec2f) -> EdgePrecomp {\r
  let e = q - p;\r
  let diff = p - origin;\r
  return EdgePrecomp(e, diff, cross2(diff, e));\r
}\r
\r
// Closed-form ray (origin + t*dir, t > minStep) vs segment — dir-dependent part only; returns\r
// t >= 0 at the hit or -1 (miss/parallel). One reciprocal feeds both t and u.\r
fn ray_segment_t(dir: vec2f, pre: EdgePrecomp) -> f32 {\r
  let denom = cross2(dir, pre.e);\r
  if (abs(denom) < EPSILON) { return -1.0; }\r
  let inv = 1.0 / denom;\r
  let t = pre.cross_diff_e * inv;\r
  let u = cross2(pre.diff, dir) * inv;\r
  if (t < cfg.size_steps.z || u < 0.0 || u > 1.0) { return -1.0; }\r
  return t;\r
}\r
\r
// Analytic: the LEDs sit on the triangle edges, and angular_interval already aimed this ray\r
// into the triangle's arc, so the nearest ray<->edge intersection is the first lit edge it\r
// can reach (nearest => the near edge occludes the far edges for free). One sample of the\r
// LED color there replaces the SDF sphere-march — no SDF / .w channel needed at all.\r
fn trace_light_source(origin: vec2f, dir: vec2f, pre_ab: EdgePrecomp, pre_bc: EdgePrecomp, pre_ca: EdgePrecomp) -> TraceHit {\r
  var t = 1e30;\r
  let t0 = ray_segment_t(dir, pre_ab);\r
  let t1 = ray_segment_t(dir, pre_bc);\r
  let t2 = ray_segment_t(dir, pre_ca);\r
  if (t0 >= 0.0) { t = min(t, t0); }\r
  if (t1 >= 0.0) { t = min(t, t1); }\r
  if (t2 >= 0.0) { t = min(t, t2); }\r
  if (t > 1e29) { return TraceHit(vec3f(0.0), 0.0, false); }\r
\r
  let source = load_light_source(origin + dir * t);\r
  let source_active = max(max(source.r, source.g), source.b) > cfg.params.w;\r
  if (source_active) {\r
    return TraceHit(source.rgb, t, true);\r
  }\r
  return TraceHit(vec3f(0.0), 0.0, false);\r
}\r
\r
@fragment fn fs_main(in: VSOut) -> @location(0) vec4f {\r
  let target_scale = max(cfg.target_info.x, 1e-4);\r
  let pixel_sim = in.pos.xy / target_scale;\r
  let a = tri_a();\r
  let b = tri_b();\r
  let c = tri_c();\r
  let interval = angular_interval(pixel_sim, a, b, c);\r
  if (!interval.valid) {\r
    return vec4f(0.0, 0.0, 0.0, 1.0);\r
  }\r
\r
  let jitter = (ign(in.pos.xy) - 0.5) * JITTER_AMPLITUDE;\r
  // The ray angle is exactly linear in i: angle = interval.start + interval.length * t with\r
  // t = (i + 0.5 + jitter) / MAX_RAYS. The closed-form clamp never triggers because jitter ∈\r
  // [-0.35, 0.35] (JITTER_AMPLITUDE 0.7) keeps t strictly inside (0, 1) for every i. So sweep\r
  // the direction by rotating it one fixed angular step per ray — 2 trig calls per pixel\r
  // instead of 2 per ray (MAX_RAYS=24). The hit point (origin + dir*t) is invariant to any\r
  // tiny magnitude drift since the ray/segment t absorbs it; only the angle matters, and that\r
  // accumulates only ~MAX_RAYS ULP over the sweep.\r
  let inv_rays = 1.0 / f32(MAX_RAYS);\r
  let step_angle = interval.length * inv_rays;\r
  let start_angle = interval.start + interval.length * (0.5 + jitter) * inv_rays;\r
  let step_c = cos(step_angle);\r
  let step_s = sin(step_angle);\r
  var dir = vec2f(cos(start_angle), sin(start_angle));\r
  // Hoist the per-edge ray/segment invariants out of the ray loop (origin + edges are fixed).\r
  let pre_ab = precompute_edge(pixel_sim, a, b);\r
  let pre_bc = precompute_edge(pixel_sim, b, c);\r
  let pre_ca = precompute_edge(pixel_sim, c, a);\r
  var sum = vec3f(0.0);\r
  for (var i = 0u; i < MAX_RAYS; i = i + 1u) {\r
    let hit = trace_light_source(pixel_sim, dir, pre_ab, pre_bc, pre_ca);\r
    if (hit.hit) {\r
      // Geometric spreading on distance NORMALIZED to the scene size (target_info.y =\r
      // ref_height / sim_height) so the radiance is resolution-independent — raw sim-px\r
      // distance made shorter render targets read brighter/whiter. Beer-Lambert absorption\r
      // (params.x already per-sim-height) eats far light through the smoke/atmosphere.\r
      let falloff_dist = hit.distance * cfg.target_info.y;\r
      let distance_weight =\r
        pow(max(falloff_dist, 1.0), -cfg.params.y) * exp(-cfg.params.x * hit.distance);\r
      sum += hit.rgb * distance_weight;\r
    }\r
    // Rotate the direction by one angular step for the next ray.\r
    dir = vec2f(dir.x * step_c - dir.y * step_s, dir.x * step_s + dir.y * step_c);\r
  }\r
\r
  // Match the cascade path's directional average semantics: angular sample mean,\r
  // independent of ray count. \`params.z\` remains the visual calibration knob.\r
  let radiance = (sum / f32(MAX_RAYS)) * cfg.params.z;\r
  return vec4f(radiance, 1.0);\r
}\r
`, functionExports: [] }, Ip = { version: 1, wgsl: `// vgsl-module: C:\\Users\\sarge\\Documents\\GitHub\\portfolio\\HTML\\hero-vgpu\\src\\triangle-led-front\\shaders\\floor-noise.wgsl
struct _vgsl_743ec7b9__VSOut { @builtin(position) pos: vec4f };\r
\r
@vertex fn vs_main(@builtin(vertex_index) vi: u32) -> _vgsl_743ec7b9__VSOut {\r
  var p = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));\r
  var out: _vgsl_743ec7b9__VSOut;\r
  out.pos = vec4f(p[vi], 0.0, 1.0);\r
  return out;\r
}\r
\r
\r
@fragment fn fs_main(in: _vgsl_743ec7b9__VSOut) -> @location(0) vec4f {\r
  let p = floor(in.pos.xy);\r
  var floor_noise = _vgsl_ac285862__hash21(p) + _vgsl_ac285862__hash21(floor(p * 2.12)) + _vgsl_ac285862__hash21(floor(p * 3.15));\r
  floor_noise *= 0.3;\r
  floor_noise = clamp(floor_noise, 0.0, 1.0);\r
  return vec4f(vec3f(floor_noise), 1.0);\r
}

// vgsl-module: C:\\Users\\sarge\\Documents\\GitHub\\portfolio\\HTML\\hero-vgpu\\src\\triangle-led-front\\shaders\\hash.wgsl
fn _vgsl_ac285862__hash21(p: vec2f) -> f32 {\r
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123);\r
}
`, functionExports: [{ name: "hash21", resolvedName: "_vgsl_ac285862__hash21", parameterNames: ["p"] }] }, $p = { version: 1, wgsl: `// vgsl-module: C:\\Users\\sarge\\Documents\\GitHub\\portfolio\\HTML\\hero-vgpu\\src\\triangle-led-front\\shaders\\themes\\dark\\main-scene-floor.wgsl
// Dark theme floor material: builds the scene from radiance, direct LED emitters, and floor\r
// noise, then tonemaps + applies display contrast inline so it renders straight to the canvas\r
// (no separate composite pass in dark mode).\r
        \r
     \r
      \r
\r
struct _vgsl_c3fc4d08__Config { screen: vec4f, light_sources: vec4f, triangle: vec4f, radiance_fit: vec4f, sim_transform: vec4f };\r
@group(0) @binding(0) var<uniform> cfg: _vgsl_c3fc4d08__Config;\r
@group(0) @binding(1) var radiance_tex: texture_2d<f32>;\r
@group(0) @binding(2) var light_sources_tex: texture_2d<f32>;\r
@group(0) @binding(4) var floor_noise_tex: texture_2d<f32>;\r
\r
struct _vgsl_c3fc4d08__VSOut { @builtin(position) pos: vec4f };\r
const _vgsl_c3fc4d08__FLOOR_NOISE_SIZE: i32 = 500;\r
\r
@vertex fn vs_main(@builtin(vertex_index) vi: u32) -> _vgsl_c3fc4d08__VSOut {\r
  var p = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));\r
  var out: _vgsl_c3fc4d08__VSOut;\r
  out.pos = vec4f(p[vi], 0.0, 1.0);\r
  return out;\r
}\r
\r
fn _vgsl_c3fc4d08__wrapNoiseCoord(v: i32) -> i32 {\r
  return ((v % _vgsl_c3fc4d08__FLOOR_NOISE_SIZE) + _vgsl_c3fc4d08__FLOOR_NOISE_SIZE) % _vgsl_c3fc4d08__FLOOR_NOISE_SIZE;\r
}\r
\r
// Grain density in texels per CSS pixel. Anchoring to CSS px (not the device-pixel backing\r
// store) keeps the grain the SAME visual size at any DPR. 2 ≈ the DPR-2/retina look, so\r
// DPR-2 is unchanged and DPR-1 (which used to read 1 texel/CSS px → coarse) is brought in line.\r
const _vgsl_c3fc4d08__FLOOR_NOISE_DENSITY: f32 = 2.0;\r
\r
// At DPR 1 the tiling floor grain reads as a coarse, visibly-repeating PATTERN, so scale its\r
// intensity down to this fraction there; DPR>1 (retina) keeps the full grain (1.0). cfg.screen.w = DPR.\r
const _vgsl_c3fc4d08__DARK_FLOOR_GRAIN_DPR1_SCALE: f32 = 0.5;\r
\r
// Reads the tiling floor noise (r channel, [0,1]) at a DPR-independent position. \`p\` is in\r
// device px; cfg.screen.w is the real device pixel ratio (DPR), so p / dpr is CSS px → the\r
// grain no longer scales with the backing-store resolution. (DPR — not sim_transform.z,\r
// which is the sim→device fit scale and only equals DPR when the sim isn't floored.)\r
fn _vgsl_c3fc4d08__sample_floor_noise(p: vec2f) -> f32 {\r
  let css_px = p / max(cfg.screen.w, 1e-4);\r
  let noise_px = vec2i(floor(css_px * _vgsl_c3fc4d08__FLOOR_NOISE_DENSITY));\r
  let noise_uv = vec2i(_vgsl_c3fc4d08__wrapNoiseCoord(noise_px.x), _vgsl_c3fc4d08__wrapNoiseCoord(noise_px.y));\r
  return textureLoad(floor_noise_tex, noise_uv, 0).r;\r
}\r
\r
// Cheap per-pixel hash (Dave Hoskins, hash12) → [0,1]; picks the jitter angle.\r
fn _vgsl_c3fc4d08__hash12(p: vec2f) -> f32 {\r
  var p3 = fract(vec3f(p.xyx) * 0.1031);\r
  p3 += dot(p3, p3.yzx + 33.33);\r
  return fract((p3.x + p3.y) * p3.z);\r
}\r
\r
// Sibling of hash12 with a different seed multiplier — same character, independent\r
// values. Used for the radiance multisample blend weight so it is decorrelated from\r
// both the jitter angle (hash12) and the floor-brightness grain (sample_floor_noise).\r
fn _vgsl_c3fc4d08__hash12b(p: vec2f) -> f32 {\r
  var p3 = fract(vec3f(p.xyx) * 0.1531);\r
  p3 += dot(p3, p3.yzx + 33.33);\r
  return fract((p3.x + p3.y) * p3.z);\r
}\r
\r
fn _vgsl_c3fc4d08__bg(p: vec2f) -> vec3f {\r
  let floor_noise = _vgsl_c3fc4d08__sample_floor_noise(p);\r
  // Lower the grain intensity at DPR 1 (where its tiling repeat is a visible pattern); full at DPR>1.\r
  let grain_intensity = select(1.0, _vgsl_c3fc4d08__DARK_FLOOR_GRAIN_DPR1_SCALE, cfg.screen.w < 1.5);\r
  let floor_brightness =\r
    mix(1.0, 0.5, floor_noise * grain_intensity);\r
  // Return the floor base in RGB (gray). The oklab perceptual lift now happens only where an\r
  // LED color actually blends in (surface > 0, see fs_main), so floor pixels skip rgb<->oklab.\r
  return vec3f(floor_brightness);\r
}\r
\r
const _vgsl_c3fc4d08__LUMA = vec3f(0.2126, 0.7152, 0.0722);\r
\r
struct _vgsl_c3fc4d08__TriangleCorners { top: vec2f, left: vec2f, right: vec2f };\r
\r
fn _vgsl_c3fc4d08__triangle_corners() -> _vgsl_c3fc4d08__TriangleCorners {\r
  let top = vec2f(cfg.triangle.x, cfg.triangle.y - cfg.triangle.z);\r
  let left = vec2f(cfg.triangle.x - cfg.triangle.w, cfg.triangle.y + cfg.triangle.z * 0.5);\r
  let right = vec2f(cfg.triangle.x + cfg.triangle.w, cfg.triangle.y + cfg.triangle.z * 0.5);\r
  return _vgsl_c3fc4d08__TriangleCorners(top, left, right);\r
}\r
\r
// Reads the LED emitter texture in simulation space, blanking samples that\r
// fall outside the simulation rect.\r
fn _vgsl_c3fc4d08__sample_light_sources(pixel_screen: vec2f) -> vec4f {\r
  let sim_px = (pixel_screen - cfg.sim_transform.xy) / cfg.sim_transform.z;\r
  let px = clamp(vec2i(floor(sim_px)), vec2i(0), vec2i(cfg.light_sources.xy) - vec2i(1));\r
  let inside_sim =\r
    sim_px.x >= 0.0 && sim_px.x < cfg.light_sources.x &&\r
    sim_px.y >= 0.0 && sim_px.y < cfg.light_sources.y;\r
  var light_sources = textureLoad(light_sources_tex, px, 0);\r
  if (!inside_sim) {\r
    light_sources = vec4f(0.0, 0.0, 0.0, 1.0);\r
  }\r
  return light_sources;\r
}\r
\r
// Mitchell-Netravali / BC-spline cubic weight. (B, C) selects the filter and trades\r
// sharpness for smoothing — the lever for the visible half-res jitter texture:\r
//   B=0,   C=0.5  → Catmull-Rom    (sharp, negative lobes; the previous kernel — preserves noise)\r
//   B=1/3, C=1/3  → Mitchell       (balanced low-pass; softens the jitter grain, default)\r
//   B=1,   C=0    → cubic B-spline (max smoothing/blur, softest)\r
const _vgsl_c3fc4d08__UPSAMPLE_B: f32 = 1;\r
const _vgsl_c3fc4d08__UPSAMPLE_C: f32 = 0.;\r
\r
fn _vgsl_c3fc4d08__bc_spline_weight(x: f32) -> f32 {\r
  let ax = abs(x);\r
  let b = _vgsl_c3fc4d08__UPSAMPLE_B;\r
  let c = _vgsl_c3fc4d08__UPSAMPLE_C;\r
  if (ax < 1.0) {\r
    return ((12.0 - 9.0 * b - 6.0 * c) * ax * ax * ax\r
      + (-18.0 + 12.0 * b + 6.0 * c) * ax * ax\r
      + (6.0 - 2.0 * b)) / 6.0;\r
  }\r
  if (ax < 2.0) {\r
    return ((-b - 6.0 * c) * ax * ax * ax\r
      + (6.0 * b + 30.0 * c) * ax * ax\r
      + (-12.0 * b - 48.0 * c) * ax\r
      + (8.0 * b + 24.0 * c)) / 6.0;\r
  }\r
  return 0.0;\r
}\r
\r
// BC-spline (Mitchell-Netravali) 4x4 sampling for the half-resolution direct radiance\r
// target. Taps are clamped in texel space so edge pixels do not smear wrapped values.\r
fn _vgsl_c3fc4d08__sample_radiance_cubic(uv: vec2f) -> vec3f {\r
  let dims_u = textureDimensions(radiance_tex);\r
  let dims = vec2f(dims_u);\r
  let texel = clamp(uv, vec2f(0.0), vec2f(1.0)) * dims - vec2f(0.5);\r
  let base = floor(texel);\r
  let f = texel - base;\r
  var sum = vec3f(0.0);\r
  var weight_sum = 0.0;\r
  for (var y: i32 = -1; y <= 2; y = y + 1) {\r
    let wy = _vgsl_c3fc4d08__bc_spline_weight(f.y - f32(y));\r
    for (var x: i32 = -1; x <= 2; x = x + 1) {\r
      let wx = _vgsl_c3fc4d08__bc_spline_weight(f.x - f32(x));\r
      let w = wx * wy;\r
      let tap = clamp(vec2i(base) + vec2i(x, y), vec2i(0), vec2i(dims_u) - vec2i(1));\r
      sum += textureLoad(radiance_tex, tap, 0).rgb * w;\r
      weight_sum += w;\r
    }\r
  }\r
  return max(sum / max(weight_sum, 1e-5), vec3f(0.0));\r
}\r
\r
// Samples the fitted radiance texture, blanking samples outside the fit rect.\r
fn _vgsl_c3fc4d08__sample_radiance_at(pixel_screen: vec2f) -> vec3f {\r
  let fitted_uv = (pixel_screen - cfg.radiance_fit.xy) / cfg.radiance_fit.zw;\r
  let inside_fit =\r
    fitted_uv.x >= 0.0 && fitted_uv.x <= 1.0 &&\r
    fitted_uv.y >= 0.0 && fitted_uv.y <= 1.0;\r
  var radiance = _vgsl_c3fc4d08__sample_radiance_cubic(fitted_uv);\r
  if (!inside_fit) {\r
    radiance = vec3f(0.0);\r
  }\r
  return radiance;\r
}\r
\r
// Noise-driven jittered multisample of the radiance, to dither away the blocky\r
// artifacts of the half-resolution radiance target. The jitter\r
// distance grows where the light is dim — bright lit areas stay sharp while the\r
// faint falloff regions (where the artifacts show) get a wider offset — and a\r
// hash noise (hash12b) sets the blend weight of the offset sample, decorrelated from\r
// the floor-brightness grain. A second sample is pulled from a hashed random\r
// direction.\r
fn _vgsl_c3fc4d08__sample_radiance(pixel_screen: vec2f, triangle_sdf: f32) -> vec3f {\r
  let base = _vgsl_c3fc4d08__sample_radiance_at(pixel_screen);\r
  // Bigger offset the dimmer the light: intensity 0 → 1, intensity >= 0.5 → 0.\r
  let light_intensity = dot(base, _vgsl_c3fc4d08__LUMA);\r
  var offset_scale = _vgsl_01d158fb__value_remap_clamp(light_intensity, 0.2, 0.1, 0.0, 1.0);\r
  // Keep the sharp light line at the triangle edge crisp: kill the offset right at\r
  // the edge (sdf 0) and ramp it quickly to full over a thin band just outside.\r
  offset_scale *= _vgsl_01d158fb__value_remap_clamp(triangle_sdf, 0.0, cfg.triangle.z * 0.9, 0.0, 1.0);\r
\r
  // Bright pixels (light_intensity >= 0.2) and the triangle edge clamp offset_scale to exactly\r
  // 0, so the offset is zero and the jittered sample would read the same texel as \`base\`\r
  // (mix(base, base, noise) == base to within a ULP). Skip the second 16-tap cubic fetch there\r
  // — that's the whole bright glow region of this full-canvas pass.\r
  if (offset_scale <= 0.0) {\r
    return base;\r
  }\r
\r
  let noise = _vgsl_c3fc4d08__hash12b(pixel_screen);\r
  let angle = _vgsl_c3fc4d08__hash12(pixel_screen) * 6.2831853;\r
  let dir = vec2f(cos(angle), sin(angle));\r
  // sim_transform.w normalizes the fixed screen-px offset to a constant FRACTION of\r
  // the on-screen scene height (presentation height / desktop-cap reference, clamped <= 1).\r
  // A fixed px offset is a larger fraction of a short canvas, over-blending spatially-separated\r
  // (different-hued) radiance → desaturation; this scales it down proportionally. 1 at the\r
  // desktop cap, so that render is byte-identical.\r
  let offset = dir * offset_scale * 16.0 * cfg.sim_transform.w;\r
  let jittered = _vgsl_c3fc4d08__sample_radiance_at(pixel_screen + offset);\r
  return mix(base, jittered, noise);\r
}\r
\r
// Combines the floor base colour with radiance, the LED surface, vibrancy\r
// saturation, and the falloff envelope into the final linear-HDR colour.\r
fn _vgsl_c3fc4d08__compose_floor(\r
  base_colour: vec3f,\r
  radiance: vec3f,\r
  light_sources: vec4f,\r
  surface: f32,\r
  brightness_factor: f32,\r
) -> vec3f {\r
  var colour = max(base_colour, vec3f(0.0));\r
  colour *= radiance;\r
  colour = mix(colour, light_sources.rgb, surface);\r
  let sat = 1.0 + (2.0 - 1.0) * brightness_factor;\r
  let luma = dot(colour, _vgsl_c3fc4d08__LUMA);\r
  colour = max(mix(vec3f(luma), colour, sat), vec3f(0.0));\r
  colour *= brightness_factor;\r
  return colour;\r
}\r
\r
// On the mobile layout the canvas is a SQUARE (≈1:1) rather than the desktop 3:2 rect, and the\r
// top/bottom fade band reads as too small there — so widen it by this factor on mobile. Mobile is\r
// detected from the canvas aspect (width < ~1.25 × height ⇒ the square mobile box), so no extra\r
// uniform is needed. Tune this for the mobile fade size.\r
const _vgsl_c3fc4d08__DARK_EDGE_FADE_MOBILE_BOOST: f32 = 2.0;\r
\r
// VERTICAL-ONLY screen-edge envelope: 1 across the interior, easing to 0 only near the TOP and\r
// BOTTOM edges — never left/right (the glow should never fade on the X axis). A square-root curve\r
// lifts gently from black before arriving at full intensity. The band is 20% of canvas height,\r
// widened on the square mobile canvas by DARK_EDGE_FADE_MOBILE_BOOST.\r
fn _vgsl_c3fc4d08__edge_fade(pixel_screen: vec2f) -> f32 {\r
  let mobile_boost =\r
    select(1.0, _vgsl_c3fc4d08__DARK_EDGE_FADE_MOBILE_BOOST, cfg.screen.x < cfg.screen.y * 1.25);\r
  let w = max(0.2 * mobile_boost * cfg.screen.y, 1.0);\r
  let d = min(pixel_screen.y, cfg.screen.y - pixel_screen.y);\r
  let t = clamp(d / w, 0.0, 1.0);\r
  return sqrt(t);\r
}\r
\r
// Pixels deep inside the occluder triangle are painted pure black by the occluder (and the edge\r
// fade can only darken further), so the whole floor body there — incl. the 16-tap radiance\r
// fetch — is wasted. This margin keeps the ~1px anti-aliased silhouette on the full path.\r
const _vgsl_c3fc4d08__OCCLUDER_INTERIOR_MARGIN: f32 = 4.0;\r
\r
@fragment fn fs_main(in: _vgsl_c3fc4d08__VSOut) -> @location(0) vec4f {\r
  let pixel_screen = in.pos.xy;\r
  let uv = pixel_screen / cfg.screen.xy;\r
  let pixel = uv * cfg.screen.xy - cfg.screen.xy * 0.5;\r
  let tri = _vgsl_c3fc4d08__triangle_corners();\r
  let triangle_sdf = _vgsl_b817a062__sdf_triangle_vertices(pixel_screen, tri.top, tri.left, tri.right);\r
  // The SDF screen-space gradient is a derivative: it must run in uniform control flow, so compute\r
  // the occluder edge width here (before the per-pixel early-out below) and reuse it for the\r
  // silhouette later. length(dpdx, dpdy) is the true gradient magnitude; fwidth's Manhattan sum\r
  // |dpdx|+|dpdy| overestimates it by up to sqrt(2) on diagonal edges, over-blurring them.\r
  let occluder_edge = max(length(vec2f(dpdx(triangle_sdf), dpdy(triangle_sdf))), 1e-4);\r
  // Early-out to the exact interior value when the occluder is on and we are not in radiance-debug.\r
  // Uniform-gated, so wavefronts deep inside the triangle skip the body coherently.\r
  if (triangle_sdf < -_vgsl_c3fc4d08__OCCLUDER_INTERIOR_MARGIN) {\r
    return vec4f(0.0, 0.0, 0.0, 1.0);\r
  }\r
  let light_sources = _vgsl_c3fc4d08__sample_light_sources(pixel_screen);\r
  let radiance = _vgsl_c3fc4d08__sample_radiance(pixel_screen, triangle_sdf);\r
\r
  // LED surface mask, derived from the emitter color itself (light_sources.rgb) instead of\r
  // the baked SDF (.w): 1 exactly where an LED is lit, 0 in the gaps / floor. It can't\r
  // disagree with the rgb the way the .w mask did (that mismatch — .w extending past the\r
  // rgb's triangle clip — was the black band), and it keeps the discrete LEDs. The\r
  // geometric occluder (drawn below) hides the inside, so only the edge strip shows.\r
  let surface = smoothstep(\r
    4.0,\r
    4.02,\r
    max(max(light_sources.r, light_sources.g), light_sources.b),\r
  );\r
  // Floor base in RGB; blend toward the LED color (in cbrt-LMS space) only where an LED is\r
  // present (surface > 0). Floor pixels skip both rgb_to_oklab calls + the oklab_to_rgb round-trip.\r
  let floor_rgb = _vgsl_c3fc4d08__bg(pixel);\r
  var base_rgb = floor_rgb;\r
  if (surface > 0.0) {\r
    base_rgb = _vgsl_01d158fb__oklab_to_rgb(mix(_vgsl_01d158fb__col3v(floor_rgb), _vgsl_01d158fb__col3v(light_sources.rgb), surface));\r
  }\r
\r
  // Two glow layers, brightest first. See the *_falloff helpers. Screen-blend\r
  // the in-range [0,1] parts (preserves the tuned look), then add any over-1\r
  // overflow additively. A plain screen blend on HDR layers is non-monotonic:\r
  // once two layers exceed 1, their (1 - x) terms both go negative, the product\r
  // flips positive, and brightness_factor collapses through 0 to negative — which\r
  // tonemaps to black. Splitting off the overflow keeps it monotonic so high\r
  // intensities keep getting brighter and the tonemap saturates them to white.\r
  let fade_inner = 0.0;\r
  let near_light = dot(radiance, _vgsl_c3fc4d08__LUMA);\r
  let near = _vgsl_9037dbc1__near_falloff(\r
    triangle_sdf,\r
    near_light,\r
    fade_inner,\r
    cfg.triangle.z,\r
    vec4f(0.046, 1.2, 2.74, 5.0),\r
    4.0,\r
    1.0,\r
  );\r
  let far = _vgsl_9037dbc1__far_falloff(\r
    near_light,\r
    vec4f(0.65, 2.0, 0.0, 8.85),\r
    0.05,\r
    1.0,\r
  );\r
  let screen_blend =\r
    1.0 - (1.0 - min(near, 1.0)) * (1.0 - min(far, 1.0));\r
  let overflow =\r
    max(near - 1.0, 0.0) + max(far - 1.0, 0.0);\r
  let brightness_factor = screen_blend + overflow;\r
\r
  var colour = _vgsl_c3fc4d08__compose_floor(\r
    base_rgb,\r
    radiance,\r
    light_sources,\r
    surface,\r
    brightness_factor,\r
  );\r
\r
  // Final output (no composite pass): fixed Lottes tonemap and display contrast.\r
  var final_colour = _vgsl_01d158fb__tonemap(colour * 0.25);\r
  final_colour = (final_colour - vec3f(0.5)) * 1.05 + vec3f(0.5);\r
\r
  // Foreground triangle occluder, drawn analytically from the same SDF instead of as a separate\r
  // hard-edged geometry pass. occluder_edge (the SDF gradient length, hoisted above into uniform\r
  // control flow) gives the screen-space edge width, so the silhouette is anti-aliased to ~1px and stays aligned\r
  // with the edge light line above.\r
  let occluder = clamp(0.5 - triangle_sdf / occluder_edge, 0.0, 1.0);\r
  final_colour = mix(final_colour, vec3f(0.0), occluder);\r
\r
  // Screen-edge fade as a plain multiply by the edge envelope: scales the colour uniformly\r
  // toward black at the screen edges, so it keeps its hue (a scalar multiply preserves the\r
  // channel ratios). No per-channel min (which equalized channels → gray) and no luminance\r
  // division (unstable at low values).\r
  final_colour = final_colour * _vgsl_c3fc4d08__edge_fade(pixel_screen);\r
\r
  return vec4f(final_colour, 1.0);\r
}

// vgsl-module: C:\\Users\\sarge\\Documents\\GitHub\\portfolio\\HTML\\hero-vgpu\\src\\triangle-led-front\\shaders\\color-utils.wgsl
const _vgsl_01d158fb__OK_INV_B = mat3x3<f32>(0.4121656120, 0.2118591070, 0.0883097947, 0.5362752080, 0.6807189584, 0.2818474174, 0.0514575653, 0.1074065790, 0.6302613616);\r
const _vgsl_01d158fb__OK_FWD_B = mat3x3<f32>(4.0767245293, -1.2681437731, -0.0041119885, -3.3072168827, 2.6093323231, -0.7034763098, 0.2307590544, -0.3411344290, 1.7068625689);\r
\r
 fn _vgsl_01d158fb__rgb_to_oklab(c: vec3f) -> vec3f {\r
  let lms = _vgsl_01d158fb__OK_INV_B * c;\r
  return sign(lms) * pow(abs(lms), vec3f(1.0 / 3.0));\r
}\r
\r
 fn _vgsl_01d158fb__oklab_to_rgb(c: vec3f) -> vec3f {\r
  let lms = c * c * c;\r
  return _vgsl_01d158fb__OK_FWD_B * lms;\r
}\r
\r
 fn _vgsl_01d158fb__col3v(v: vec3f) -> vec3f {\r
  return _vgsl_01d158fb__rgb_to_oklab(v);\r
}\r
\r
 fn _vgsl_01d158fb__linear_to_srgb_pow(color: vec3f) -> vec3f {\r
  return pow(color, vec3f(1.0 / 2.2));\r
}\r
\r
\r
fn _vgsl_01d158fb__tonemap_lottes(x: vec3f) -> vec3f {\r
  let a = 1.6;\r
  let d = 0.977;\r
  let hdr_max = 8.0;\r
  let mid_in = 0.18;\r
  let mid_out = 0.267;\r
  let b =\r
    (-pow(mid_in, a) + pow(hdr_max, a) * mid_out)\r
    / ((pow(hdr_max, a * d) - pow(mid_in, a * d)) * mid_out);\r
  let c =\r
    (pow(hdr_max, a * d) * pow(mid_in, a) - pow(hdr_max, a) * pow(mid_in, a * d) * mid_out)\r
    / ((pow(hdr_max, a * d) - pow(mid_in, a * d)) * mid_out);\r
  return pow(x, vec3f(a)) / (pow(x, vec3f(a * d)) * b + c);\r
}\r
\r
 fn _vgsl_01d158fb__tonemap(color: vec3f) -> vec3f {\r
  // Clamp to the finite rgba16float range, not just \`max(_, 0)\`: a bright COLORED LED in dark\r
  // mode (peak channel ~4x a same-luminance white LED) can overflow the half-float light texture\r
  // to +Inf. +Inf would reach the pow-based tonemaps and yield Inf/Inf = NaN, which clamps to 0\r
  // → a black ("burned") pixel. Anything past 65504 already saturates the tonemap to white, so\r
  // this is lossless for finite values and turns the burn back into the intended white.\r
  let c = clamp(color, vec3f(0.0), vec3f(65504.0));\r
  let mapped = _vgsl_01d158fb__tonemap_lottes(c);\r
  return _vgsl_01d158fb__linear_to_srgb_pow(clamp(mapped, vec3f(0.0), vec3f(1.0)));\r
}\r
\r
 fn _vgsl_01d158fb__value_remap(value: f32, minIn: f32, maxIn: f32, minOut: f32, maxOut: f32) -> f32 {\r
  return minOut + (value - minIn) * (maxOut - minOut) / (maxIn - minIn);\r
}\r
\r
 fn _vgsl_01d158fb__value_remap_clamp(value: f32, minIn: f32, maxIn: f32, minOut: f32, maxOut: f32) -> f32 {\r
  let remapped = _vgsl_01d158fb__value_remap(value, minIn, maxIn, minOut, maxOut);\r
  return clamp(remapped, min(minOut, maxOut), max(minOut, maxOut));\r
}

// vgsl-module: C:\\Users\\sarge\\Documents\\GitHub\\portfolio\\HTML\\hero-vgpu\\src\\triangle-led-front\\shaders\\geometry.wgsl
fn _vgsl_b817a062__sdf_segment(p: vec2f, a: vec2f, b: vec2f) -> f32 {\r
  let pa = p - a;\r
  let ba = b - a;\r
  let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);\r
  return length(pa - ba * h);\r
}\r
\r
 fn _vgsl_b817a062__sdf_triangle_vertices(p: vec2f, a: vec2f, b: vec2f, c: vec2f) -> f32 {\r
  let d = min(min(_vgsl_b817a062__sdf_segment(p, a, b), _vgsl_b817a062__sdf_segment(p, b, c)), _vgsl_b817a062__sdf_segment(p, c, a));\r
  let edge0 = b - a;\r
  let edge1 = c - b;\r
  let edge2 = a - c;\r
  let side0 = edge0.x * (p.y - a.y) - edge0.y * (p.x - a.x);\r
  let side1 = edge1.x * (p.y - b.y) - edge1.y * (p.x - b.x);\r
  let side2 = edge2.x * (p.y - c.y) - edge2.y * (p.x - c.x);\r
  let inside = (side0 <= 0.0 && side1 <= 0.0 && side2 <= 0.0) || (side0 >= 0.0 && side1 >= 0.0 && side2 >= 0.0);\r
  return select(d, -d, inside);\r
}

// vgsl-module: C:\\Users\\sarge\\Documents\\GitHub\\portfolio\\HTML\\hero-vgpu\\src\\triangle-led-front\\shaders\\floor-falloff.wgsl
// Smooth value map: input at/below lo reads 0, at/above hi reads 1 (lo > hi inverts).\r
 fn _vgsl_9037dbc1__value_map01(value: f32, lo: f32, hi: f32) -> f32 {\r
  let denom = hi - lo;\r
  let safe_denom = select(denom, 0.001, abs(denom) < 0.0001);\r
  return clamp((value - lo) / safe_denom, 0.0, 1.0);\r
}\r
\r
// CLOSE: remap the light first (so it follows the light shape), then mask with a\r
// thin SDF band hugging the triangle to fake a thin line.\r
//   near = (outer-radius scale, intensity, light-map lo, light-map hi)\r
 fn _vgsl_9037dbc1__near_falloff(\r
  triangle_sdf: f32,\r
  near_light: f32,\r
  fade_inner: f32,\r
  circumradius: f32,\r
  near: vec4f,\r
  band_power: f32,\r
  enabled: f32,\r
) -> f32 {\r
  let mapped = _vgsl_9037dbc1__value_map01(near_light, near.z, near.w);\r
  let near_outer = max(circumradius * near.x, fade_inner + 0.001);\r
  let near_fade = _vgsl_01d158fb__value_remap_clamp(triangle_sdf, near_outer, fade_inner, 0.0, 1.0);\r
  let band = pow(near_fade, max(band_power, 0.001));\r
  return mapped * band * near.y * enabled;\r
}\r
\r
// FAR: pure light fade (no SDF). Remap radiance luminance, shape with the tail\r
// power, scale by intensity.\r
//   glow = (intensity, _, light-map lo, light-map hi)\r
 fn _vgsl_9037dbc1__far_falloff(\r
  near_light: f32,\r
  glow: vec4f,\r
  power: f32,\r
  enabled: f32,\r
) -> f32 {\r
  let mapped = _vgsl_9037dbc1__value_map01(near_light, glow.z, glow.w);\r
  let shaped = pow(mapped, max(power, 0.001));\r
  return shaped * glow.x * enabled;\r
}
`, functionExports: [{ name: "rgb_to_oklab", resolvedName: "_vgsl_01d158fb__rgb_to_oklab", parameterNames: ["c"] }, { name: "oklab_to_rgb", resolvedName: "_vgsl_01d158fb__oklab_to_rgb", parameterNames: ["c"] }, { name: "col3v", resolvedName: "_vgsl_01d158fb__col3v", parameterNames: ["v"] }, { name: "linear_to_srgb_pow", resolvedName: "_vgsl_01d158fb__linear_to_srgb_pow", parameterNames: ["color"] }, { name: "tonemap", resolvedName: "_vgsl_01d158fb__tonemap", parameterNames: ["color"] }, { name: "value_remap", resolvedName: "_vgsl_01d158fb__value_remap", parameterNames: ["value", "minIn", "maxIn", "minOut", "maxOut"] }, { name: "value_remap_clamp", resolvedName: "_vgsl_01d158fb__value_remap_clamp", parameterNames: ["value", "minIn", "maxIn", "minOut", "maxOut"] }, { name: "sdf_triangle_vertices", resolvedName: "_vgsl_b817a062__sdf_triangle_vertices", parameterNames: ["p", "a", "b", "c"] }, { name: "value_map01", resolvedName: "_vgsl_9037dbc1__value_map01", parameterNames: ["value", "lo", "hi"] }, { name: "near_falloff", resolvedName: "_vgsl_9037dbc1__near_falloff", parameterNames: ["triangle_sdf", "near_light", "fade_inner", "circumradius", "near", "band_power", "enabled"] }, { name: "far_falloff", resolvedName: "_vgsl_9037dbc1__far_falloff", parameterNames: ["near_light", "glow", "power", "enabled"] }] }, Sr = 0.5, Cp = 1.5, Tp = 0.75, Lp = 2, Fp = 1, kp = 50, Dp = 1e-3;
function Mp(t, e) {
  const n = hp(), r = {}, i = {};
  let s = !1, o = e.target, a = !1;
  const c = gr(t, {
    size: [500, 500],
    format: "rgba16float",
    label: "triangle-led-front-floor-noise"
  }), l = xn(t, { shader: Ip, vertices: 3 }), u = xn(t, { shader: $p, vertices: 3 }), d = xn(t, { shader: Ap, vertices: 3 });
  eh(t, (b) => {
    b.pass({ target: c }, (_) => _.draw(l));
  });
  let f = g(e.css);
  return o && h(f, o), {
    hero: r,
    renderFrame(b, { time: _ }) {
      if (a || !o) return;
      const y = f, { tunables: E } = n.resolveFrame({
        patch: i,
        hero: r,
        hoverRgbDeployActive: s,
        time: _,
        updateLedsFor($) {
          ep(
            y.leds,
            $.time,
            $.tunables,
            $.settings,
            $.hoverDeploy,
            $.brush
          ), y.ledStorage.write(y.leds.data.buffer);
        }
      });
      y.lightSources.encode({ frame: b, tunables: E }), b.pass(
        { target: y.raycastTarget, clear: [0, 0, 0, 1] },
        ($) => $.bundles(y.raycastBundle)
      );
      const L = y.floorBundle ?? h(y, o);
      b.pass(
        { target: o, clear: [0, 0, 0, 1] },
        ($) => $.bundles(L)
      );
    },
    setOutputTarget(b) {
      o = b, h(f, b);
    },
    rebuild(b) {
      if (a) return;
      const _ = g(b, f.leds);
      w(f), f = _, o && h(f, o);
    },
    setBrush(b) {
      Object.assign(i, b);
    },
    setHero(b) {
      Object.assign(r, b);
    },
    setRgbDeployActive(b) {
      s = b;
    },
    async prewarm() {
      o && await Promise.all([
        u.compile({ colors: [o.format] }),
        d.compile(f.raycastTarget),
        l.compile(c),
        f.lightSources.ready
      ]);
    },
    destroy() {
      a || (a = !0, w(f));
    }
  };
  function h(b, _) {
    u.set({
      cfg: Rp(b),
      radiance_tex: b.raycastTarget,
      light_sources_tex: b.lightSources.texture,
      floor_noise_tex: c
    });
    const y = dr(
      t,
      { target: { colors: [_.format] }, label: "triangle-led-front-dark-floor" },
      (E) => E.draw(u)
    );
    return b.floorBundle = y, y;
  }
  function g(b, _) {
    Th(Lh(1, b.height, !1));
    const y = vp(b.width, b.height, b.dpr), E = cs(y.simulationWidth, y.simulationHeight), L = cs(b.width * b.dpr, b.height * b.dpr), $ = Np(y.pixelRatio), F = Qh(E, _), k = gh(t, 72 * 8 * 4);
    k.write(F.data.buffer);
    const m = Qo(E), v = gr(t, {
      size: [m.width, m.height],
      format: "rgba16float",
      label: "triangle-led-front-direct-triangle-raycast"
    }), C = gp(t, {
      size: [E.width, E.height],
      ledStorage: k,
      triangle: $e(E)
    });
    d.set({
      cfg: Pp(E),
      light_sources_tex: C.texture
    });
    const A = dr(
      t,
      { target: v, label: "triangle-led-front-raycast" },
      (R) => R.draw(d)
    );
    return {
      simulationSize: E,
      presentationSize: L,
      pixelRatio: $,
      leds: F,
      ledStorage: k,
      lightSources: C,
      raycastTarget: v,
      raycastBundle: A
    };
  }
  function w(b) {
    var y, E, L, $, F;
    b.lightSources.destroy(), (E = (y = b.ledStorage).destroy) == null || E.call(y), (L = b.ledStorage.buffer) == null || L.destroy();
    const _ = (($ = b.raycastTarget.color) == null ? void 0 : $.gpu) ?? b.raycastTarget.gpu;
    (F = _ == null ? void 0 : _.destroy) == null || F.call(_);
  }
}
function Pp(t) {
  const e = Qo(t), n = Mh(t), r = Math.min(t.height, Nt) / Nt;
  return {
    tri_a_b: [n.top.x, n.top.y, n.left.x, n.left.y],
    tri_c_target: [n.right.x, n.right.y, e.width, e.height],
    size_steps: [
      t.width,
      t.height,
      Cp * r,
      Tp * r
    ],
    params: [
      Lp / t.height,
      Fp,
      kp,
      Dp
    ],
    target_info: [
      Sr,
      Nt / Math.max(t.height, 1),
      0,
      0
    ]
  };
}
function Qo(t) {
  return {
    width: Math.max(1, Math.ceil(t.width * Sr)),
    height: Math.max(1, Math.ceil(t.height * Sr))
  };
}
function Rp(t) {
  const { simulationSize: e, presentationSize: n, pixelRatio: r } = t, i = Op(e, n), s = Gp(e, i), o = Nt * Math.max(r, 1e-4), a = Math.min(n.height, o) / o;
  return {
    screen: [n.width, n.height, 0, r],
    light_sources: [e.width, e.height, 0, 0],
    triangle: [
      s.centerX,
      s.centerY,
      s.circumradiusY,
      s.halfSideX
    ],
    radiance_fit: [
      i.originX,
      i.originY,
      e.width * i.scale,
      e.height * i.scale
    ],
    sim_transform: [
      i.originX,
      i.originY,
      i.scale,
      a
    ]
  };
}
function Op(t, e) {
  const n = Math.max(
    1e-3,
    e.height / Math.max(1, t.height)
  );
  return {
    originX: (e.width - t.width * n) * 0.5,
    originY: (e.height - t.height * n) * 0.5,
    scale: n
  };
}
function Gp(t, e) {
  const n = $e(t);
  return {
    centerX: e.originX + n.center.x * e.scale,
    centerY: e.originY + n.center.y * e.scale,
    circumradiusY: n.circumradius * e.scale,
    halfSideX: n.sideLength * 0.5 * e.scale
  };
}
function cs(t, e) {
  return {
    width: Math.max(1, Math.floor(t)),
    height: Math.max(1, Math.floor(e))
  };
}
function Np(t) {
  return Math.max(
    1e-3,
    typeof t == "number" && Number.isFinite(t) ? t : 1
  );
}
const ls = { mode: -1 };
function Er(t) {
  return t === -1 || t === 0 || t === 1 || t === 2;
}
function Up(t) {
  var C;
  let e = !1, n, r, i, s, o, a, c, l, u = 0, d = 0, f, h = typeof window > "u" ? 1 : window.devicePixelRatio;
  const g = ((C = t.initialControls) == null ? void 0 : C.mode) ?? ls.mode;
  let w = Er(g) ? g : ls.mode;
  const b = { mode: w }, _ = (A) => {
    throw k(), A;
  }, y = () => {
    u = 0;
    const A = f;
    if (f = void 0, e || !A || !i || !r) return;
    const R = ++d;
    try {
      i.rebuild({ width: A.width, height: A.height, dpr: r.dpr }), i.setOutputTarget(r), i.prewarm().catch((G) => {
        e || R !== d || _(G);
      });
    } catch (G) {
      if (e || R !== d) return;
      _(G);
    }
  }, E = (A) => {
    e || A.width <= 0 || A.height <= 0 || (f = A, u || (u = requestAnimationFrame(y)));
  }, L = () => {
    const A = t.canvas.getBoundingClientRect();
    E({ width: A.width, height: A.height });
  }, $ = () => {
    window.devicePixelRatio !== h && (h = window.devicePixelRatio, L());
  }, F = (A) => {
    e || !Er(A.mode) || A.mode === w || (w = A.mode, b.mode = w, o == null || o(), i == null || i.setHero(as(w)));
  }, k = () => {
    e || (e = !0, d++, a == null || a.stop(), a = void 0, u && cancelAnimationFrame(u), u = 0, f = void 0, c == null || c.disconnect(), c = void 0, typeof window < "u" && window.removeEventListener("resize", $), l == null || l.dispose(), l = void 0, s == null || s.destroy(), s = void 0, o = void 0, i == null || i.destroy(), i = void 0, r == null || r.dispose(), r = void 0, n == null || n.dispose(), n = void 0);
  };
  return { ready: (async () => {
    const { init: A } = await import("./index-t18eLcQV.js");
    if (e) return;
    const R = await A();
    if (e) {
      R.dispose();
      return;
    }
    n = R, r = Ud(n, t.canvas, { dpr: [1, 2] });
    const G = Mp(n, { css: Bp(t.canvas, r.dpr) });
    if (i = G, G.setOutputTarget(r), G.setHero(as(w)), await G.prewarm(), e) {
      G.destroy();
      return;
    }
    ({ gui: s, refresh: o } = Vp(t.canvas.parentElement, b, F)), l = zp(t.canvas), c = typeof ResizeObserver > "u" ? void 0 : new ResizeObserver(L), c == null || c.observe(t.canvas), window.addEventListener("resize", $), L();
    const P = Zf(n);
    a = th(n, (X) => {
      e || !i || !l || !n || (i.setBrush(l.brush()), i.setRgbDeployActive(l.rgbDeployActive()), i.renderFrame(X, { time: P.time, dt: P.deltaTime }));
    });
  })().catch((A) => {
    e || _(A);
  }), setControls: F, resize: E, dispose: k };
}
function Vp(t, e, n) {
  const r = new Ar({ title: "Triangle LEDs", container: t ?? void 0, width: 180 });
  Object.assign(r.domElement.style, {
    position: "absolute",
    top: "16px",
    right: "16px",
    zIndex: "10"
  });
  const i = r.add(e, "mode", {
    Default: -1,
    "Edge 1": 0,
    "Edge 2": 1,
    "Edge 3": 2
  }).name("Mode").onChange((s) => {
    Er(s) && n({ mode: s });
  });
  return { gui: r, refresh: () => i.updateDisplay() };
}
function Bp(t, e) {
  const n = t.getBoundingClientRect();
  return {
    width: Math.max(1, n.width || t.clientWidth || t.width / e),
    height: Math.max(1, n.height || t.clientHeight || t.height / e),
    dpr: e
  };
}
function zp(t) {
  let e = vr(Ut), n = !1, r;
  const i = t.style.touchAction;
  t.style.touchAction = "none";
  const s = () => {
    e = vr(Ut);
  }, o = (f) => {
    if (!f.isPrimary || r !== void 0 && f.pointerId !== r) return !1;
    const h = t.getBoundingClientRect(), g = Math.max(1, h.width), w = Math.max(1, h.height), b = f.clientX - h.left, _ = f.clientY - h.top;
    return b < 0 || b > g || _ < 0 || _ > w ? (s(), !1) : (e = Sp(Ut, {
      x: b,
      y: _,
      active: !0,
      inside: Wp({ x: b, y: _ }, { width: g, height: w }),
      isMouse: f.pointerType === "mouse"
    }, w), !0);
  }, a = (f) => {
    var h;
    !f.isPrimary || r !== void 0 || (r = f.pointerId, (h = t.setPointerCapture) == null || h.call(t, f.pointerId), o(f));
  }, c = (f) => {
    o(f);
  }, l = (f) => {
    var h;
    !f.isPrimary || r !== void 0 && f.pointerId !== r || (o(f) && (n = !n), (h = t.hasPointerCapture) != null && h.call(t, f.pointerId) && t.releasePointerCapture(f.pointerId), r = void 0);
  }, u = (f) => {
    var h;
    f.pointerId === r && ((h = t.hasPointerCapture) != null && h.call(t, f.pointerId) && t.releasePointerCapture(f.pointerId), r = void 0, s());
  }, d = () => {
    r === void 0 && s();
  };
  return t.addEventListener("pointerdown", a), t.addEventListener("pointermove", c, { passive: !0 }), t.addEventListener("pointerup", l, { passive: !0 }), t.addEventListener("pointercancel", u), t.addEventListener("pointerleave", d), {
    brush: () => e,
    rgbDeployActive: () => n,
    dispose() {
      var f;
      t.removeEventListener("pointerdown", a), t.removeEventListener("pointermove", c), t.removeEventListener("pointerup", l), t.removeEventListener("pointercancel", u), t.removeEventListener("pointerleave", d), r !== void 0 && ((f = t.hasPointerCapture) != null && f.call(t, r)) && t.releasePointerCapture(r), r = void 0, t.style.touchAction = i;
    }
  };
}
function Wp(t, e) {
  const { top: n, left: r, right: i } = $e(e), s = (l, u) => (u.x - l.x) * (t.y - l.y) - (u.y - l.y) * (t.x - l.x), o = s(n, r), a = s(r, i), c = s(i, n);
  return o <= 0 && a <= 0 && c <= 0 || o >= 0 && a >= 0 && c >= 0;
}
function us(t = "[data-hero-vgpu]") {
  const e = document.querySelector(t);
  if (!e) return;
  const n = document.createElement("canvas");
  n.className = "mxd-hero-vgpu__canvas", n.style.cssText = "display:block;width:100%;height:100%;", e.appendChild(n);
  const r = Up({ canvas: n });
  r.ready.catch((i) => {
    console.error("[hero-vgpu] failed to start", i), n.remove();
  }), window.addEventListener("beforeunload", () => r.dispose());
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => us()) : us();
export {
  Nc as G,
  I as V,
  Zf as a,
  dr as b,
  qp as c,
  xn as d,
  th as e,
  eh as f,
  Bc as g,
  Ud as h,
  gh as s,
  gr as t
};

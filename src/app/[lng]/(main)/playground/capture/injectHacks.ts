// @ts-nocheck
HTMLCanvasElement.prototype.getContext = (function (origFn) {
	return function (type, attribs) {
		attribs = attribs || {}
		if (type === 'webgl2') { // google
			attribs.preserveDrawingBuffer = true
		}
		return origFn.call(this, type, attribs)
	}
})(HTMLCanvasElement.prototype.getContext)
export {}

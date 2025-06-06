// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Interfaces
// ----------

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAngle
 */
const createSVGAngle = () => ({
    SVG_ANGLETYPE_UNKNOWN: 0,
    SVG_ANGLETYPE_UNSPECIFIED: 1,
    SVG_ANGLETYPE_DEG: 2,
    SVG_ANGLETYPE_RAD: 3,
    SVG_ANGLETYPE_GRAD: 4,
});

/**
 * @description SVGMatrix is deprecated, we should use DOMMatrix instead
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGMatrix
 */
const createSVGMatrix = () => ({
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    flipX: jest.fn().mockImplementation(createSVGMatrix),
    flipY: jest.fn().mockImplementation(createSVGMatrix),
    inverse: jest.fn().mockImplementation(createSVGMatrix),
    multiply: jest.fn().mockImplementation(createSVGMatrix),
    rotate: jest.fn().mockImplementation(createSVGMatrix),
    rotateFromVector: jest.fn().mockImplementation(createSVGMatrix),
    scale: jest.fn().mockImplementation(createSVGMatrix),
    scaleNonUniform: jest.fn().mockImplementation(createSVGMatrix),
    skewX: jest.fn().mockImplementation(createSVGMatrix),
    skewY: jest.fn().mockImplementation(createSVGMatrix),
    translate: jest.fn().mockImplementation(createSVGMatrix),
});

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransform
 */
const createSVGTransform = () => ({
    type: 0,
    angle: 0,
    matrix: createSVGMatrix(),
    SVG_TRANSFORM_UNKNOWN: 0,
    SVG_TRANSFORM_MATRIX: 1,
    SVG_TRANSFORM_TRANSLATE: 2,
    SVG_TRANSFORM_SCALE: 3,
    SVG_TRANSFORM_ROTATE: 4,
    SVG_TRANSFORM_SKEWX: 5,
    SVG_TRANSFORM_SKEWY: 6,
    setMatrix: jest.fn(),
    setRotate: jest.fn(),
    setScale: jest.fn(),
    setSkewX: jest.fn(),
    setSkewY: jest.fn(),
    setTranslate: jest.fn(),
});

/**
 * @description SVGPoint is deprecated, we should use DOMPoint instead
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGPoint
 */
const createSVGPoint = () => ({
    x: 0,
    y: 0,
    matrixTransform: jest.fn().mockImplementation(createSVGPoint),
});

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGRect
 */
const createSVGRect = () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
});

// Mocks
// -----

/**
 * @description Mock method which is not implemented in JSDOM
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement
 */
globalThis.SVGPathElement = jest.fn();

/**
 * @description Mock SVGAngle which is used for sanity checks in Vectorizer library
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGAngle
 */
Object.defineProperty(globalThis, 'SVGAngle', {
    writable: true,
    value: jest.fn().mockImplementation(createSVGAngle),
});

beforeEach(() => {

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
     */
    globalThis.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    }));

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGSVGElement/createSVGMatrix
     */
    Object.defineProperty(globalThis.SVGSVGElement.prototype, 'createSVGMatrix', {
        writable: true,
        value: jest.fn().mockImplementation(createSVGMatrix),
    });

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransform
     */
    Object.defineProperty(globalThis.SVGSVGElement.prototype, 'createSVGTransform', {
        writable: true,
        value: jest.fn().mockImplementation(createSVGTransform),
    });

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGPoint
     */
    Object.defineProperty(globalThis.SVGSVGElement.prototype, 'createSVGPoint', {
        writable: true,
        value: jest.fn().mockImplementation(createSVGPoint),
    });

    /**
     * @description used in `util.breakText()` method
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTextContentElement/getComputedTextLength
     */
    Object.defineProperty(globalThis.SVGElement.prototype, 'getComputedTextLength', {
        writable: true,
        value: jest.fn().mockImplementation(() => 0),
    });

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getScreenCTM
     * Note: JSDOM SVGGraphicsElement does not encompass all SVG elements that might be needed,
     * whereas SVGElement provides broader compatibility.
     */
    Object.defineProperty(globalThis.SVGElement.prototype, 'getScreenCTM', {
        writable: true,
        value: jest.fn().mockImplementation(createSVGMatrix),
    });

    /**
     * @description used in `util.breakText()` method
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox
     */
    Object.defineProperty(globalThis.SVGElement.prototype, 'getBBox', {
        writable: true,
        value: jest.fn().mockImplementation(createSVGRect),
    });

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/checkVisibility
     * @see https://github.com/jsdom/jsdom/issues/3695
     * @description This method is not implemented in JSDOM yet.
     * We are adding it only to SVGElement.
     */
    Object.defineProperty(globalThis.SVGElement.prototype, 'checkVisibility', {
        writable: true,
        value: function () {
            const bbox = this.getBBox();
            return bbox.width > 0 && bbox.height > 0;
        },
    });

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGTransformList
     * @description SVGElement.transform.baseVal is not implemented in JSDOM yet.
     */
    Object.defineProperty(globalThis.SVGElement.prototype, 'transform', {
        writable: true,
        value: {
            baseVal: {
                numberOfItems: 0,
                length: 0,
                appendItem: jest.fn().mockImplementation(createSVGTransform),
                clear: jest.fn(),
                consolidate: jest.fn().mockImplementation(createSVGTransform),
                getItem: jest.fn().mockImplementation(() => createSVGTransform()),
                initialize: jest.fn().mockImplementation(createSVGTransform),
                insertItemBefore: jest.fn().mockImplementation(createSVGTransform),
                removeItem: jest.fn().mockImplementation(createSVGTransform),
                replaceItem: jest.fn().mockImplementation(createSVGTransform),
                createSVGTransformFromMatrix: jest.fn().mockImplementation(createSVGTransform),
            }
        }
    });

});

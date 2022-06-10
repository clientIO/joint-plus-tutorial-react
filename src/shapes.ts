import { dia } from '@clientio/rappid';

export abstract class PortElement extends dia.Element {
    abstract addDefaultPorts(): void;
}

export class Rectangle extends PortElement {

    defaults() {
        return {
            ...super.defaults,
            type: 'Rectangle',
            size: {
                width: 100,
                height: 60
            },
            attrs: {
                body: {
                    width: 'calc(w)',
                    height: 'calc(h)',
                    strokeWidth: 2,
                    stroke: '#000000',
                    fill: '#FFFFFF',
                },
                label: {
                    textVerticalAnchor: 'middle',
                    textAnchor: 'middle',
                    x: 'calc(0.5 * w)',
                    y: 'calc(0.5 * h)',
                    fontSize: 14,
                    fill: '#333333',
                },
            },
        };
    }

    addDefaultPorts() {
        this.addPort({});
        this.addPort({});
    }

    preinitialize() {
        this.markup = [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ];
    }
}

export class Ellipse extends PortElement {

    defaults() {
        return {
            ...super.defaults,
            type: 'Ellipse',
            size: {
                width: 100,
                height: 60
            },
            attrs: {
                body: {
                    rx: 'calc(0.5 * w)',
                    ry: 'calc(0.5 * h)',
                    cx: 'calc(0.5 * w)',
                    cy: 'calc(0.5 * h)',
                    strokeWidth: 2,
                    stroke: '#000000',
                    fill: '#FFFFFF',
                },
                label: {
                    textVerticalAnchor: 'middle',
                    textAnchor: 'middle',
                    x: 'calc(0.5 * w)',
                    y: 'calc(0.5 * h)',
                    fontSize: 14,
                    fill: '#333333',
                },
            },
        };
    }

    addDefaultPorts() {
        this.addPort({});
    }

    preinitialize() {
        this.markup = [
            {
                tagName: 'ellipse',
                selector: 'body',
            },
            {
                tagName: 'text',
                selector: 'label',
            },
        ];
    }
}

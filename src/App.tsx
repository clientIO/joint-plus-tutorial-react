import { useEffect, useRef } from 'react';
import {
    dia,
    ui,
    shapes as defaultShapes,
    highlighters,
} from '@clientio/rappid';
import { Ellipse, PortElement, Rectangle } from './shapes';
import './App.scss';

function App() {
    const canvasEl: any = useRef(null);
    const stencilEl: any = useRef(null);
    const inspectorEl: any = useRef(null);

    useEffect(() => {
        const shapes = { ...defaultShapes, Rectangle, Ellipse };

        const graph = new dia.Graph({}, { cellNamespace: shapes });

        const paper = new dia.Paper({
            model: graph,
            background: {
                color: '#F8F9FA',
            },
            frozen: true,
            async: true,
            sorting: dia.Paper.sorting.APPROX,
            cellViewNamespace: shapes,
            clickThreshold: 10,
        });

        const scroller = new ui.PaperScroller({
            paper,
            autoResizePaper: true,
            cursor: 'grab',
        });

        canvasEl.current.appendChild(scroller.el);
        scroller.render().center();

        const stencil = new ui.Stencil({
            paper: scroller,
            usePaperGrid: true,
            width: 130,
            dropAnimation: true,
            paperOptions: () => {
                return {
                    model: new dia.Graph({}, { cellNamespace: shapes }),
                    cellViewNamespace: shapes,
                };
            },
            layout: {
                columns: 1,
                rowHeight: 'compact',
                rowGap: 10,
                columnWidth: 130,
                marginY: 10,
                // reset defaults
                resizeToFit: false,
                dx: 0,
                dy: 0,
            },
            dragEndClone: (cell) => {
                const clone = cell.clone() as PortElement;
                clone.addDefaultPorts();
                return clone;
            },
        });

        stencilEl.current.appendChild(stencil.el);
        stencil.render();

        stencil.load([
            new Rectangle({
                attrs: {
                    label: {
                        text: 'Rectangle',
                    },
                },
            }),
            new Ellipse({
                attrs: {
                    label: {
                        text: 'Ellipse',
                    },
                },
            }),
        ]);

        paper.unfreeze();

        let inspector: ui.Inspector | null = null;

        let selectionFrame: highlighters.mask | null = null;

        function deselect() {
            if (inspector) {
                inspector.remove();
                inspector = null;
            }

            if (selectionFrame) {
                selectionFrame.remove();
                selectionFrame = null;
            }
        }

        function select(elementView: dia.ElementView) {
            deselect();

            selectionFrame = highlighters.mask.add(
                elementView,
                'body',
                'selection-frame',
                {
                    layer: dia.Paper.Layers.BACK,
                }
            );

            inspector = new ui.Inspector({
                cell: elementView.model,
                groups: {
                    text: {
                        index: 1,
                        label: 'Text',
                    },
                    presentation: {
                        index: 2,
                        label: 'Presentation',
                    },
                },
                inputs: {
                    'attrs/label/text': {
                        label: 'Label',
                        type: 'content-editable',
                        group: 'text',
                    },
                    'attrs/body/fill': {
                        label: 'Fill Color',
                        type: 'color',
                        group: 'presentation',
                    },
                },
            });

            inspector.render();
            inspectorEl.current.appendChild(inspector.el);
        }

        paper.on('element:pointerclick', (elementView) => {
            select(elementView);
        });

        paper.on('blank:pointerclick', () => {
            deselect();
        });

        stencil.on('element:drop', (elementView: dia.ElementView) => {
            select(elementView);
        });
    }, []);

    return (
        <div className='app'>
            <div className='stencil' ref={stencilEl}></div>
            <div className='canvas' ref={canvasEl}></div>
            <div className='inspector' ref={inspectorEl}></div>
        </div>
    );
}

export default App;

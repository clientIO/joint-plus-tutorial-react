import React, { useEffect, useRef } from 'react';
import { dia, ui, shapes } from '@joint/plus';
import './App.scss';

function App() {

  const canvas: any = useRef(null);

  useEffect(() => {
    const graph = new dia.Graph({}, { cellNamespace: shapes });

    const paper = new dia.Paper({
        model: graph,
        background: {
        color: '#F8F9FA',
        },
        frozen: true,
        async: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes
    });

    const scroller = new ui.PaperScroller({
        paper,
        autoResizePaper: true,
        cursor: 'grab'
    });

    canvas.current.appendChild(scroller.el);
    scroller.render().center(); 

    const rect = new shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 100, height: 50 },
      attrs: {
          label: {
             text: 'Hello World'
         }
       }
    });
  
    graph.addCell(rect);
    paper.unfreeze();

    return () => {
        scroller.remove();
        paper.remove();
    };
  }, []);

  return (
    <div className="canvas" ref={canvas}/>
  );

}

export default App;

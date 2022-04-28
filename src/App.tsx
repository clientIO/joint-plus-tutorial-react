import { useEffect, useRef, useState } from 'react';
import { dia, ui, shapes } from '@clientio/rappid';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { TabsData } from './tabs-data'
import { HyperlinkHighlighter } from './hyperlink-highlighter';
import './App.scss';

const selectedTabPanelClassName = "react-tabs__tab-panel--selected";
const theme = 'material';

/**
 * Extend the default activity icons with all events icons.
 */
Object.assign(shapes.bpmn2.Activity.ACTIVITY_TYPE_ICONS, shapes.bpmn2.Event.EVENT_ICONS);

function App() {

  let paper: dia.Paper;
  let scroller: ui.PaperScroller;

  const appEl = useRef<HTMLDivElement>(null);

  const [tabIndex, setTabIndex] = useState(0);

  /**
   * Create the default tab state
   */
   const createTabState = (title: string, json?: any) => {
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    let focusPoint;
    if (json) {
      graph.fromJSON(json);
      focusPoint = graph.getBBox()?.center().toJSON();
    }
    return {
      title,
      graph,
      focusPoint
    }
  }

  const [tabs, setTabs] = useState(() => {
    return TabsData.map(({ title, json }) => createTabState(title, json));
  });

  /**
   * Callback for when a tab element is in the DOM.
   */
  const onDomRef = (tabsEl: HTMLElement | undefined) => {
    if (tabsEl) {
      const tabPanelEl = tabsEl.querySelector(`.${selectedTabPanelClassName}`);
      if (tabPanelEl) {
        mountTab(tabPanelEl);
      }
    } else {
      unmountTab();
    }
  }

  useEffect(() => {
    const { current: container } = appEl
    if (!container) return;
    const tooltip = new ui.Tooltip({
      theme,
      rootTarget: container,
      container,
      target: '[data-tooltip]',
      direction: ui.Tooltip.TooltipArrowPosition.Auto,
      position: ui.Tooltip.TooltipPosition.Top,
      padding: 10,
      animation: true
    });
    return () => {
      tooltip.remove();
    }
  }, []);

  /**
   * Mounts the content of the tab and sets the focus point.
   */
  const mountTab = (tabPanelEl: Element) => {
    const { graph, focusPoint } = tabs[tabIndex];
    paper = new dia.Paper({
        model: graph,
        background: {
          color: '#F8F9FA',
        },
        frozen: true,
        async: true,
        gridSize: 10,
        cellViewNamespace: shapes
    });
    scroller = new ui.PaperScroller({
        paper,
        baseWidth: 10,
        baseHeight: 10,
        autoResizePaper: true,
        contentOptions: {
          minWidth: 600,
          allowNewOrigin: 'any',
          allowNegativeBottomRight: true,
          useModelGeometry: true,
          padding: 100
        },
        cursor: 'grab'
    });
    tabPanelEl.appendChild(scroller.el);
    scroller.render().adjustPaper();

    paper.on('element:link', (elementView: dia.ElementView, evt: dia.Event) => {
      const { subgraphId } = elementView.model.attributes;
      if (!subgraphId) return;
      evt.stopPropagation();
      selectGraph(subgraphId);
    });

    paper.on('blank:pointerdown', (evt) => {
      scroller.startPanning(evt);
    });

    graph.getElements().forEach((element) => {
      HyperlinkHighlighter.addToLabel(element, paper, 'subgraphId');
    });

    if (focusPoint) {
      scroller.center(focusPoint.x, focusPoint.y);
    } else {
      scroller.center();
    }

    paper.unfreeze();
  }

  /**
   * Unmounts the content of the current tab.
   */
  const unmountTab = () => {
    if (paper) paper.remove();
    if (scroller) scroller.remove();
  }

  /**
   * Add a new tab with a new graph
   */
  const addTab = () => {
    setTabs(prevState => {
      return [...prevState, createTabState(`Tab ${prevState.length + 1}`)];
    });
    setTabIndex(tabs.length);
  }

  /**
   * Remove a tab at the specified index.
   */
  const removeTab = (index: number) => {
    setTabs(prevState => prevState.filter((_, i) => i !== index));
  }

  /**
   * Change tab attributes at the specified index.
   */
  const changeTab = (index: number, change: any) => {
    setTabs(prevState => prevState.map((tab, i) => {
      if (i !== index) return tab;
      return {
        ...tab,
        ...change
      }
    }));
  }

  /**
   * Select a tab at the specified index.
   */
  const selectTab = (index: number, prevIndex: number = tabIndex) => {
    let maxIndex = tabs.length - 1;
    const isTabRemoval = prevIndex === index;
    if (isTabRemoval) {
      maxIndex--;
    } else if (scroller) {
      const focusPoint = scroller.getVisibleArea().center().toJSON();
      changeTab(prevIndex, { focusPoint });
    }
    setTabIndex(Math.max(Math.min(index, maxIndex), 0));
  }

  const selectGraph = (graphId: string) => {
    const index = tabs.findIndex(tab => tab.graph.id === graphId);
    if (index > -1) {
      selectTab(index);
    } else {
      const message = new ui.FlashMessage({
        theme,
        content: `Invalid graph ID: ${graphId}`,
      });
      message.open();
    }
  }

  return (
    <div
      className="app"
      ref={appEl}
    >
      <Tabs
        className={`${Tabs.defaultProps?.className} app__tabs`}
        selectedIndex={tabIndex}
        selectedTabPanelClassName={selectedTabPanelClassName}
        onSelect={(index, prevIndex) => selectTab(index, prevIndex)}
        domRef={(node) => onDomRef(node)}
      >
        <TabList className={`${TabList.defaultProps?.className} app__tab-list`}>
          {tabs.map((tab, index) => (
            <Tab className={`${Tab.defaultProps?.className} app__tab`}>
              <span>{tab.title}</span>
              <button
                data-tooltip={`Remove "${tab.title}" tab`}
                data-tooltip-position="top"
                className="app__tab-button"
                onClick={() => removeTab(index)}
              >x</button>
            </Tab>
          ))}
          <div className="app__tab-buttons">
            <button
              data-tooltip="Add a new tab"
              data-tooltip-position="top"
              className="app__tab-button"
              onClick={() => addTab()}
            >+</button>
          </div>
        </TabList>
        {tabs.map(() => (
        <TabPanel className={`${TabPanel.defaultProps?.className} app__tab-panel`}></TabPanel>
        ))}
      </Tabs>
      </div>
  );
}

export default App;

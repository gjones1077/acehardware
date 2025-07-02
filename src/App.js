import logo from './logo.svg';
import { useState, useEffect } from 'react';
import * as tocbot from 'tocbot';
import ScreenForms from "./components/ScreenForms"

import './App.css';

function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  function toggleTab(index) {
    setActiveTabIndex(index);
  };

  useEffect(() => {
    tocbot.init({
      tocSelector: '.js-toc',
      contentSelector: 'main',
      headingSelector: 'h1, h2',
      hasInnerContainers: true,
      linkClass: 'toc-link',
      isCollapsedClass: 'is-collapsed',
      scrollSmooth: 'true',
      scrollSmoothDuration: 420,
      headingsOffset: 40,
      collapseDepth: 0,
    });
}, [])

  return (
    <div className="App">
      <div className="App-header">
        <h1>Screen Shop Reference </h1>
        <nav className='js-toc'></nav>
      </div>
      <main>
        <div className="glass-cutting-section" id="glass-cutting">
        <h2 id="1">Glass Cutting</h2>
        <p>   
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
        </p>
        </div>
        <h2 id="3">Propane</h2>
        <p>   
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet dolore esse fugiat inventore mollitia
          nam
          officiis perferendis veniam.
          Asperiores blanditiis ea enim esse explicabo nam necessitatibus obcaecati officia sunt ut.
        </p>
        <h2 id="4">Returning online orders</h2>
        <h2 id="2">Screen Intake/Pickup</h2>
        <ScreenForms activeTabIndex={activeTabIndex} toggleTab={toggleTab}/>  
      </main>
    </div>
  );
}

export default App;

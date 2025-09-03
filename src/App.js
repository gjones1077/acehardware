import logo from './logo.svg';
import { useState, useEffect } from 'react';
import * as tocbot from 'tocbot';
import ScreenForms from "./components/ScreenForms";
import aceEmblem from "./images/Ace-Hardware-Emblem.jpg";

import './App.css';

function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  function toggleTab(index) {
    setActiveTabIndex(index);
  };

  function toggleToc() {
    setTocOpen(open => !open);
  }

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
      <div className="top-banner">
        <div className="top-banner-links">
          <a href="https://acenet.aceservices.com/" target="_blank" rel="noopener noreferrer">AceNet</a>
          <a href="https://www.repairstorm.com/" target="_blank" rel="noopener noreferrer">RepairStorm</a>
        </div>
      </div>
      <div className="App-header"> 
        <h1>Screen Shop Reference </h1>
      </div>
      {/* Hamburger Button */}
      {/* <button
        className={`toc-hamburger${tocOpen ? ' active' : ''}`}
        onClick={toggleToc}
        aria-label="Open Table of Contents"
      >
        <span />
        <span />
        <span />
      </button> */}
      {/* Side Menu */}
      {/* <div className={`toc-side-menu${tocOpen ? ' open' : ''}`}>
        <div className='toc-box'>
          <nav className='js-toc'/>
        </div>
      </div> */}
      <main>
        {/* <div className="glass-cutting-section" id="glass-cutting">
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
        <div className='propane-section'>
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
        </div>
        <div className='online-order-section'>
        <h2 id="4">Returning online orders</h2>
        </div> */}
        <div className='screen-section'>
        <h2 id="2">Screen Intake/Pickup</h2>
        <ScreenForms activeTabIndex={activeTabIndex} toggleTab={toggleTab}/>
        </div>
      </main>
    </div>
  );
}

export default App;

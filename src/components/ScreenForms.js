import { useState, useRef, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';
import Pricing from "./Pricing";

{/* <h3>Current User Input:</h3>
                        <h4>Length: {formData.length}</h4>
                        <h4>Height: {formData.height}</h4>
                        <h4>Quantity: {formData.quantity}</h4>
                        <h4>Material: {formData.material}</h4> */}
function ScreenForms({activeTabIndex, toggleTab}) {
    const lastStepRef = useRef(null);
    const intakeCollectionRef = collection(db, "screen-intake");
    const [isVisible, setIsVisible] = useState(false);
    const [length, setLength] = useState(0);
    const [height, setHeight]= useState(0);
    const [quantity, setQuantity] = useState(1);
    const [displayText, setDisplayText] = useState('');
    const [screenList, setScreenList] = useState([]);
    const sortedScreenList = screenList.sort((a, b) => a.height - b.height);
    const [runningTotal, setRunningTotal] = useState(0);
    const [formData, setFormData] = useState({
        length: '',
        height: '',
        quantity: 1,
        material: '',
        lastPrice: 0
    });
    const [formList, setFormList] = useState([
        { length: "", height: "", quantity: 1, material: "default", lastPrice: 0 }
    ]);

    const handleLengthChange = (event) => {
        const value = event.target.value;
        setLength(value);
    };

    const handleHeightChange = (event) => {
        const value = event.target.value;
        setHeight(value);
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;
        setQuantity(value);
    };

    const clearPickupData = () => {
        setLength(0);
        setHeight(0);
        setQuantity(1);
        setDisplayText('');
    };

    const calcMats = () => {
        const adjustedLength = 2 * length;
        const adjustedHeight = 2 * height;
        const fabAmt = Math.ceil(adjustedLength / 12) * quantity;
        const splAmt = Math.ceil((adjustedLength + adjustedHeight) / 12) * quantity;
        setDisplayText(`Fabric Amount: ${fabAmt} feet, Spline Amount: ${splAmt} feet`);
    };

    const handleUserInput = (index, event) => {
        const { name, value } = event.target;
        const updatedFormList = [...formList];
        updatedFormList[index][name] = value;
        setFormList(updatedFormList);
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const addForm = () => {
        setFormList([...formList, { length: "", height: "", quantity: 1, material: "default" }]);
    };

    const removeForm = (index) => {
        const updatedFormList = formList.filter((_, i) => i !== index);
        setFormList(updatedFormList);
    };

    const updateTotal = (newAmount) => {
        setRunningTotal((prev) => prev + newAmount);
    }

    const clearEntry = (index) => {
        const updatedFormList = [...formList];
        updatedFormList[index] = { length: "", height: "", quantity: 1, material: "default" };
        setFormList(updatedFormList);
    }
    
    const clearForms = () => {
        const emptyFormList = [];
        emptyFormList[0] = { length: "", height: "", quantity: 1, material: "default" };
        setFormList(emptyFormList);
        setRunningTotal(0);
    }

    useEffect(() => {
        const getScreenList =  async () => {
            try {
                const data = await getDocs(intakeCollectionRef);
                const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id,})) 
                setScreenList(filteredData);
            } catch(e) {
                console.error(e);
            }
            
        };
        getScreenList();
    }, []);

    const filterInput = (e) => {
        if (e.key === "-") {
            e.preventDefault();
        }
    };

    const handleScrollClick = () => {
        lastStepRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <>
            <div className="tab-buttons">
                <button
                    className={`tab-button ${activeTabIndex === 0 ? "active-tab-button" : ""}`} 
                    onClick={() => toggleTab(0)}>
                    Intake
                </button>
                <button 
                    className={`tab-button ${activeTabIndex === 1 ? "active-tab-button" : ""}`}
                    onClick={() => toggleTab(1)}>
                    Pickup
                </button>
            </div>
            <div class="tab" id="tab1" style={{ display: activeTabIndex === 0 ? "block" : "none"}}>
                <h3> Intake Steps </h3>
                <button onClick={toggleVisibility}>{isVisible ? 'Hide Element' : 'Show Element'}</button>
                { isVisible && <ol>
                    <li>Verify that the frame is intact (if broken refer customer to ace handyman, card on desk)</li>
                    <li>Input the LENGTH and WIDTH as well as the quantity of screens to intake in the boxes below after measuring
                        <ul> **When measuring...
                            <li>Include the frame</li>
                            <li>Round up to the next whole DO NOT INCLUDE DECIMALS</li>
                        </ul>
                        **Press the "Add New Size" button to add any additional sizes of screens and their quantities
                    </li>
                    <li>Ask the customer what type of material they would like (there are samples directly right from the computer at the desk), then select that material from the dropdown menu</li>
                    <li>Click "Determine Price" then have the customer take one of the beige tickets (also directly right of the computer attached to the desk) and write down their name and number</li>
                    <span onClick={handleScrollClick} style={{cursor: 'pointer'}}>** If you do not have a RepairStorm account please skip to the final step</span>
                    <li>Let them know the price, the estimated turnaround time, and that we will call when it is finished before wishing them a good day/night</li>
                    <li>Enter the name and number given on the ticket in the labeled boxes</li>
                    <li>Select "Generate RepairStorm Data"</li>
                    <li>On the RepairStorm home page select "Check In" on the left, then on the right, select "Screen Repair" &gt; "Intake" 
                    </li>
                    <li>Copy and paste the given fields from the display box into RepairStorm. Be sure to initial the "associate" box</li>
                    <li>Select "Print Final Ticket" and print the downloaded pdf</li>
                    <li>Place the printed ticket at the BACK of the clipboard of orders along the wall behind the desk</li>
                    <li ref={lastStepRef}>Take the beige ticket and use the wiring to attach it to the screen(s)</li>
                </ol> }
                <h3>Price Calculator</h3>
                {formList.map((formData, index) => ( 
                    <form id="container">
                        <label>Length: </label>
                        <input name="length" 
                            type="number" 
                            onChange={(e) => handleUserInput(index, e)} 
                            value={formData.length} 
                            placeholder='Inches'
                            min="18"
                            max="60">
                        </input>
                        <br/>

                        <label>Height: </label>
                        <input name="height" 
                            type="number" 
                            onChange={(e) => handleUserInput(index, e)} 
                            value={formData.height} 
                            placeholder='Inches'
                            min="24"
                            max="96">
                        </input>
                        <br/>

                        <label>Quantity: </label>
                        <input 
                            name="quantity" 
                            type="number" 
                            onChange={(e) => handleUserInput(index, e)}  
                            value={formData.quantity} 
                            min="1"
                            onKeyDown={(e) => {
                                if (e.key === "-") {
                                    e.preventDefault();
                                }
                            }} />
                        <br/>

                        <select name="material" onChange={(e) => handleUserInput(index, e)}  value={formData.material}>
                            <option value="default" autoFocus="true">Material</option>
                            <option value="fib">Fiberglass</option>
                            <option value="alu">Aluminum</option>
                            <option value="pet">Pet Screen</option>
                        </select>
                        <button onClick={(e) => {e.preventDefault(); clearEntry(index);}}>Clear Entry</button>
                        <Pricing key={index} formData={formData} onPriceCalculated={updateTotal}/>
                        
                    </form>
                ))}
                <button type="button" onClick={addForm}>Add Entry</button>
                <button type="button" onClick={removeForm}>Remove Entry</button>
                <button onClick={clearForms}>Clear All</button>
                <h3>Total Price: ${runningTotal}.00</h3>
            </div>
            <div class="tab" id="tab2" style={{ display: activeTabIndex === 1 ? "block" : "none"}}>
                <h4>Tab 2 Content</h4>
                <p>Description for Tab 2 goes here</p>
                <form>
                    <label>Length</label>
                    <input type="number" onChange={(e) => handleLengthChange(e)} 
                    value={length} onKeyDown={(e) => filterInput(e)} placeholder='inches'/>
                    <label>Height</label>
                    <input type="number" onChange={(e) => handleHeightChange(e)} 
                    value={height} onKeyDown={(e) => filterInput(e)} placeholder='inches'/>                   
                    <label>Quantity: </label>
                    <input type="number" min="1" onChange={(e) => handleQuantityChange(e)}
                        value={quantity} onKeyDown={(e) => filterInput(e)} />
                    <button type="button" onClick={calcMats}>Calculate Materials</button>
                    <button type="button" onClick={clearPickupData}>Clear</button>
                    <p>{displayText}</p>
                </form>
            </div>
        </>
    );
}

export default ScreenForms;
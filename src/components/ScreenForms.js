import { useState, useRef, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';
import Pricing from "./Pricing";
import MatsTable from "./MatsTable"
/* TODOs:
    -By Friday:
        -Test calculator functionality
        -Add SKU data to the firebase database
        -Add copy to clipboard functionality for repairstorm data
    -Finish implementing the pickup tab calculator (should take multiple sizes)
    -Add excellent CSS to the calculation section of the form 
    -Start (and try to finish) glass pricing calculator
    -Start propane scale setter and price calculator
*/
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
    const [priceList, setPriceList] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const [formIndex, setFormIndex] = useState(0);
    const [pickupDisplayTexts, setPickupDisplayTexts] = useState([""]);
    const [pformData, setPFormData] = useState({
        length: '',
        height: '',
        quantity: 1,
    });
    const [formData, setFormData] = useState({
        length: '',
        height: '',
        quantity: 1,
        material: '',
        lastPrice: 0,
    });
    const [formList, setFormList] = useState([
        { length: "", height: "", quantity: 1, material: "default", index: formIndex, lastPrice: 0 }
    ]);

    const [pformList, setPFormList] = useState([
        { length: "", height: "", quantity: 1 }  //add materials after main function working 
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
        setPickupDisplayTexts([""]);
        setPFormList([{ length: "", height: "", quantity: 1 }]);
    };

    const calcMats = (index) => {
        const adjustedLength = 2 * pformList[index].length;
        const adjustedHeight = 2 * pformList[index].height;
        const fabAmt = Math.ceil(adjustedLength / 12) * pformList[index].quantity;
        const splAmt = Math.ceil((adjustedLength + adjustedHeight) / 12) * pformList[index].quantity;
        const newText = `Fabric Amount: ${fabAmt} feet, Spline Amount: ${splAmt} feet`;

        setPickupDisplayTexts(prev => {
            const updated = [...prev];
            updated[index] = newText;
            return updated;
        });
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

    const phandleUserInput = (index, event) => {
        const { name, value } = event.target;
        const updatedFormList = [...pformList];
        updatedFormList[index][name] = value;
        setPFormList(updatedFormList);
        setPFormData({
            ...pformData,
            [event.target.name]: event.target.value
        });
    }

    const paddForm = () => {
        setPFormList([...pformList, { length: "", height: "", quantity: 1 }]);
        setPickupDisplayTexts(prev => [...prev, ""]);
    };

    const addForm = () => {
        const newIndex = formList.length;
        setFormList([...formList, { length: "", height: "", quantity: 1, material: "default", index: newIndex, lastPrice: 0 }]);
        console.log("Index after add", newIndex); 
    };

    const removeEntry = (index) => {
        const updatedFormList = formList.filter((form) => form.index !== index);
        if (!formList[index]) {
            setFormList(updatedFormList);   
        } else {
            formList[index].lastPrice !== 0 ? updateTotal(true, formList[index].lastPrice) : updateTotal(true, 0);
            console.log("Index and Updated Form List: ", index, updatedFormList);
            setFormList(updatedFormList);
        }   
    };

    const updateLastPrice = (index, newPrice) => {
        setFormList(prev =>
            prev.map((form, i) =>
                i === index ? { ...form, lastPrice: newPrice } : form
            )
        );
    };

    const updateTotal = (deleting, newAmount) => {
        if (!deleting) {
            if (formList.length === 1) {
                setRunningTotal(0);
            }
            // setPriceList((prevList) => [...prevList, newAmount]);
            setRunningTotal(runningTotal + newAmount);
        } else {
            // setPriceList((prevList) => prevList.filter((price) => price !== newAmount));
            formList.length === 1 ? setRunningTotal(0) : setRunningTotal(runningTotal - newAmount);
        }
    }
    const clearData = (index) => {
        if (!formList[index]) {
            setDisplayText("Error: no data to clear"); 
        } else {
            formList[index].length = "";
            formList[index].height = "";
            formList[index].quantity = 1;
            formList[index].material = "default";
        }
        
    }
    const clearForms = () => {
        const emptyFormList = [];
        emptyFormList[0] = { length: "", height: "", quantity: 1, material: "default", lastPrice: 0, index: 0 };
        setFormList(emptyFormList);
        setRunningTotal(0);
        clearData(0);
        setPriceList([]);
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
                        <Pricing 
                            key={index} 
                            formData={formData} 
                            updateTotal={updateTotal} 
                            // priceList={priceList} 
                            removeEntry={removeEntry} 
                            clearData={clearData}
                            onLastPriceUpdate={updateLastPrice}/>
                    </form>
                ))}
                <button type="button" onClick={addForm}>Add Entry</button>
                <button onClick={clearForms}>Reset</button>
                <h3>Total Price: ${runningTotal}.00</h3>
            </div>
        <div className="tab" id="tab2" style={{ display: activeTabIndex === 1 ? "block" : "none" }}>
            <h3>Pickup Calculator</h3>
            {pformList.map((pformData, index) => (
                <form key={index}>
                    <label>Length: </label>
                    <input
                        name="length"
                        type="number"
                        onChange={(e) => phandleUserInput(index, e)}
                        value={pformData.length}
                        placeholder="Inches"
                        min="18"
                        max="60"
                        onKeyDown={filterInput}
                    />
                    <br />

                    <label>Height: </label>
                    <input
                        name="height"
                        type="number"
                        onChange={(e) => phandleUserInput(index, e)}
                        value={pformData.height}
                        placeholder="Inches"
                        min="24"
                        max="96"
                        onKeyDown={filterInput}
                    />
                    <br />

                    <label>Quantity: </label>
                    <input
                        name="quantity"
                        type="number"
                        min="1"
                        onChange={(e) => phandleUserInput(index, e)}
                        value={pformData.quantity}
                        onKeyDown={filterInput}
                    />
                    <br />
                    <button type="button" onClick={() => calcMats(index)}>Calculate Materials</button>
                    <p>{pickupDisplayTexts[index]}</p>

                    {index > 0 ? (
                        <button
                            type="button"
                            className="close-btn"
                            onClick={() => {
                                const updated = pformList.filter((_, i) => i !== index);
                                setPFormList(updated);
                            }}
                            aria-label="Remove Entry"
                            title="Remove Entry"
                        >
                            &times;
                        </button>
                    ) : null}
                </form>
            ))}
        <button type="button" onClick={paddForm}>Add New Size</button>
        <button type="button" onClick={clearPickupData}>Reset</button>
        <br/>
        <br/>
        <button onClick={toggleVisibility}>{isVisible ? 'Hide Material Table' : 'Show Material Table'}</button>
        {isVisible && <MatsTable />}
    </div>
</>
    );
}

export default ScreenForms;
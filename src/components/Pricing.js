import { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs} from "firebase/firestore";
import { reauthenticateWithCredential } from 'firebase/auth';
/*
    TODOS:
        - implement one calculate button functionality instead of generating a new calculate button for each entry
        - implement clear entry and clear/reset form buttons
        - finish implementing remove entry
        - after calculate is pressed, subsequent presses should do nothing if no values are changed
        - Accurately communicate database retrieval errors instead of displaying NaN for the price
        - start pickup tab calculator
        - CSS!
*/
const acebaseRef = collection(db, "screen-intake");

function Pricing(props) {
    const [price, setPrice] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const {length, height, material, quantity, index} = props.formData;
    const { updateTotal, priceList, removeEntry, clearData, onLastPriceUpdate } = props; 

    const getPrice = async () => {
        let swapped = false;
        let validScreen = true;
        // Rules
        // - Length <= 60
        // - Height <= 96
        if (length > 60 && (height < 60 && height < length && length < 96)) {
          swapped = true;
          console.log("Length: ", length, "Height: ", height);
        } else if (length > 60 && height > 96) {
            setDisplayText("Invalid length. Enter value <= 60 Invalid height. Enter value <= 96");
            validScreen = false;
        } else if (height > 96) {
            setDisplayText("Invalid height. Enter value <= 96");
            validScreen = false;
        } else if (length > 60) {
            setDisplayText("Invalid length. Enter value <= 60");
            validScreen = false;
        } 
        // - A screen can have length > 60 if and only if height < length and length < 96
        // - If length < 18 -> adjustedLength = 18
        // - if height < 24 -> adjustedHeight = 24
        let adjustedLength = Math.ceil(length / 6) * 6;
        let adjustedHeight = Math.ceil(height / 6) * 6;
        if (length < 18) {
            adjustedLength = 18
        }
        
        if (height < 24) {
            adjustedHeight = 24; 
        }

        if (adjustedHeight === 90) {
            adjustedHeight = 96
        }
        //ceil(length / 6)*6 
        console.log("Swapped:", swapped);
        if (swapped) {
            [adjustedLength, adjustedHeight] = [adjustedHeight, adjustedLength];
        }
        console.log("Length: ", adjustedLength, " ", "Height ", adjustedHeight, "ValidScreen: ", validScreen);
        
        if (validScreen) {
            const q = query(acebaseRef, where("length", "==", adjustedLength), where("height", "==", adjustedHeight));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.length > 1) { // Improve user error handling
                setDisplayText("Error: Multiple Matches Found");
            } else if (querySnapshot.empty) {
                setDisplayText("Error: No Matches Found in Database");
            } else if (material === "default") {
                setDisplayText("Please select a material from the dropdown");
            } else if (quantity < 1) {
                setDisplayText("Please enter a quantity greater than 0");
            } else {
                const doc = querySnapshot.docs[0];
                const data = doc.data();
                const adjustedPrice = data.pricing[material] * quantity;
                setPrice(adjustedPrice);
                onLastPriceUpdate && onLastPriceUpdate(index, adjustedPrice);
                updateTotal(false, adjustedPrice);
                console.log("Quantity: ", quantity);
                console.log("Material: ", material);
                console.log("Index: ", index);
                querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                });
                
                setDisplayText(`Match Found! ${data.length}x${data.height} `);
                updateTotal(false, adjustedPrice);
            }
        }     
    }
    
    return (
        <>
            <button onClick={(e) => {e.preventDefault(); getPrice();}}>
                Search
            </button>
            <button onClick={(e) => {e.preventDefault(); updateTotal(true, price); setPrice(0); setDisplayText(''); clearData(index)}}>
                Clear Entry
            </button>
            {index > 0 ? 
                <button type="button" 
                    onClick={() => removeEntry(index)}>
                    Remove Entry
                </button>  
            : null}
            <p>{displayText} -- ${price}.00 </p>
        </>
        
    )
}

export default Pricing;
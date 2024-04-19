"use client"
import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import TimerComponent from "../_components/timer-component";
import PopupComponent from "./popup-component";

function WordleGrid() {
    const NumOfGuesses=[1,2,3,4,5,6];
    const NumOfLetter=[1,2,3,4,5];
    let currentGuessNo=1;
    let nextLetter=1;
    let currentGuessString="";
    let totalWords:string[]=[];
    const [onStart,setOnStart]=useState(false);
    const [onPause,setOnPause]=useState(false);
    const [onReset,setOnReset]=useState(false);
    const [startGame,setStartGame]=useState(false);
    let isGameStarted=false;
    const [message1,setMessage1]=useState("");
    const [message2,setMessage2]=useState("");
    const [showRestartGameBtn,setShowRestartGameBtn]=useState(false);
    const [isPopupVisible,setIsPopupVisible]=useState(false);
 
    
    useEffect(() => {
        const handleKeyPress = ( ev: KeyboardEvent) => {
            console.log("Key pressed:"+ev.key);
            if(!isGameStarted){return;}
            if(ev.key==="Backspace"){
                //backSpaceHandler
                backSpaceHandler();
                //return console.log("Backspace pressed!");
            }
            if(ev.key==="Enter"){
                //submitGuessHandler
                try{
                    submitGuessHandler();
                }catch(error){
                    console.log(error);
                } 
                // return console.log("Enter pressed!");
            }
            if(!(/^[a-zA-Z]$/.test(ev.key))){
                return console.log(/^[a-zA-Z]$/.test(ev.key));
            }
            
            // logic to handle the key press
            fillCharacterHandler(ev.key);
        };
        const backSpaceHandler=()=>{
            if(nextLetter===1){
                return;
            }else{
                const divEle=document.getElementsByClassName("letter-row")[currentGuessNo-1];
                const box=divEle?.children[nextLetter-2];
                if(box){
                    box.textContent="";
                    currentGuessString=currentGuessString.substring(0,nextLetter-2);
                    nextLetter=nextLetter-1;
                }
                return ;
            }
        }
        const submitGuessHandler= ()=>{
            if(currentGuessString.length<5){
                return alert("Bro, please enter whole word!");
            }else{
                try{
                    checkWordHandler(currentGuessString);
                }catch(error){
                    console.log(error);
                }
            }

        }
        
        const fillCharacterHandler=(key:string)=>{
            if(nextLetter===6){
                return ;
            }else{
                const divEle=document.getElementsByClassName("letter-row")[currentGuessNo-1];
                const box=divEle?.children[nextLetter-1];
                if(box){
                    box.textContent=key;
                    currentGuessString+=key;
                    nextLetter=nextLetter+1;
                }
                // console.log(JSON.stringify(box?.className));
                // console.log(JSON.stringify(box?.id));
                // console.log(currentGuessString);
                return ;
            }

        }
        const clearSessioStorage=()=>{sessionStorage.clear();}
        // const handleKeyboardClick = (e: MouseEvent) => {
        //     const target = e.target as HTMLElement;
        //     console.log("From handleKeyboardClick");
        //     if (!target.classList.contains("keyboard-button")) {
        //         return;
        //     }
        //     console.log(target.classList);
        //     let key = target.textContent || '';
        
        //     if (key === "Del") {
        //         key = "Backspace";
        //     } 
        //     console.log(key);
        //     const event = new KeyboardEvent("keydown", { key: key });
        //     document.dispatchEvent(event);
        // };

        // const keyboardContainer = document.getElementById("keyboard-cont");
        // if (keyboardContainer) {
        //     keyboardContainer.addEventListener("click", handleKeyboardClick);
        // }
        window.addEventListener("keydown", handleKeyPress as unknown as EventListener);
        window.addEventListener("beforeunload",clearSessioStorage as unknown as EventListener);

        return () => {
            window.removeEventListener("keydown", handleKeyPress as unknown as EventListener);
            // window.removeEventListener("click", handleKeyboardClick as unknown as EventListener);
            // if (keyboardContainer) {
            //     keyboardContainer.removeEventListener("click", handleKeyboardClick);
            // }
        };
    }, []);
    const checkWordHandler= (word:string)=>{
        console.log(totalWords.length);
        const answer = typeof window !== 'undefined' ? sessionStorage.getItem('answer') : null;
        if(word===answer){
            setOnStart(false);
            setOnPause(true);
            colorWordHandler(currentGuessNo);
            setMessage1("Congratulations!");
            setMessage2("You won!");
            setIsPopupVisible(true);
            return ;
        }
        if(totalWords.includes(word)){

            console.log(totalWords.length);
            colorWordHandler(currentGuessNo);
            if(currentGuessNo===6){
                isGameStarted=false;
                setOnPause(true);
                setOnStart(false);
                setShowRestartGameBtn(true);
                const correctAnswer = sessionStorage.getItem("answer");
                const message2="Correct answer is: "+correctAnswer;
                setMessage1("Game over!");
                setMessage2(message2);
                setIsPopupVisible(true);
            }else{
                currentGuessNo=currentGuessNo+1;
                nextLetter=1;
                currentGuessString="";
            }
            return ;
        }else{
            const divEle=document.getElementsByClassName("letter-row")[currentGuessNo-1];
            if(divEle){
                divEle.className=divEle.className+" text-red-500";
                const timeout=setTimeout(() => {
                    divEle.className="letter-row";
                }, 500);
                
                return () => clearTimeout(timeout);;   //STAR MARKED
            }
        }
    };
    const colorWordHandler = async (rowNo:number) => {
        // Get the current row element based on the guess number
        const rowElement = document.getElementsByClassName("letter-row")[rowNo - 1];
        
        // Get the correct answer from sessionStorage
        const correctAnswer = sessionStorage.getItem("answer");
    
        // Get a copy of the answer to manipulate
        const tempAnswer = correctAnswer ? correctAnswer.split('') : [];
    
        // Loop through each letter in the row
        for (let i = 0; i < 5; i++) {
            // Initialize the color class for the letter
            let letterColor = "";
    
            // Get the current letter box element
            const letterBox = rowElement?.children[i];
    
            // Find the position of the guessed letter in the correct answer
            const letterPosition = tempAnswer?.indexOf(currentGuessString.charAt(i));
    
            // Check if the letter is in the correct position
            if (letterPosition === i && letterPosition !== -1) {
                letterColor = "text-green-500"; // Green for correct letter in correct position
            } else if (letterPosition !== -1) {
                letterColor = "text-yellow-500"; // Yellow for correct letter in wrong position
            } else {
                letterColor = "text-gray-500"; // Gray for incorrect letter
            }
    
            // Update the class of the letter box with the color class
            if (letterBox) {
                letterBox.className = letterBox.className + " " + letterColor;
            }
    
            // Replace the guessed letter with # in tempAnswer
            if (letterPosition !== -1 && letterPosition!==undefined) {
                tempAnswer[letterPosition] = '#';
            }
            // ShadeKeyBoard
            const delay = 300 * i;
            setTimeout(()=> {
                //shade box
                console.log(letterBox?.textContent);
                if(letterBox?.textContent){
                    shadeKeyBoard(letterBox.textContent,letterColor);
                }  
            }, delay)
        }
        return;
    }
    function shadeKeyBoard(letter: string, color: string){
        // console.log("from shadeKeyBoard------------");
        // console.log(letter);
        // console.log(color);
        const elements = document.getElementsByClassName("keyboard-button") as HTMLCollectionOf<HTMLElement>;
        for (const elem of elements) {
            if (elem.textContent === letter) {
                // let oldColor = elem.style.color;
                // console.log(elem.className);
                // console.log(oldColor);
                // console.log(color);
                if (elem.className === 'keyboard-button text-green-500') {
                    return;
                }
            
                if (elem.className === 'keyboard-button text-yellow-500' && color !== 'text-green-500') {
                    return;
                }
                elem.className = "keyboard-button "+color;
                break;
            }
        }
    }
      

    const startGameHandler=async ()=>{
        try {
            const response = await fetch('https://raw.githubusercontent.com/cymplecy/5letterWords/main/files/5letterWords.txt');
            if (!response.ok) {
              throw new Error('Failed to fetch word list');
            }
        
            const text = await response.text();
            const words = text.split('\n').filter(word => word.length === 5);
            const randomIndex = Math.floor(Math.random() * words.length);
            console.log(words[randomIndex]);
            const answer=words[randomIndex];
            if(words && answer!==undefined){
                totalWords=words;
                sessionStorage.setItem('totalWords', JSON.stringify(words));
                sessionStorage.setItem("answer",answer);
            }
            
            setStartGame(true);
            isGameStarted=true;
            setOnStart(true);
            console.log(sessionStorage.getItem("answer"));
            console.log(totalWords.length);
        
            return words[randomIndex];
            } catch (error) {
                console.error('Error fetching random word:', error);
                return null;
            }
    }
    // console.log(totalWords.length);
    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setShowRestartGameBtn(true);
        return console.log("Start a new game!");
    };
    const restartGameHandler=()=>{
        window.location.reload();
    }
    
  return (
    <div className="flex flex-col justify-center" >
        <PopupComponent onClose={handleClosePopup} isPopupVisible={isPopupVisible} message1={message1} message2={message2}/>
        <div className="flex justify-center m-2">
            {startGame?
            <TimerComponent onStart={onStart} onPause={onPause} onReset={onReset}/>:
            <button className="rounded border border-white p-px px-2 text-xl" onClick={startGameHandler}>Start Game</button>}   
        </div>
        {showRestartGameBtn?<div className="flex justify-center m-4"><button className="rounded border border-white p-px px-2 text-xl" onClick={restartGameHandler}>Restart Game</button></div>:<></>}
        <div className="container">
            {NumOfGuesses.map((lineNo)=>(<div className="letter-row" key={"Line:"+(lineNo).toString()} id={lineNo.toString()}>
                {NumOfLetter.map((letterNo)=>(<div className="letter-box" key={"Letter:"+(letterNo).toString()} id={letterNo.toString()}></div>))}
            </div>))}
        </div>
        <div id="keyboard-cont">
        <div className={"first-row"}>
            <button className={"keyboard-button"}>q</button>
            <button className={"keyboard-button"}>w</button>
            <button className={"keyboard-button"}>e</button>
            <button className={"keyboard-button"}>r</button>
            <button className={"keyboard-button"}>t</button>
            <button className={"keyboard-button"}>y</button>
            <button className={"keyboard-button"}>u</button>
            <button className={"keyboard-button"}>i</button>
            <button className={"keyboard-button"}>o</button>
            <button className={"keyboard-button"}>p</button>
        </div>
        <div className={"second-row"}>
            <button className={"keyboard-button"}>a</button>
            <button className={"keyboard-button"}>s</button>
            <button className={"keyboard-button"}>d</button>
            <button className={"keyboard-button"}>f</button>
            <button className={"keyboard-button"}>g</button>
            <button className={"keyboard-button"}>h</button>
            <button className={"keyboard-button"}>j</button>
            <button className={"keyboard-button"}>k</button>
            <button className={"keyboard-button"}>l</button>
        </div>
        <div className={"third-row"}>
            <button className={"w-20 font-extralight text-3xl border-2 border-gray-500"}>Del</button>
            <button className={"keyboard-button"}>z</button>
            <button className={"keyboard-button"}>x</button>
            <button className={"keyboard-button"}>c</button>
            <button className={"keyboard-button"}>v</button>
            <button className={"keyboard-button"}>b</button>
            <button className={"keyboard-button"}>n</button>
            <button className={"keyboard-button"}>m</button>
            <button className={"w-28 font-extralight text-3xl border-2 border-gray-500"}>Enter</button>
        </div>
    </div>
    </div>
  );
}

export default WordleGrid;

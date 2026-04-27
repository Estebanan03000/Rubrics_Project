import React, { useState, useEffect } from "react";
const Demo: React.FC = () => {
    //Aquí es la lógica
    
    let [name, setName] = useState<string>("nico");

    let age:number = 30;
    let isStudent:boolean = true;
    let hobbies:string[] = ["Reading", "Traveling", "Cooking"];
    let person:{name:string, age:number} = {name: "Felipe", age: 30};

    const sumar = (a: number, b: number) => {
        return a + b;
    }

    //Aquí es el renderizado
    return (
        <div>
            <h1>Hola mundo mi querid@ {name}</h1>
            <p>Usted tiene {age} años.</p>
            <p>Usted es {age>=18? "mayor" : "menor"} de edad</p>
            <p>Sus hobbies son:</p>
            <ul>
                {hobbies.map((hobby, index) => (
                    <li key={index}>{hobby}</li>
                ))}
            </ul>
                <input type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
            />
        </div>
    );
}
export default Demo;
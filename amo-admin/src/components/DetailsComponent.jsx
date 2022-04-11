import React from "react";

export default function DetailsComponent({list}) {
    var key = Object.keys(list)
    console.log(key)
  return (
      <>
      {key.map((e)=>{
       return(
            <tr>
                <th className="custom-th">{e}</th>
                <td className="custom-td">{list[e]}</td>
            </tr>
           ) 
           
      })}

      </>
  )
  
}

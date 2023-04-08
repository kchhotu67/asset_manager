import React from 'react'

function CenterText({text}) {
  return (
    <div 
        style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
        {text}
    </div>
  )
}

export default CenterText
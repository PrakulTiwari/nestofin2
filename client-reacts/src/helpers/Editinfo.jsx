import React,{useState} from 'react'



export default function Editinfo(props) {
    
    const hide = (event) =>{
        if(event.target.className==='backdrop')
        props.toggle()
    }
    

    return (
        <div className='backdrop' onClick={hide} style={{display:props.display,justifyContent:'center',alignItems:'center',position:'fixed',top:'0',left:'0',zIndex:'10000',backgroundColor:'rgba(0, 0, 0, 0.7)',height:'100vh',width:'100vw'}}>
            <div className='text-center'  style={{backgroundColor:'white', minWidth:'maxcontent',padding:'20px 10px'}}>
                {props.children}
            </div>
        </div>
    )
}
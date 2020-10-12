import React,{useState,useEffect} from 'react'
import socketIOClient from 'socket.io-client'


export default function Displayyolk() {
    
    const [yolkcount, setyolkcount] = useState(0);
    
      useEffect(() => {
        const socket = socketIOClient('http://localhost:5000');
        socket.on('updateYolk', data=>{
            console.log('UPDATE YOLK COUNT')
          setyolkcount(data.count);
        });


        return ()=> socket.disconnect();
      }, []);
    return (
        <div id='display'>
            {yolkcount}
        </div>
    )
}

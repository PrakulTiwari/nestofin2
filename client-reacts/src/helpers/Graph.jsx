import React,{useState} from 'react'
import {Bar} from 'react-chartjs-2';

export default function Graph() {
    
    const data = {
        labels: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May'
        ],
        datasets: [
            {
                label: 'Profit For 2020 (M)',
                backgroundColor:'royalblue',
                data: [3, 2, 2, 10, 5]
            },
            {
                label: 'Profit For 2019 (M)',
                backgroundColor:'blue',
                data: [10, 5, 6, 3, 5]
            }//we can add as many bar sets by making each diffrent sets a diffrent object
        ]
    }

    const options ={
        maintainAspectRatio: false,
        scales: {
            yAxes:[
                {
                    ticks:{
                        min:0,
                        max:10,
                        stepSize:1
                    }
                }
            ]
        }
    }

    return (
            <Bar data={data} options={options}/>
    )
}

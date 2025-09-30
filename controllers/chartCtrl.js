async function RenderCanvas() {
    let data = []
    try{
        let res = await fetch(`${ServerURL}/weather`)
        weather = await res.json()
        weather = weather.sort((a, b) => a['date'].localeCompare(b['date']))
 
        weather.forEach(w => {
            wObj = {
                label: w.date,
                y: [Number(w.minTemp),Number(w.maxTemp)],
                name: w.weatherType
            }
            data.push(wObj)
        });
    } catch(error){
        console.log(error)
    }
 
    let maxWeather = 0

    weather.forEach(w => {
        if(Number(w.maxTemp) >= maxWeather) {
            maxWeather = w.maxTemp
        }
    })
 
    var chart = new CanvasJS.Chart("chartContainer", {
        title:{
            text: "Időjárás előrejelzés"              
        },
        axisY: {
            suffix: " °C",
            maximum: Number(maxWeather) + 10,
            gridThickness: 0
        },
        toolTip:{
            shared: true,
            content: "Időjárás: <strong>{name} </strong> </br> Hőmérséklet: </br> Min: {y[0]} °C, Max: {y[1]} °C"
        },
        data: [{
            type: "rangeSplineArea",
            fillOpacity: 0.1,
            color: "#0275d8",
            indexLabelFormatter: formatter,
            dataPoints: data
        }]
    })

    chart.render()

    var images = []
   
    addImages(chart)
   
    function addImages(chart) {
        for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
            var weatherType = chart.data[0].dataPoints[i].name
            var img = null

            if (weatherType == "Napsütés") {
                img = $("<img>")
                .attr("src", "./img/napsutes.svg")
                // ha darkmode, akkor: .css("filter", "invert(1)")
            }
            else if (weatherType == "Felhőzet") {
                img = $("<img>").attr("src", "./img/felhozet.svg")
            }
            else if (weatherType == "Eső") {
                img = $("<img>").attr("src", "./img/eso.svg")
            }
            else if (weatherType == "Zápor") {
                img = $("<img>").attr("src", "./img/zapor.svg")
            }
            else if (weatherType == "Zivatar") {
                img = $("<img>").attr("src", "./img/zivatar.svg")
            }
            else if (weatherType == "Szél") {
                img = $("<img>").attr("src", "./img/szel.svg")
            }
            else if (weatherType == "Hó") {
                img = $("<img>").attr("src", "./img/ho.svg")
            }
            else if (weatherType == "Jégeső") {
                img = $("<img>").attr("src", "./img/jegeso.svg")
            }
            else if (weatherType == "Párolgás") {
                img = $("<img>").attr("src", "./img/parolgas.svg")
            }else if (weatherType == "Köd") {
                img = $("<img>").attr("src", "./img/köd.svg")
            }

            if (img) {
                images.push(img)
                img.attr("class", weatherType).appendTo($("#chartContainer>.canvasjs-chart-container"))
                positionImage(img, i)
            }
        }
    }
    
    function positionImage(image, index) {
        var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x)
        var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum)
   
        image.width("40px")
        .css({ "left": imageCenter - 20 + "px",
        "position": "absolute","top":imageTop + "px",
        "position": "absolute"})
    }
   
    $( window ).resize(function() {
        var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;   
        var imageCenter = 0
        for(var i=0;i<chart.data[0].dataPoints.length;i++) {
            imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20
            if(chart.data[0].dataPoints[i].name == "cloudy") {                  
                $(".cloudy").eq(cloudyCounter++).css({ "left": imageCenter})
            } else if(chart.data[0].dataPoints[i].name == "rainy") {
                $(".rainy").eq(rainyCounter++).css({ "left": imageCenter})
            } else if(chart.data[0].dataPoints[i].name == "sunny") {
                $(".sunny").eq(sunnyCounter++).css({ "left": imageCenter})
            }                
        }
    });
   
    function formatter(e) {
        if(e.index === 0 && e.dataPoint.x === 0) {
            return " Min " + e.dataPoint.y[e.index] + "°"
        } else if(e.index == 1 && e.dataPoint.x === 0) {
            return " Max " + e.dataPoint.y[e.index] + "°"
        } else{
            return e.dataPoint.y[e.index] + "°"
        }
    }
}